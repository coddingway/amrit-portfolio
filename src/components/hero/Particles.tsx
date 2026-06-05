import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Particles — floating Three.js point-cloud behind the hero.
 *
 * ~280 accent-coloured dots scattered in 3D space.
 * Slowly rotates + responds to mouse with a subtle parallax shift.
 * Completely transparent background so it layers cleanly over Aurora.
 */
export default function Particles() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    // ── Scene ───────────────────────────────────────────────────────────────
    const W = window.innerWidth
    const H = window.innerHeight

    const scene    = new THREE.Scene()
    const camera   = new THREE.PerspectiveCamera(60, W / H, 0.1, 100)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.setClearColor(0x000000, 0) // fully transparent bg
    renderer.domElement.style.cssText = 'position:absolute;inset:0;display:block;width:100%;height:100%;'
    el.appendChild(renderer.domElement)

    // ── Particle geometry ────────────────────────────────────────────────────
    const COUNT     = 280
    const positions = new Float32Array(COUNT * 3)
    const colorsArr = new Float32Array(COUNT * 3)

    // Ember palette — sRGB approximations of oklch(0.72 0.18 50) family
    // THREE.Color doesn't parse oklch, so we use the closest hex equivalents
    const accent = new THREE.Color('#D97B1A') // oklch(0.72 0.18 50) ≈ warm amber
    const dim    = new THREE.Color('#8B4A08') // oklch(0.48 0.14 50) ≈ dark amber
    const near   = new THREE.Color('#3D1C02') // oklch(0.25 0.08 50) ≈ near-black ember

    for (let i = 0; i < COUNT; i++) {
      // Spread across a wide box — slightly flattened on Z so it reads as a 2D cloud
      positions[i * 3]     = (Math.random() - 0.5) * 14
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5

      // Gradient from accent → dim → near-black
      const t = Math.random()
      const c = t < 0.5
        ? accent.clone().lerp(dim,  t * 2)
        : dim.clone().lerp(near, (t - 0.5) * 2)

      colorsArr[i * 3]     = c.r
      colorsArr[i * 3 + 1] = c.g
      colorsArr[i * 3 + 2] = c.b
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color',    new THREE.BufferAttribute(colorsArr, 3))

    const mat = new THREE.PointsMaterial({
      size:            0.028,
      vertexColors:    true,
      transparent:     true,
      opacity:         0.65,
      sizeAttenuation: true,
    })

    const points = new THREE.Points(geo, mat)
    scene.add(points)

    // ── Mouse parallax ───────────────────────────────────────────────────────
    let targetX = 0
    let targetY = 0

    const onMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth  - 0.5) * 2
      targetY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // ── Resize ───────────────────────────────────────────────────────────────
    const onResize = () => {
      const nW = window.innerWidth
      const nH = window.innerHeight
      camera.aspect = nW / nH
      camera.updateProjectionMatrix()
      renderer.setSize(nW, nH)
    }
    window.addEventListener('resize', onResize, { passive: true })

    // ── Animation loop ───────────────────────────────────────────────────────
    let raf = 0

    const animate = () => {
      raf = requestAnimationFrame(animate)

      // Very slow auto-rotation — just enough to feel alive
      points.rotation.y += 0.00025
      points.rotation.x += 0.00012

      // Smooth camera drift toward mouse position
      camera.position.x += (targetX * 0.35 - camera.position.x) * 0.04
      camera.position.y += (-targetY * 0.22 - camera.position.y) * 0.04

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize',    onResize)
      renderer.dispose()
      geo.dispose()
      mat.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      aria-hidden
      style={{
        position:      'absolute',
        inset:         0,
        pointerEvents: 'none',
        zIndex:        1,
      }}
    />
  )
}
