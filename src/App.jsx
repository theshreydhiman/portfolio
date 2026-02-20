import { useState, useCallback, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Loader from './components/Loader'
import CustomCursor from './components/CustomCursor'
import ScrollProgress from './components/ScrollProgress'
import Navbar from './components/Navbar'
import TabBar from './components/TabBar'
import SwipeHint from './components/SwipeHint'
import ThreeScene from './components/ThreeScene'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import ExperienceSection from './components/ExperienceSection'
import ProjectsSection from './components/ProjectsSection'
import ContactSection from './components/ContactSection'

gsap.registerPlugin(ScrollTrigger)

const PAGES = ['home', 'about', 'experience', 'projects', 'contact']

const PAGE_COMPONENTS = {
    home: HeroSection,
    about: AboutSection,
    experience: ExperienceSection,
    projects: ProjectsSection,
    contact: ContactSection,
}

export default function App() {
    const [activePage, setActivePage] = useState('home')
    const [loaderDone, setLoaderDone] = useState(false)
    const [threeReveal, setThreeReveal] = useState(false)
    const [swipeHintDismissed, setSwipeHintDismissed] = useState(false)

    // Swipe state
    const pageWrapRef = useRef(null)
    const isAnimating = useRef(false)
    const pendingDir = useRef(null) // 'left' | 'right' — set before page change, consumed after

    const handleLoaderComplete = useCallback(() => {
        setLoaderDone(true)
        setThreeReveal(true)
    }, [])

    // Regular (non-swipe) page change — tab bar, menu, buttons
    const handlePageChange = useCallback((page) => {
        ScrollTrigger.getAll().forEach(st => st.kill())
        isAnimating.current = false
        pendingDir.current = null
        setActivePage(page)
        window.scrollTo({ top: 0 })
    }, [])

    // Swipe-initiated page change: slide current page out, then change
    const swipeTo = useCallback((newPage, direction) => {
        if (isAnimating.current) return
        isAnimating.current = true
        pendingDir.current = direction

        const el = pageWrapRef.current
        if (!el) {
            handlePageChange(newPage)
            isAnimating.current = false
            return
        }

        ScrollTrigger.getAll().forEach(st => st.kill())

        gsap.to(el, {
            x: direction === 'left' ? '-100vw' : '100vw',
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                setActivePage(newPage)
                window.scrollTo({ top: 0 })
            },
        })
    }, [handlePageChange])

    // After activePage updates: slide new page in (swipe) or just reset (tab click)
    useEffect(() => {
        const el = pageWrapRef.current
        if (!el) return

        if (!pendingDir.current) {
            // Non-swipe navigation — reset wrapper cleanly
            gsap.set(el, { x: 0, opacity: 1 })
            return
        }

        const dir = pendingDir.current
        pendingDir.current = null

        gsap.fromTo(
            el,
            { x: dir === 'left' ? '100vw' : '-100vw', opacity: 0 },
            {
                x: 0, opacity: 1,
                duration: 0.38,
                ease: 'power2.out',
                onComplete: () => { isAnimating.current = false },
            }
        )
    }, [activePage])

    // Touch swipe detection with live drag-follow
    useEffect(() => {
        let startX = 0
        let startY = 0
        let startTime = 0
        let blocked = false
        let dragging = false

        const onTouchStart = (e) => {
            // Ignore touches on form elements or the tab bar
            const tag = e.target.tagName.toLowerCase()
            if (['input', 'textarea', 'select', 'button'].includes(tag)) { blocked = true; return }
            if (e.target.closest('#tabBar')) { blocked = true; return }

            blocked = false
            dragging = false
            startX = e.touches[0].clientX
            startY = e.touches[0].clientY
            startTime = Date.now()

            // Kill any in-progress swipe animation so the user can re-grab
            if (pageWrapRef.current) gsap.killTweensOf(pageWrapRef.current)
        }

        const onTouchMove = (e) => {
            if (blocked || isAnimating.current) return
            const dx = e.touches[0].clientX - startX
            const dy = e.touches[0].clientY - startY

            if (!dragging) {
                if (Math.abs(dx) < 12) return             // wait for intent
                if (Math.abs(dy) > Math.abs(dx)) { blocked = true; return } // vertical scroll
                dragging = true
            }

            const idx = PAGES.indexOf(activePage)
            const canGoLeft  = dx < 0 && idx < PAGES.length - 1
            const canGoRight = dx > 0 && idx > 0
            if (!canGoLeft && !canGoRight) return

            // Dampened drag-follow (page lightly tracks the finger)
            const drag = dx * 0.3
            const fade = 1 - Math.abs(dx) / (window.innerWidth * 1.6)
            gsap.set(pageWrapRef.current, { x: drag, opacity: Math.max(0.4, fade) })
        }

        const onTouchEnd = (e) => {
            if (blocked) return

            const dx = e.changedTouches[0].clientX - startX
            const dy = e.changedTouches[0].clientY - startY
            const dt = Date.now() - startTime

            const isSwipe = Math.abs(dx) >= 55
                         && Math.abs(dy) <= Math.abs(dx) * 0.8
                         && dt <= 650

            const idx = PAGES.indexOf(activePage)

            if (!isAnimating.current && isSwipe) {
                setSwipeHintDismissed(true)
                if (dx < 0 && idx < PAGES.length - 1) {
                    swipeTo(PAGES[idx + 1], 'left')
                } else if (dx > 0 && idx > 0) {
                    swipeTo(PAGES[idx - 1], 'right')
                } else if (dragging) {
                    // Edge of page list — spring back
                    gsap.to(pageWrapRef.current, { x: 0, opacity: 1, duration: 0.45, ease: 'back.out(2)' })
                }
            } else if (dragging) {
                // Didn't reach threshold — spring back
                gsap.to(pageWrapRef.current, { x: 0, opacity: 1, duration: 0.45, ease: 'back.out(2)' })
            }

            dragging = false
        }

        document.addEventListener('touchstart', onTouchStart, { passive: true })
        document.addEventListener('touchmove',  onTouchMove,  { passive: true })
        document.addEventListener('touchend',   onTouchEnd,   { passive: true })

        return () => {
            document.removeEventListener('touchstart', onTouchStart)
            document.removeEventListener('touchmove',  onTouchMove)
            document.removeEventListener('touchend',   onTouchEnd)
        }
    }, [activePage, swipeTo])

    const ActivePage = PAGE_COMPONENTS[activePage]

    return (
        <>
            {!loaderDone && <Loader onComplete={handleLoaderComplete} />}
            <ThreeScene reveal={threeReveal} />
            <CustomCursor />
            <ScrollProgress />
            <Navbar activePage={activePage} onPageChange={handlePageChange} />
            <TabBar activePage={activePage} onPageChange={handlePageChange} />
            <SwipeHint dismissed={swipeHintDismissed} loaderDone={loaderDone} />
            <div ref={pageWrapRef}>
                <ActivePage
                    key={activePage}
                    onViewWork={() => handlePageChange('projects')}
                />
            </div>
        </>
    )
}
