import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Footer from './Footer'

gsap.registerPlugin(ScrollTrigger)

const SKILL_GROUPS = [
    {
        label: 'Frontend — The Visible Work', chips: [
            { name: 'React.js', cls: 'g' }, { name: 'Redux', cls: 'g' },
            { name: 'TypeScript', cls: 'g' }, { name: 'JavaScript', cls: 'g' },
        ]
    },
    {
        label: 'Backend — The Real Work', chips: [
            { name: 'Node.js', cls: 'g' }, { name: 'Express.js', cls: 'g' },
            { name: 'Hapi.js', cls: 'g' }, { name: 'REST APIs', cls: 'g' },
        ]
    },
    {
        label: 'Databases — Where Logic Goes to Live', chips: [
            { name: 'MySQL', cls: 'g' }, { name: 'MongoDB', cls: 'g' }, { name: 'SQL Server', cls: 'd' },
        ]
    },
    {
        label: 'DevOps & Cloud — The "It\'s Not Down" Stack', chips: [
            { name: 'AWS', cls: 'g' }, { name: 'Docker', cls: 'g' },
            { name: 'Kubernetes', cls: 'g' }, { name: 'Linux', cls: 'd' },
        ]
    },
    {
        label: 'The Utility Belt', chips: [
            { name: 'GitHub', cls: 'd' }, { name: 'JIRA', cls: 'd' },
            { name: 'SonarQube', cls: 'd' }, { name: 'Postman', cls: 'd' },
            { name: 'Grafana', cls: 'd' }, { name: 'GitHub Copilot', cls: 'd' },
        ]
    },
]

export default function AboutSection() {
    const sectionRef = useRef(null)

    useEffect(() => {
        const root = sectionRef.current
        if (!root) return

        const allReveals = root.querySelectorAll('.gsap-reveal')
        gsap.set(allReveals, { opacity: 0, y: 36 })

        // Header elements are above the fold at page load — animate directly (no ScrollTrigger)
        const topEls = [
            root.querySelector('.section-eyebrow'),
            root.querySelector('.section-title-big'),
            root.querySelector('.section-sub'),
        ].filter(Boolean)
        gsap.to(topEls, { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out', stagger: 0.12, delay: 0.1 })

        // Below-fold elements — reveal on scroll
        const scrollEls = [...allReveals].filter(el => !topEls.includes(el))
        const triggers = []
        scrollEls.forEach((el, i) => {
            const anim = gsap.to(el, {
                opacity: 1, y: 0, duration: 0.75, delay: i * 0.1, ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
            })
            if (anim.scrollTrigger) triggers.push(anim.scrollTrigger)
        })

        // Chip stagger
        const chipGroups = root.querySelectorAll('.chips')
        const chipHandlers = []
        chipGroups.forEach(group => {
            const onEnter = () => {
                gsap.to(group.querySelectorAll('.chip'), { y: -3, stagger: 0.04, duration: 0.3, ease: 'power2.out' })
            }
            const onLeave = () => {
                gsap.to(group.querySelectorAll('.chip'), { y: 0, stagger: 0.04, duration: 0.3, ease: 'power2.out' })
            }
            group.addEventListener('mouseenter', onEnter)
            group.addEventListener('mouseleave', onLeave)
            chipHandlers.push(() => {
                group.removeEventListener('mouseenter', onEnter)
                group.removeEventListener('mouseleave', onLeave)
            })
        })

        return () => {
            triggers.forEach(st => st.kill())
            chipHandlers.forEach(fn => fn())
        }
    }, [])

    return (
        <div className="page active" ref={sectionRef}>
            <div className="section">
                <div className="section-eyebrow gsap-reveal">Origin Story</div>
                <div className="section-title-big gsap-reveal">Not Billionaire.<br />But Close Enough.</div>
                <div className="section-sub gsap-reveal">(In terms of code shipped, at least.)</div>
                <div className="about-grid">
                    <div className="about-text gsap-reveal">
                        <p>Computer Science grad from IEC College (2020). Turned professional in 2021 — and haven't really stopped. Specialising in <em>Node.js, React.js, AWS</em>, and building systems that don't fall apart at 3× load.</p>
                        <p>4 years at Aapna Infotech, where I went from "new joiner" to "the person you call when something breaks." Designed architecture, owned deployments, made GitHub Copilot earn its keep — boosting team speed by <em>30%</em>.</p>
                        <div className="about-punchline">"I don't just write code. I write code that other engineers actually want to read — and that, apparently, is rare enough to win awards for."</div>
                        <p>Currently at CrownStack as Senior Software Engineer, where the problems are bigger and the coffee budget is (hopefully) better.</p>
                    </div>
                    <div className="gsap-reveal">
                        {SKILL_GROUPS.map((group, i) => (
                            <div className="skill-group" key={i}>
                                <div className="skill-group-lbl">{group.label}</div>
                                <div className="chips">
                                    {group.chips.map((chip, j) => (
                                        <div className={`chip ${chip.cls}`} key={j}>{chip.name}</div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer left="SHREY DHIMAN · 2025" right={`"The Dark Code rises."`} />
        </div>
    )
}
