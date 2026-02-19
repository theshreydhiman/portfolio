const PAGES = ['home', 'about', 'experience', 'projects', 'contact']

export default function TabBar({ activePage, onPageChange }) {
    return (
        <div className="tab-bar" id="tabBar">
            {PAGES.map(p => (
                <div
                    key={p}
                    className={`tab${activePage === p ? ' active' : ''}`}
                    data-page={p}
                    onClick={() => onPageChange(p)}
                >
                    / {p.charAt(0).toUpperCase() + p.slice(1)}
                </div>
            ))}
        </div>
    )
}
