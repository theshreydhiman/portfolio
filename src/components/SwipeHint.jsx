import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const SESSION_KEY = 'swipeHintSeen'

export default function SwipeHint({ dismissed, loaderDone }) {
    const pillRef  = useRef(null)
    const arrowLRef = useRef(null)
    const arrowRRef = useRef(null)
    const [hidden, setHidden] = useState(false)

    const alreadySeen = typeof sessionStorage !== 'undefined'
        && sessionStorage.getItem(SESSION_KEY) === '1'

    // Auto-show and auto-dismiss timeline
    useEffect(() => {
        const isTouch = window.matchMedia('(pointer: coarse)').matches
        if (!isTouch || alreadySeen || !loaderDone) return

        const pill = pillRef.current
        const arL  = arrowLRef.current
        const arR  = arrowRRef.current
        if (!pill || !arL || !arR) return

        const tl = gsap.timeline({ delay: 1.2 })

        // Phase 1: fade in
        tl.fromTo(pill,
            { opacity: 0, y: 18, scale: 0.92 },
            { opacity: 1, y: 0,  scale: 1, duration: 0.55, ease: 'power3.out' }
        )

        // Phase 2: arrows nudge outward to reinforce direction
        tl.to(arL, {
            keyframes: [
                { x: -5, duration: 0.28, ease: 'power1.inOut' },
                { x:  0, duration: 0.28, ease: 'power1.inOut' },
            ],
            repeat: 3,
        }, '+=0.1')
        tl.to(arR, {
            keyframes: [
                { x:  5, duration: 0.28, ease: 'power1.inOut' },
                { x:  0, duration: 0.28, ease: 'power1.inOut' },
            ],
            repeat: 3,
        }, '<0.12')

        // Phase 3: auto-dismiss
        tl.to(pill, {
            opacity: 0, y: 14, scale: 0.9,
            duration: 0.45, ease: 'power2.in',
            onComplete: () => {
                sessionStorage.setItem(SESSION_KEY, '1')
                setHidden(true)
            },
        }, '+=2.0')

        return () => { tl.kill() }
    }, [loaderDone, alreadySeen])

    // Dismiss immediately on first real swipe
    useEffect(() => {
        if (!dismissed) return
        const pill = pillRef.current
        if (!pill) return

        gsap.killTweensOf(pill)
        gsap.to(pill, {
            opacity: 0, y: 14, scale: 0.9,
            duration: 0.3, ease: 'power2.in',
            onComplete: () => {
                sessionStorage.setItem(SESSION_KEY, '1')
                setHidden(true)
            },
        })
    }, [dismissed])

    if (alreadySeen || hidden) return null

    return (
        <div className="swipe-hint-pill" ref={pillRef} aria-hidden="true">
            <span className="swipe-hint-arrow" ref={arrowLRef}>&#8592;</span>
            <span className="swipe-hint-label">Swipe to navigate</span>
            <span className="swipe-hint-arrow" ref={arrowRRef}>&#8594;</span>
        </div>
    )
}
