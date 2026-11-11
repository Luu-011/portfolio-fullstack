import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Anima los elementos que coinciden con `selector` cuando entran en pantalla.
// `deps` sirve para volver a aplicarlo si el contenido cambia (por ejemplo, al llegar datos del backend).
export function useScrollReveal(rootRef, selector, deps = []) {
useEffect(() => {
    const root = rootRef.current
    if (!root) return

    // Si la persona pidió reducir movimiento, no se anima nada
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
    const ctx = gsap.context(() => {
        const items = gsap.utils.toArray(selector, root)
        if (!items.length) return

        gsap.set(items, { y: 30, autoAlpha: 0 })
        ScrollTrigger.batch(items, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
            gsap.to(batch, {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.12,
            clearProps: 'transform',
            }),
        })
    }, root)

    return () => ctx.revert()
    })

    return () => mm.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, deps)
}