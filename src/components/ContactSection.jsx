import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Footer from './Footer'

gsap.registerPlugin(ScrollTrigger)

const CONTACT_LINKS = [
    { icon: '📧', value: 'shreyd4@gmail.com' },
    { icon: '🔗', value: 'linkedin.com/in/theshreydhiman', link: "https://linkedin.com/in/theshreydhiman" },
    { icon: '🐙', value: 'github.com/theshreydhiman', link: "https://github.com/theshreydhiman" },
    { icon: '📱', value: '+91-9582636882' },
]

export default function ContactSection() {
    const sectionRef = useRef(null)
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

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

        return () => triggers.forEach(st => st.kill())
    }, [])

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const { name, email, subject, message } = form
        window.location.href = `mailto:shreyd4@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`
    }

    return (
        <div className="page active" ref={sectionRef}>
            <div className="section">
                <div className="section-eyebrow gsap-reveal">Send the Signal</div>
                <div className="section-title-big gsap-reveal">Don't Have a Bat-Phone?<br />Email Works Too.</div>
                <div className="contact-grid">
                    <div className="gsap-reveal">
                        <p>Open to full-time roles, interesting freelance work, and conversations that don't start with "quick question."</p>
                        <div className="contact-quip">"Unlike Bruce Wayne, I actually respond to messages."</div>
                        {CONTACT_LINKS.map((link, i) => (
                            <a className="contact-link" key={i} href={link.link || "#"} target="_blank" rel="noopener noreferrer">
                                <div className="ico">{link.icon}</div>
                                <div className="val">{link.value}</div>
                            </a>
                        ))}
                    </div>
                    <div className="gsap-reveal">
                        <form className="form" onSubmit={handleSubmit}>
                            <input type="text" name="name" placeholder="Your Name" value={form.name} onChange={handleChange} />
                            <input type="email" name="email" placeholder="Your Email" value={form.email} onChange={handleChange} />
                            <input type="text" name="subject" placeholder="Subject (vague messages get vague replies)" value={form.subject} onChange={handleChange} />
                            <textarea name="message" placeholder="Your message. No lorem ipsum." value={form.message} onChange={handleChange}></textarea>
                            <button type="submit"><span>Send the Signal →</span></button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer left="SHREY DHIMAN · 2025" right={`"I work in the dark to serve the light."`} />
        </div>
    )
}
