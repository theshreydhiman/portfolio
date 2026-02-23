import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import Footer from './Footer'

gsap.registerPlugin(TextPlugin)

const QUOTES = [
    "I don't wear a cape. But I do fix production bugs at 2 AM.",
    "I don't always write tests. But when I do, they pass.",
    "It's not a bug. It's an undocumented feature — scheduled for Monday.",
]

const STATS = [
    { count: 4, suffix: '+', label: 'Years in the field' },
    { count: 30, suffix: '%', label: 'Faster dev cycles' },
    { count: 1, suffix: 'M+', label: 'Records optimised' },
    { count: 2, suffix: '×', label: 'VP-awarded' },
]

const CV_URL = 'https://drive.google.com/uc?export=download&id=1oLrHQ1GszIwR1MfkJ6cgR6XfLWaq8tNC'

export default function HeroSection({ onViewWork }) {
    const sectionRef = useRef(null)
    const quoteRef = useRef(null)
    const quoteIdx = useRef(0)
    const typewriterTimer = useRef(null)

    const startTypewriter = useCallback(() => {
        const el = quoteRef.current
        if (!el) return
        const q = QUOTES[quoteIdx.current++ % QUOTES.length]
        gsap.to(el, {
            duration: q.length * 0.038,
            text: { value: q, delimiter: '' },
            ease: 'none',
            onComplete: () => {
                typewriterTimer.current = setTimeout(() => {
                    gsap.to(el, {
                        duration: q.length * 0.018,
                        text: { value: '', delimiter: '' },
                        ease: 'none',
                        onComplete: () => {
                            typewriterTimer.current = setTimeout(startTypewriter, 500)
                        }
                    })
                }, 2800)
            }
        })
    }, [])

    const runCounters = useCallback(() => {
        const root = sectionRef.current
        if (!root) return
        root.querySelectorAll('.stat-val[data-count]').forEach(el => {
            const target = +el.dataset.count
            const suffix = el.dataset.suffix || ''
            gsap.to({ val: 0 }, {
                val: target, duration: 1.6, ease: 'power2.out',
                onUpdate: function () { el.textContent = Math.round(this.targets()[0].val) + suffix }
            })
        })
    }, [])

    // Hero entry animation
    const bootHero = useCallback(() => {
        const tl = gsap.timeline()

        // Only animate nav chrome on first load (not on revisit)
        if (gsap.getProperty('.nav-logo', 'opacity') < 1) {
            tl.to('.nav-logo', { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }, 0.1)
            tl.to('#tabBar', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.2)
        }

        tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.3)
        tl.to('.hero-name', { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.4)' }, 0.5)
        tl.to('.hero-sub', { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.85)
        tl.to('.hero-quote-wrap', { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.95)
        tl.add(() => startTypewriter(), 1.1)
        tl.to('.hero-quote-foot', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 1.1)
        tl.to('.hero-btns', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 1.2)
        tl.to('.hero-stats', { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 1.3)
        tl.to('#heroCard', { opacity: 1, y: 0, x: 0, duration: 0.8, ease: 'power2.out' }, 0.9)
        tl.add(() => runCounters(), 1.4)

        // Pulse dot
        gsap.to('#pulseDot', {
            boxShadow: '0 0 0 8px rgba(45,90,39,0)',
            scale: 1.3, duration: 1.5, repeat: -1, yoyo: true, ease: 'power2.inOut'
        })
    }, [startTypewriter, runCounters])

    // Set initial hidden states and run boot
    useEffect(() => {
        gsap.set(['.hero-eyebrow', '.hero-name', '.hero-sub', '.hero-quote-wrap', '.hero-quote-foot', '.hero-btns', '.hero-stats'], { opacity: 0, y: 24 })
        gsap.set('#heroCard', { opacity: 0, y: 16, x: 10 })

        // Small delay to let mount happen
        const id = setTimeout(bootHero, 100)
        return () => {
            clearTimeout(id)
            if (typewriterTimer.current) clearTimeout(typewriterTimer.current)
        }
    }, [bootHero])

    // 3D tilt on hero card
    useEffect(() => {
        const card = document.getElementById('heroCard')
        if (!card) return
        const onMove = (e) => {
            const r = card.getBoundingClientRect()
            const x = ((e.clientX - r.left) / r.width - 0.5) * 2
            const y = ((e.clientY - r.top) / r.height - 0.5) * 2
            gsap.to(card, {
                rotationY: x * 10, rotationX: -y * 8,
                transformPerspective: 800, ease: 'power2.out', duration: 0.4,
                boxShadow: `${-x * 12}px ${y * 12}px 40px rgba(201,168,76,.12)`
            })
        }
        const onLeave = () => {
            gsap.to(card, { rotationY: 0, rotationX: 0, boxShadow: 'none', duration: 0.6, ease: 'elastic.out(1,.5)' })
        }
        card.addEventListener('mousemove', onMove)
        card.addEventListener('mouseleave', onLeave)
        return () => {
            card.removeEventListener('mousemove', onMove)
            card.removeEventListener('mouseleave', onLeave)
        }
    }, [])

    // Magnetic buttons
    useEffect(() => {
        const root = sectionRef.current
        if (!root) return
        const mags = root.querySelectorAll('.mag')
        const handlers = []
        mags.forEach(el => {
            const onMove = (e) => {
                const r = el.getBoundingClientRect()
                const x = (e.clientX - r.left - r.width / 2) * 0.35
                const y = (e.clientY - r.top - r.height / 2) * 0.35
                gsap.to(el, { x, y, duration: 0.4, ease: 'power2.out' })
            }
            const onLeave = () => {
                gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,.5)' })
            }
            el.addEventListener('mousemove', onMove)
            el.addEventListener('mouseleave', onLeave)
            handlers.push(() => {
                el.removeEventListener('mousemove', onMove)
                el.removeEventListener('mouseleave', onLeave)
            })
        })
        return () => handlers.forEach(fn => fn())
    }, [])

    return (
        <div className="page active" ref={sectionRef}>
            <div className="hero-wrap">
                <div className="hero-content">
                    <div className="hero-left">
                        <div className="hero-eyebrow">↳ Available for hire · Delhi NCR · Open to remote</div>
                        <div className="hero-name">Shrey<br /><span className="gld">Dhiman</span></div>
                        <div className="hero-sub">Senior Software Engineer · Full Stack · 4+ Years</div>
                        <div className="hero-quote-wrap">
                            <div className="hero-quote" ref={quoteRef}></div>
                        </div>
                        <div className="hero-quote-foot">// and I've shipped enough code to prove it.</div>
                        <div className="hero-btns">
                            <div className="btn-gold mag" onClick={onViewWork}><span>View My Work</span></div>
                            <a className="btn-ghost" href={CV_URL} target="_blank" rel="noopener noreferrer">Download CV</a>
                        </div>
                        <div className="hero-stats">
                            {STATS.map((s, i) => (
                                <div key={i}>
                                    <span className="stat-val" data-count={s.count} data-suffix={s.suffix}>0{s.suffix}</span>
                                    <span className="stat-lbl">{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="hero-card tilt" id="heroCard">
                        <div className="hero-card-lbl">Currently At</div>
                        <p><span className="pulse-dot" id="pulseDot"></span><em>Senior Software Engineer</em> @ CrownStack</p>
                        <br />
                        <p style={{ fontSize: '12px', marginTop: '6px' }}>Previously: Aapna Infotech — where I turned coffee and requirements into shipped features for 4 years straight.</p>
                    </div>
                </div>
            </div>
            <Footer
                left="SHREY DHIMAN · SENIOR SOFTWARE ENGINEER · 2025"
                right={`"I work in the dark to serve the light." — also just good commit hygiene.`}
            />
        </div>
    )
}
