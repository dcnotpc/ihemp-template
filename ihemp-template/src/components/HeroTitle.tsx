'use client'

import { useRef, useEffect, useState } from 'react'
import { stateConfig } from '@/config/state'

export default function HeroTitle() {
  const hempRef = useRef<HTMLSpanElement>(null)
  const stateRef = useRef<HTMLSpanElement>(null)
  const [scaleX, setScaleX] = useState(1)

  useEffect(() => {
    const update = () => {
      if (hempRef.current && stateRef.current) {
        const hempWidth = hempRef.current.getBoundingClientRect().width
        const stateWidth = stateRef.current.scrollWidth
        setScaleX(hempWidth / stateWidth)
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const transformStyle = 'scaleX(' + scaleX + ')'

  return (
    <h1
      className="font-bold tracking-wider drop-shadow-lg flex flex-col items-center"
      style={{ fontFamily: 'var(--font-fredoka)', color: '#F5E6C8' }}
    >
      <span ref={hempRef} className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
        HEMP ON
      </span>
      <span
        ref={stateRef}
        className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl uppercase whitespace-nowrap"
        style={{ transform: transformStyle, transformOrigin: 'center top' }}
      >
        {stateConfig.name}
      </span>
    </h1>
  )
}
