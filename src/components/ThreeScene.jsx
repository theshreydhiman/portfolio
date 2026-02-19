import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

export default function ThreeScene({ reveal }) {
    const canvasRef = useRef(null)
    const revealFnRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        let renderer
        try {
            renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
        } catch (err) {
            console.warn('WebGL unavailable:', err.message)
            return
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
        camera.position.set(0, 0, 6)

        const setSize = () => {
            const parent = canvas.parentElement
            if (!parent) return
            const w = parent.offsetWidth
            const h = parent.offsetHeight
            renderer.setSize(w, h)
            camera.aspect = w / h
            camera.updateProjectionMatrix()
        }

        // Light rays
        const rays = []
        for (let i = 0; i < 24; i++) {
            const angle = (i / 24) * Math.PI * 2
            const geo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(Math.cos(angle) * 3.2, Math.sin(angle) * 3.2, -2)
            ])
            const mat = new THREE.LineBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0 })
            scene.add(new THREE.Line(geo, mat))
            rays.push(mat)
        }

        // Particles
        const pCount = 160
        const pPos = new Float32Array(pCount * 3)
        for (let i = 0; i < pCount; i++) {
            pPos[i * 3] = (Math.random() - 0.5) * 10
            pPos[i * 3 + 1] = (Math.random() - 0.5) * 10
            pPos[i * 3 + 2] = (Math.random() - 0.5) * 5
        }
        const pGeo = new THREE.BufferGeometry()
        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
        const pMat = new THREE.PointsMaterial({ color: 0xc9a84c, size: 0.022, transparent: true, opacity: 0 })
        scene.add(new THREE.Points(pGeo, pMat))

        setSize()
        window.addEventListener('resize', setSize)

        // Reveal function
        revealFnRef.current = () => {
            gsap.to(canvas, { opacity: 1, duration: 1.2, delay: 0.4 })
            gsap.to(pMat, { opacity: 0.45, duration: 2, delay: 0.6, ease: 'power2.out' })
            rays.forEach((mat, i) => {
                gsap.to(mat, { opacity: 0.03 + (i % 3) * 0.01, duration: 2, delay: 0.7 + i * 0.02, ease: 'power2.out' })
            })
        }

        // Mouse parallax
        let mx2 = 0, my2 = 0, t = 0
        const onMouseMove = (e) => {
            mx2 = (e.clientX / innerWidth - 0.5) * 2
            my2 = (e.clientY / innerHeight - 0.5) * 2
        }
        document.addEventListener('mousemove', onMouseMove)

        let animId
        const loop = () => {
            animId = requestAnimationFrame(loop)
            t += 0.004
            scene.rotation.x += (-my2 * 0.07 - scene.rotation.x) * 0.04
            scene.rotation.y += (mx2 * 0.10 - scene.rotation.y) * 0.04
            renderer.render(scene, camera)
        }
        loop()

        return () => {
            window.removeEventListener('resize', setSize)
            document.removeEventListener('mousemove', onMouseMove)
            cancelAnimationFrame(animId)
            renderer.dispose()
        }
    }, [])

    // Trigger reveal when prop changes to true
    useEffect(() => {
        if (reveal && revealFnRef.current) {
            revealFnRef.current()
        }
    }, [reveal])

    return <canvas id="three-canvas" ref={canvasRef}></canvas>
}
