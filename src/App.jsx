import { useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Loader from './components/Loader'
import CustomCursor from './components/CustomCursor'
import ScrollProgress from './components/ScrollProgress'
import Navbar from './components/Navbar'
import TabBar from './components/TabBar'
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

    // Refs for animation state (avoid stale closures in touch handlers)
    const activePageRef = useRef('home')
    const pageWrapperRef = useRef(null)
    const isAnimatingRef = useRef(false)
    const pendingEnterXRef = useRef(null) // enterX offset to animate from after state change
    const touchStartRef = useRef(null)

    const handleLoaderComplete = useCallback(() => {
        setLoaderDone(true)
        setThreeReveal(true)
    }, [])

    /**
     * Core slide transition.
     * direction: 'left'  → current page exits left,  next page enters from right
     * direction: 'right' → current page exits right, next page enters from left
     */
    const navigateWithSlide = useCallback((page, direction) => {
        if (isAnimatingRef.current || page === activePageRef.current) return
        isAnimatingRef.current = true

        const wrapper = pageWrapperRef.current
        const exitX  = direction === 'left' ? '-100%' : '100%'
        const enterX = direction === 'left' ?  '100%' : '-100%'

        const commitChange = () => {
            ScrollTrigger.getAll().forEach(st => st.kill())
            // Position wrapper off-screen on the entering side BEFORE react re-renders
            if (wrapper) gsap.set(wrapper, { x: enterX })
            pendingEnterXRef.current = enterX
            activePageRef.current = page
            setActivePage(page)
            window.scrollTo({ top: 0 })
        }

        if (!wrapper) {
            commitChange()
            isAnimatingRef.current = false
            return
        }

        gsap.to(wrapper, {
            x: exitX,
            duration: 0.32,
            ease: 'power2.in',
            onComplete: commitChange,
        })
    }, [])

    /**
     * After React commits the new page component, slide it in from enterX → 0.
     * useLayoutEffect fires before the browser paints, preventing any visible flash.
     */
    useLayoutEffect(() => {
        if (pendingEnterXRef.current === null) return
        pendingEnterXRef.current = null

        const wrapper = pageWrapperRef.current
        if (!wrapper) {
            isAnimatingRef.current = false
            return
        }

        gsap.to(wrapper, {
            x: 0,
            duration: 0.36,
            ease: 'power2.out',
            onComplete: () => { isAnimatingRef.current = false },
        })
    }, [activePage])

    /**
     * Public page-change handler (used by Navbar & TabBar).
     * Determines slide direction from tab order automatically.
     */
    const handlePageChange = useCallback((page) => {
        if (isAnimatingRef.current || page === activePageRef.current) return
        const curIdx = PAGES.indexOf(activePageRef.current)
        const nxtIdx = PAGES.indexOf(page)
        navigateWithSlide(page, nxtIdx > curIdx ? 'left' : 'right')
    }, [navigateWithSlide])

    /**
     * Touch swipe detection (mobile only).
     * • Swipe left  → next page
     * • Swipe right → previous page
     * Only fires when horizontal delta dominates vertical (avoids false triggers on scroll).
     */
    useEffect(() => {
        const onTouchStart = (e) => {
            if (isAnimatingRef.current) return
            touchStartRef.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
            }
        }

        const onTouchEnd = (e) => {
            if (!touchStartRef.current || isAnimatingRef.current) return
            const dx = e.changedTouches[0].clientX - touchStartRef.current.x
            const dy = e.changedTouches[0].clientY - touchStartRef.current.y
            touchStartRef.current = null

            // Minimum 60 px horizontal travel AND horizontal > 1.5× vertical
            if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return

            const curIdx = PAGES.indexOf(activePageRef.current)
            const dir    = dx < 0 ? 'left' : 'right'
            const nxtIdx = dir === 'left' ? curIdx + 1 : curIdx - 1

            if (nxtIdx < 0 || nxtIdx >= PAGES.length) return
            navigateWithSlide(PAGES[nxtIdx], dir)
        }

        document.addEventListener('touchstart', onTouchStart, { passive: true })
        document.addEventListener('touchend',   onTouchEnd,   { passive: true })
        return () => {
            document.removeEventListener('touchstart', onTouchStart)
            document.removeEventListener('touchend',   onTouchEnd)
        }
    }, [navigateWithSlide])

    const ActivePage = PAGE_COMPONENTS[activePage]

    return (
        <>
            {!loaderDone && <Loader onComplete={handleLoaderComplete} />}
            <ThreeScene reveal={threeReveal} />
            <CustomCursor />
            <ScrollProgress />
            <Navbar activePage={activePage} onPageChange={handlePageChange} />
            <TabBar activePage={activePage} onPageChange={handlePageChange} />
            <div ref={pageWrapperRef} className="page-transition-wrapper">
                <ActivePage
                    key={activePage}
                    onViewWork={() => handlePageChange('projects')}
                />
            </div>
        </>
    )
}
