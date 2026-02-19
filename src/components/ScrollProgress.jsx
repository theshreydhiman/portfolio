import { useEffect } from 'react'
import gsap from 'gsap'

export default function ScrollProgress() {
    useEffect(() => {
        const onScroll = () => {
            const nav = document.getElementById('nav')
            if (nav) nav.classList.toggle('scrolled', window.scrollY > 20)
            const total = document.documentElement.scrollHeight - window.innerHeight
            if (total > 0) {
                gsap.to('#progress-bar', { width: (window.scrollY / total * 100) + '%', duration: 0.1, ease: 'none' })
            }
        }
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <div id="progress">
            <div id="progress-bar"></div>
        </div>
    )
}
