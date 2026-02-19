import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
    const curRef = useRef(null)
    const ringRef = useRef(null)
    const pulseRef = useRef(null)
    const mouse = useRef({ x: 0, y: 0 })
    const ring = useRef({ x: 0, y: 0 })
    const pulse = useRef({ x: 0, y: 0 })

    useEffect(() => {
        const cur = curRef.current
        const ringEl = ringRef.current
        const pulseEl = pulseRef.current
        if (!cur || !ringEl || !pulseEl) return

        const onMouseMove = (e) => {
            mouse.current.x = e.clientX
            mouse.current.y = e.clientY
            gsap.to(cur, { x: e.clientX, y: e.clientY, duration: 0.072, ease: 'none' })
        }

        let rafId
        const trailLoop = () => {
            ring.current.x += (mouse.current.x - ring.current.x) * 0.11
            ring.current.y += (mouse.current.y - ring.current.y) * 0.11
            pulse.current.x += (mouse.current.x - pulse.current.x) * 0.077
            pulse.current.y += (mouse.current.y - pulse.current.y) * 0.077
            gsap.set(ringEl, { x: ring.current.x, y: ring.current.y })
            gsap.set(pulseEl, { x: pulse.current.x, y: pulse.current.y })
            rafId = requestAnimationFrame(trailLoop)
        }

        const onEnterClickable = () => {
            if (!cur.classList.contains('bat-mode')) {
                cur.classList.add('big')
                ringEl.classList.add('big')
            }
        }
        const onLeaveClickable = () => {
            cur.classList.remove('big')
            ringEl.classList.remove('big')
        }

        const enterBatMode = () => {
            cur.classList.remove('big')
            ringEl.classList.remove('big')
            cur.classList.add('bat-mode')
            ringEl.classList.add('bat-mode')
            pulseEl.classList.add('active')
            gsap.fromTo(cur, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' })
            gsap.fromTo(cur, { rotation: -180 }, { rotation: 0, duration: 0.5, ease: 'back.out(1.5)' })
        }
        const exitBatMode = () => {
            cur.classList.remove('bat-mode')
            ringEl.classList.remove('bat-mode')
            pulseEl.classList.remove('active')
            gsap.fromTo(cur, { scale: 1.2 }, { scale: 1, duration: 0.35, ease: 'back.out(2)' })
        }

        // Hover for clickable elements
        const clickableSel = 'a,button,.btn-gold,.btn-ghost,.nav-cta,.tab,.chip,.proj-card,.ach-card,.tilt,.mag'

        const onMouseEnterDelegate = (e) => {
            if (e.target.matches && e.target.matches(clickableSel)) onEnterClickable()
            if (e.target.matches && e.target.matches('input, textarea, select')) enterBatMode()
        }
        const onMouseLeaveDelegate = (e) => {
            if (e.target.matches && e.target.matches(clickableSel)) onLeaveClickable()
            if (e.target.matches && e.target.matches('input, textarea, select')) exitBatMode()
        }
        const onFocusDelegate = (e) => {
            if (e.target.matches && e.target.matches('input, textarea, select')) enterBatMode()
        }
        const onBlurDelegate = (e) => {
            if (e.target.matches && e.target.matches('input, textarea, select')) exitBatMode()
        }

        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseenter', onMouseEnterDelegate, true)
        document.addEventListener('mouseleave', onMouseLeaveDelegate, true)
        document.addEventListener('focus', onFocusDelegate, true)
        document.addEventListener('blur', onBlurDelegate, true)

        rafId = requestAnimationFrame(trailLoop)

        return () => {
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseenter', onMouseEnterDelegate, true)
            document.removeEventListener('mouseleave', onMouseLeaveDelegate, true)
            document.removeEventListener('focus', onFocusDelegate, true)
            document.removeEventListener('blur', onBlurDelegate, true)
            cancelAnimationFrame(rafId)
        }
    }, [])

    return (
        <>
            <div id="cursor" ref={curRef}>🦇</div>
            <div id="cursor-trail" ref={ringRef}></div>
            <div id="cursor-bat-pulse" ref={pulseRef}></div>
        </>
    )
}
