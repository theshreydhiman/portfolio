import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const BAT_SVG_PATH = `
  M 100,99
  Q 113.5,76.5 128.5,64
  L 197,52
  L 124,48
  Q 116.5,44.5 110.5,35
  L 105.25,20
  L 100,30
  L 94.75,20
  L 89.5,35
  Q 83.5,44.5 76,48
  L 3,52
  L 71.5,64
  Q 86.5,76.5 100,99
  Z
`

export default function Loader({ onComplete }) {
    const loaderRef = useRef(null)
    const barRef = useRef(null)
    const pctRef = useRef(null)
    const arcRef = useRef(null)
    const [done, setDone] = useState(false)

    useEffect(() => {
        if (done) return
        const circumference = 2 * Math.PI * 69
        let progress = 0

        const tick = setInterval(() => {
            progress = Math.min(progress + 1.4, 100)
            const p = progress / 100
            if (arcRef.current) arcRef.current.style.strokeDashoffset = circumference * (1 - p)
            if (barRef.current) barRef.current.style.width = progress + '%'
            if (pctRef.current) pctRef.current.textContent = Math.round(progress) + '%'

            if (progress >= 100) {
                clearInterval(tick)
                setTimeout(() => {
                    if (!loaderRef.current) return
                    gsap.to(loaderRef.current, {
                        opacity: 0, duration: 0.7, ease: 'power2.inOut',
                        onComplete: () => {
                            setDone(true)
                            onComplete?.()
                        }
                    })
                }, 350)
            }
        }, 18)

        return () => clearInterval(tick)
    }, [done, onComplete])

    if (done) return null

    return (
        <div id="loader" ref={loaderRef}>
            <div className="loader-ring-wrap">
                <div className="loader-ring-outer"></div>
                <div className="loader-ring-inner"></div>
                <svg className="loader-arc" viewBox="0 0 140 140">
                    <circle ref={arcRef} cx="70" cy="70" r="69" />
                </svg>
                <div className="loader-bat-wrap">
                    <svg className="loader-bat" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#c9a84c" d={BAT_SVG_PATH} />
                    </svg>
                </div>
            </div>
            <div className="loader-progress-wrap">
                <div className="loader-progress-bar" ref={barRef}></div>
            </div>
            <div className="loader-label">Initialising the cave</div>
            <div className="loader-pct" ref={pctRef}>0%</div>
        </div>
    )
}
