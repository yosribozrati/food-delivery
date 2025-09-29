import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchMenuByRestaurant, fetchRestaurant } from '../lib/api.js'
import { useCart } from '../state/CartContext.jsx'

export default function Restaurant() {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [menu, setMenu] = useState({})
  const [loading, setLoading] = useState(true)
  const { dispatch } = useCart()

  useEffect(() => {
    Promise.all([fetchRestaurant(id), fetchMenuByRestaurant(id)])
      .then(([r, m]) => { setRestaurant(r); setMenu(m) })
      .finally(() => setLoading(false))
  }, [id])

  const categories = useMemo(() => Object.keys(menu), [menu])

  if (loading) return <div>Chargement...</div>
  if (!restaurant) return <div>Restaurant introuvable</div>

  return (
    <div className="space-y-6">
      <div className="card overflow-hidden">
        <img src={restaurant.imageUrl} className="h-52 w-full object-cover" />
        <div className="p-4">
          <h1 className="text-2xl font-bold">{restaurant.name}</h1>
          <p className="text-sm text-gray-600">{restaurant.description}</p>
        </div>
      </div>

      {categories.map(cat => (
        <section key={cat} className="space-y-3">
          <h2 className="text-xl font-semibold">{cat}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {menu[cat].map(item => (
              <div key={item.id} className="card p-4 flex gap-4">
                {item.imageUrl && <img src={item.imageUrl} className="w-24 h-24 object-cover rounded" />}
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-600">{item.description}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-semibold">{(item.priceCents/100).toFixed(2)} DT</span>
                    <button className="btn-primary" onClick={() => dispatch({ type: 'add', item: { ...item, restaurantId: Number(id) }, quantity: 1 })}>Ajouter</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}


