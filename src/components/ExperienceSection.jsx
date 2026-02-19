import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Footer from './Footer'

gsap.registerPlugin(ScrollTrigger)

const EXPERIENCES = [
    {
        date: 'DEC 2025 — PRESENT',
        role: 'Senior Software Engineer',
        company: 'CrownStack · The Current Cave',
        bullets: [
            'Full-stack ownership of new modules — architecture to deployment',
            'Bigger problems, better tools, fewer 2 AM deployment surprises',
            <em key="story">Story still being written. Check back soon.</em>,
        ],
        quip: '"Promoted to Senior. The cape got an upgrade."',
    },
    {
        date: 'OCT 2021 — DEC 2025 · ~4 YEARS',
        role: 'FullStack Engineer',
        company: 'Aapna Infotech · The Origin Arc',
        bullets: [
            'Gathered requirements with BAs — translating human to code',
            'Designed system architecture for new modules and enhancements',
            'Developed, tested, deployed end-to-end across multiple environments',
            'Maintained code quality with SonarQube; managed production deployments',
            <>Increased dev speed by <em>30%</em> through GitHub Copilot adoption</>,
            'Won two VP-level performance awards without specifically asking for them',
        ],
        quip: '"Four years. Two awards. Zero critical incidents I\'ll admit to."',
    },
]

export default function ExperienceSection() {
    const sectionRef = useRef(null)

    useEffect(() => {
        const root = sectionRef.current
        if (!root) return

        const reveals = root.querySelectorAll('.gsap-reveal')
        gsap.set(reveals, { opacity: 0, y: 36 })

        const triggers = []
        reveals.forEach((el, i) => {
            const anim = gsap.to(el, {
                opacity: 1, y: 0, duration: 0.75, delay: i * 0.1, ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
            })
            if (anim.scrollTrigger) triggers.push(anim.scrollTrigger)
        })

        // Timeline line draw
        const tlLine = root.querySelector('#tlLine')
        if (tlLine) {
            gsap.to(tlLine, { height: '100%', duration: 1.6, delay: 0.5, ease: 'power2.out' })
        }

        return () => triggers.forEach(st => st.kill())
    }, [])

    return (
        <div className="page active" ref={sectionRef}>
            <div className="section">
                <div className="section-eyebrow gsap-reveal">The Gotham Files</div>
                <div className="section-title-big gsap-reveal">Where I've<br />Fought Crime.</div>
                <div className="section-sub gsap-reveal">(Software crime. Mostly race conditions and memory leaks.)</div>
                <div className="timeline">
                    <div className="tl-line" id="tlLine"></div>
                    {EXPERIENCES.map((exp, i) => (
                        <div className="exp-item gsap-reveal" key={i}>
                            <div className="exp-dot"></div>
                            <div className="exp-date">{exp.date}</div>
                            <div className="exp-role">{exp.role}</div>
                            <div className="exp-co">{exp.company}</div>
                            <ul className="exp-bullets">
                                {exp.bullets.map((b, j) => <li key={j}>{b}</li>)}
                            </ul>
                            <div className="exp-quip">{exp.quip}</div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer left="SHREY DHIMAN · 2025" right={`"I am the night. And the sprint deadline."`} />
        </div>
    )
}
