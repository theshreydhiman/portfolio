import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Footer from './Footer'

gsap.registerPlugin(ScrollTrigger)

const WORK_PROJECTS = [
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
    {
        num: '03',
        tag: '↳ Integration Platform',
        title: 'Dapt Tech',
        desc: 'Cross-platform integration engine bridging HubSpot and JobTread — automating CRM-to-project-management data sync so humans can stop copy-pasting between tabs like it\'s 2009.',
        quip: '"Two platforms that were never meant to talk. I made them finish each other\'s API calls."',
        metrics: [
            { v: 'Real-time', l: 'Data Sync' },
            { v: '2', l: 'Platforms Bridged' },
            { v: '0', l: 'Manual Steps' },
        ],
        stack: ['Node.js', 'Express', 'HubSpot API', 'JobTread API', 'MySQL'],
    },
    {
        num: '04',
        tag: '↳ Event-Driven Systems',
        title: 'Metal Mandi (Attero)',
        desc: 'High-volume operational backbone for large-scale metal trading. Event-driven architecture with Lambda + SQS for async processing, fault-tolerant retry patterns, and centralized logging that actually tells you what went wrong.',
        quip: '"Handling more metal than Tony Stark — and with better uptime."',
        metrics: [
            { v: 'Lambda', l: 'Event-Driven' },
            { v: 'SQS', l: 'Async Queues' },
            { v: 'High', l: 'Volume Txns' },
        ],
        stack: ['Node.js', 'AWS Lambda', 'SQS', 'MySQL', 'Express'],
    },
]

const PERSONAL_PROJECTS = [
    {
        num: '01',
        tag: '↳ AI & Automation',
        title: 'Super Agent',
        desc: 'AI-powered multi-agent system for automated GitHub issue resolution. Worker agents analyze issues and generate fixes, while reviewer agents validate PRs before delivery.',
        quip: '"It writes the PRs so I don\'t have to. Sometimes better than me."',
        metrics: [
            { v: 'Multi', l: 'LLM Support' },
            { v: '100%', l: 'Automated' },
            { v: 'Live', l: 'Socket.io' },
        ],
        stack: ['Node.js', 'React', 'TypeScript', 'Express', 'Socket.io', 'MySQL'],
        personal: true,
        link: 'https://agent.shreydhiman.com',
    },
    {
        num: '02',
        tag: '↳ Performance Tools',
        title: 'Keylab',
        desc: 'High-performance typing practice platform built for speed and accuracy. Features real-time WPM tracking and detailed analytics for typing enthusiasts.',
        quip: '"Real-time analytics for people who type faster than they think."',
        metrics: [
            { v: 'Vite', l: 'Ultra Fast' },
            { v: 'Real-time', l: 'WPM Stats' },
            { v: 'Secure', l: 'JWT Auth' },
        ],
        stack: ['React', 'TypeScript', 'Node.js', 'Express', 'SQLite', 'Vite'],
        personal: true,
        link: 'https://keylab.shreydhiman.com',
    },
]

const ACHIEVEMENTS = [
    { icon: '💥', title: '"Bomb of the Performance"', sub: 'Awarded by two different Vice Presidents', quip: '"Twice. Because once apparently wasn\'t enough to make the point."' },
    { icon: '⭐', title: '"Emerging Star" Award', sub: 'Outstanding performance, technical expertise & growth', quip: '"Emerging. As if I wasn\'t already here."' },
    { icon: '🥈', title: 'Hackathon Runner-Up', sub: 'Org-wide competition against top internal talent', quip: '"1st Runner-Up. Silver not Gold. Batman would\'ve won."' },
    { icon: '🙏', title: 'Multiple "Thank You" Incentives', sub: 'Consistent high performance & team support', quip: '"They paid me extra to keep doing what I was already doing. Fair enough."' },
    { icon: '🦇', title: '"Outstanding Newcomer"', sub: 'CrownStack — exceptional performance & quick impact', quip: '"Day one energy, but make it permanent."' },
    { icon: '📝', title: '"Best Content" Award', sub: 'CrownStack — high-quality technical contributions & docs', quip: '"Apparently writing good documentation is a superpower. Noted."' },
]

export default function ProjectsSection() {
    const sectionRef = useRef(null)

    useEffect(() => {
        const root = sectionRef.current
        if (!root) return

        const allReveals = root.querySelectorAll('.gsap-reveal')
        gsap.set(allReveals, { opacity: 0, y: 36 })

        // Header elements are above the fold at page load — animate directly (no ScrollTrigger)
        // querySelector returns only the FIRST match, so the second eyebrow/title (Trophy Case)
        // correctly remains in the ScrollTrigger pool below.
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
                    {WORK_PROJECTS.map((proj, i) => (
                        <div className={`proj-card tilt gsap-reveal${proj.personal ? ' proj-card--personal' : ''}`} data-num={proj.num} key={i}>
                            {proj.personal && <div className="proj-badge">Personal Project</div>}
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
                            {proj.link && (
                                <a className="proj-visit mag" href={proj.link} target="_blank" rel="noopener noreferrer">
                                    <span>Visit Live →</span>
                                </a>
                            )}
                        </div>
                    ))}
                    <div className="proj-card proj-card--loading gsap-reveal" data-num="05">
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

                <div className="section-eyebrow gsap-reveal">The Sandbox</div>
                <div className="section-title-big gsap-reveal">Personal Projects.<br />(Where I break things on purpose.)</div>
                <div className="section-sub gsap-reveal">(Because building products is fun.)</div>
                <div className="proj-grid">
                    {PERSONAL_PROJECTS.map((proj, i) => (
                        <div className={`proj-card tilt gsap-reveal${proj.personal ? ' proj-card--personal' : ''}`} data-num={proj.num} key={i}>
                            {proj.personal && <div className="proj-badge">Personal Project</div>}
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
                            {proj.link && (
                                <a className="proj-visit mag" href={proj.link} target="_blank" rel="noopener noreferrer">
                                    <span>Visit Live →</span>
                                </a>
                            )}
                        </div>
                    ))}
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
