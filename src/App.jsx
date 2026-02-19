import { useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Loader from './components/Loader'
import CustomCursor from './components/CustomCursor'
import ScrollProgress from './components/ScrollProgress'
import Navbar from './components/Navbar'
import TabBar from './components/TabBar'
import ThreeScene from './components/ThreeScene'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import ExperienceSection from './components/ExperienceSection'
import ProjectsSection from './components/ProjectsSection'
import ContactSection from './components/ContactSection'

gsap.registerPlugin(ScrollTrigger)

const PAGE_COMPONENTS = {
    home: HeroSection,
    about: AboutSection,
    experience: ExperienceSection,
    projects: ProjectsSection,
    contact: ContactSection,
}

export default function App() {
    const [activePage, setActivePage] = useState('home')
    const [loaderDone, setLoaderDone] = useState(false)
    const [threeReveal, setThreeReveal] = useState(false)

    const handleLoaderComplete = useCallback(() => {
        setLoaderDone(true)
        setThreeReveal(true)
    }, [])

    const handlePageChange = useCallback((page) => {
        // Kill existing ScrollTriggers before switching
        ScrollTrigger.getAll().forEach(st => st.kill())
        setActivePage(page)
        window.scrollTo({ top: 0 })
    }, [])

    const ActivePage = PAGE_COMPONENTS[activePage]

    return (
        <>
            {!loaderDone && <Loader onComplete={handleLoaderComplete} />}
            <ThreeScene reveal={threeReveal} />
            <CustomCursor />
            <ScrollProgress />
            <Navbar activePage={activePage} onPageChange={handlePageChange} />
            <TabBar activePage={activePage} onPageChange={handlePageChange} />
            <ActivePage
                key={activePage}
                onViewWork={() => handlePageChange('projects')}
            />
        </>
    )
}
