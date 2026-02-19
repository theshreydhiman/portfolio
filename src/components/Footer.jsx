export default function Footer({ left, right }) {
    return (
        <footer>
            <div className="fl">{left}</div>
            <div className="fr">{right}</div>
        </footer>
    )
}
