const PAGES = ['home', 'about', 'experience', 'projects', 'contact']

export default function Navbar({ activePage, onPageChange }) {
    return (
        <nav id="nav">
            <div className="nav-logo">SD<span>.</span></div>
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
        </nav>
    )
}
