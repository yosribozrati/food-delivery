import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchRestaurants } from '../lib/api.js'

export default function Home() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRestaurants().then(setRestaurants).finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Chargement...</div>

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map(r => (
        <Link to={`/restaurant/${r.id}`} key={r.id} className="card overflow-hidden">
          <img src={r.imageUrl} alt={r.name} className="h-40 w-full object-cover" />
          <div className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{r.name}</h3>
              <span className="text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded">★ {r.rating}</span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{r.description}</p>
            <p className="text-xs text-gray-500">Livraison {r.deliveryTimeMin}-{r.deliveryTimeMax} min</p>
          </div>
        </Link>
      ))}
    </div>
  )
}


