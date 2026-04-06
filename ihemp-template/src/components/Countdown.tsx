'use client'

import { useState, useEffect } from 'react'

export default function Countdown() {
  const target = new Date('2026-11-12T00:00:00')

  const getTimeLeft = () => {
    const diff = target.getTime() - new Date().getTime()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    }
  }

  const [mounted, setMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="bg-green-900 text-white py-12 text-center">
      <h2 className="text-2xl font-bold mb-4">Countdown to the Hemp Ban</h2>
      <div className="flex justify-center gap-6 text-3xl font-mono">
        {mounted ? (
          <>
            <div>{timeLeft.days}d</div>
            <div>{timeLeft.hours}h</div>
            <div>{timeLeft.minutes}m</div>
            <div>{timeLeft.seconds}s</div>
          </>
        ) : (
          <div>Loading...</div>
        )}
      </div>
      <a
        href="https://hempsupporter.com/bill/help-stop-the-hemp-ban/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition"
      >
        Click Here to Help Stop the Hemp Ban
      </a>
    </section>
  )
}
