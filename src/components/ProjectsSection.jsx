import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Footer from './Footer'

gsap.registerPlugin(ScrollTrigger)

const PROJECTS = [
    {
        num: '01',
        tag: '↳ Enterprise Platform',
        title: 'The Closing Exchange',
        desc: 'End-to-end enterprise platform with real-time comms, document workflows, and multi-vendor integrations. Primary technical contact — every bug, every clarification, every 11 PM Slack message.',
        quip: '"Stripe, Nylas, Google APIs — I\'ve seen things you people wouldn\'t believe."',
        metrics: [
            { v: '3+', l: '3rd-party APIs' },
            { v: 'K8s', l: 'Orchestrated' },
            { v: 'AWS', l: 'Multi-env' },
        ],
        stack: ['Node.js', 'React.js', 'Hapi.js', 'MySQL', 'Socket.io', 'Docker', 'Kubernetes', 'AWS'],
    },
    {
        num: '02',
        tag: '↳ Distributed Systems',
        title: 'Auto Assignment System',
        desc: 'Scalable vendor assignment engine — 5–10 orders/cycle, 100+ eligible vendors, no duplicates, no drama. Redis queuing + Lambda parallel processing with enough fail-safes to make Batman proud.',
        quip: '"1M records archived. Query times halved. Sleep restored."',
        metrics: [
            { v: '30%', l: 'Less Latency' },
            { v: '40%', l: 'Throughput ↑' },
            { v: '50%', l: 'Faster Queries' },
            { v: '1M+', l: 'Archived' },
        ],
        stack: ['Node.js', 'MySQL', 'AWS Lambda', 'Redis', 'Bookshelf.js'],
    },
]

const ACHIEVEMENTS = [
    { icon: '💥', title: '"Bomb of the Performance"', sub: 'Awarded by two different Vice Presidents', quip: '"Twice. Because once apparently wasn\'t enough to make the point."' },
    { icon: '⭐', title: '"Emerging Star" Award', sub: 'Outstanding performance, technical expertise & growth', quip: '"Emerging. As if I wasn\'t already here."' },
    { icon: '🥈', title: 'Hackathon Runner-Up', sub: 'Org-wide competition against top internal talent', quip: '"1st Runner-Up. Silver not Gold. Batman would\'ve won."' },
    { icon: '🙏', title: 'Multiple "Thank You" Incentives', sub: 'Consistent high performance & team support', quip: '"They paid me extra to keep doing what I was already doing. Fair enough."' },
]

export default function ProjectsSection() {
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

        // 3D tilt on project cards
        const cards = root.querySelectorAll('.tilt')
        const tiltHandlers = []
        cards.forEach(card => {
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
            tiltHandlers.push(() => {
                card.removeEventListener('mousemove', onMove)
                card.removeEventListener('mouseleave', onLeave)
            })
        })

        return () => {
            triggers.forEach(st => st.kill())
            tiltHandlers.forEach(fn => fn())
        }
    }, [])

    return (
        <div className="page active" ref={sectionRef}>
            <div className="section">
                <div className="section-eyebrow gsap-reveal">Case Files</div>
                <div className="section-title-big gsap-reveal">Problems Solved.<br />Systems Shipped.</div>
                <div className="section-sub gsap-reveal">(Some more dramatically than others.)</div>
                <div className="proj-grid">
                    {PROJECTS.map((proj, i) => (
                        <div className="proj-card tilt gsap-reveal" data-num={proj.num} key={i}>
                            <div className="proj-tag">{proj.tag}</div>
                            <h3>{proj.title}</h3>
                            <p>{proj.desc}</p>
                            <div className="proj-quip">{proj.quip}</div>
                            <div className="proj-metrics">
                                {proj.metrics.map((m, j) => (
                                    <div className="pm" key={j}>
                                        <div className="v">{m.v}</div>
                                        <div className="l">{m.l}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="stack-tags">
                                {proj.stack.map((s, j) => <div className="stack-tag" key={j}>{s}</div>)}
                            </div>
                        </div>
                    ))}
                    <div className="proj-card proj-card--loading gsap-reveal" data-num="03">
                        <div className="proj-tag">↳ Classified</div>
                        <h3 className="proj-loading-title">Next Case File</h3>
                        <div className="proj-loading-bars">
                            <div className="plb"></div>
                            <div className="plb plb--short"></div>
                            <div className="plb plb--med"></div>
                        </div>
                        <div className="proj-loading-status">
                            <span className="proj-loading-dot"></span>
                            <span className="proj-loading-dot"></span>
                            <span className="proj-loading-dot"></span>
                            <span className="proj-loading-label">Decrypting</span>
                        </div>
                    </div>
                </div>

                <div className="gold-line" style={{ margin: '60px 0' }}></div>

                <div className="section-eyebrow gsap-reveal">The Trophy Case</div>
                <div className="section-title-big gsap-reveal">Awards I Didn't Ask For.<br />(But Definitely Deserved.)</div>
                <div className="ach-grid">
                    {ACHIEVEMENTS.map((ach, i) => (
                        <div className="ach-card gsap-reveal" key={i}>
                            <div className="ach-icon">{ach.icon}</div>
                            <div>
                                <div className="ach-title">{ach.title}</div>
                                <div className="ach-sub">{ach.sub}</div>
                                <div className="ach-quip">{ach.quip}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer left="SHREY DHIMAN · 2025" right={`"A hero can be anyone."`} />
        </div>
    )
}
