import { useState } from 'react'

const PAGES = ['home', 'about', 'experience', 'projects', 'contact']

export default function Navbar({ activePage, onPageChange }) {
    const [menuOpen, setMenuOpen] = useState(false)

    const handlePageChange = (page) => {
        onPageChange(page)
        setMenuOpen(false)
    }

    return (
        <>
            <nav id="nav">
                <div className="nav-logo">
                    <img src="/bat-logo.png" className="nav-bat-logo" alt="" />
                    SD<span>.</span>
                </div>
                <div className="nav-links">
                    {PAGES.map(p => (
                        <a
                            key={p}
                            href="#"
                            className={activePage === p ? 'active' : ''}
                            data-page={p}
                            onClick={e => { e.preventDefault(); onPageChange(p) }}
                        >
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                        </a>
                    ))}
                </div>
                <a className="nav-cta mag" href="https://drive.google.com/uc?export=download&id=1oLrHQ1GszIwR1MfkJ6cgR6XfLWaq8tNC" target="_blank" rel="noopener noreferrer"><span>Download CV</span></a>
                <button
                    className={`nav-hamburger${menuOpen ? ' open' : ''}`}
                    onClick={() => setMenuOpen(v => !v)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </nav>
            <div className={`nav-mobile-menu${menuOpen ? ' open' : ''}`}>
                {PAGES.map(p => (
                    <a
                        key={p}
                        href="#"
                        className={activePage === p ? 'active' : ''}
                        onClick={e => { e.preventDefault(); handlePageChange(p) }}
                    >
                        / {p.charAt(0).toUpperCase() + p.slice(1)}
                    </a>
                ))}
            </div>
        </>
    )
}
