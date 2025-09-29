import React, { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useCart } from '../state/CartContext.jsx'

export default function RootLayout() {
  const { totals } = useCart()
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme-dark') === '1'
    setDark(saved)
    document.documentElement.classList.toggle('dark', saved)
  }, [])

  function toggleDark() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme-dark', next ? '1' : '0')
  }
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-white/20 dark:border-gray-800/50 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent hover:scale-105 transition-transform">
            🍕 Foodly
          </Link>
          <nav className="flex items-center gap-8">
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">Accueil</Link>
            <Link to="/cart" className="btn-primary relative">
              🛒 Panier ({(totals.subtotal/100).toFixed(2)} DT)
            </Link>
            <button onClick={toggleDark} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              {dark ? '☀️ Clair' : '🌙 Sombre'}
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Outlet />
        </div>
      </main>
      <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur border-t border-white/20 dark:border-gray-800/50 py-8 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-gray-600 dark:text-gray-400">© {new Date().getFullYear()} Foodly - Livraison de nourriture délicieuse</p>
          <div className="mt-4 flex justify-center gap-6 text-2xl">
            <span>🍔</span>
            <span>🍕</span>
            <span>🥗</span>
            <span>🍰</span>
          </div>
        </div>
      </footer>
    </div>
  )
}


