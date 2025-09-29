import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../state/CartContext.jsx'

export default function Cart() {
  const { state, dispatch, totals } = useCart()
  const navigate = useNavigate()
  const items = Object.values(state.items)

  const restaurantId = items[0]?.item.restaurantId

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-3">
        {items.length === 0 && <div className="card p-6">Votre panier est vide.</div>}
        {items.map(({ item, quantity }) => (
          <div key={item.id} className="card p-4 flex items-center gap-4">
            {item.imageUrl && <img src={item.imageUrl} className="w-20 h-20 object-cover rounded" />}
            <div className="flex-1">
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-gray-600">{(item.priceCents/100).toFixed(2)} DT</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border rounded" onClick={() => dispatch({ type: 'setQty', id: item.id, quantity: quantity - 1 })}>-</button>
              <span>{quantity}</span>
              <button className="px-3 py-1 border rounded" onClick={() => dispatch({ type: 'setQty', id: item.id, quantity: quantity + 1 })}>+</button>
            </div>
            <button className="text-red-600" onClick={() => dispatch({ type: 'remove', id: item.id })}>Supprimer</button>
          </div>
        ))}
      </div>
      <aside className="card p-6 space-y-3 h-fit">
        <div className="flex items-center justify-between">
          <span>Sous-total</span>
          <span className="font-semibold">{(totals.subtotal/100).toFixed(2)} DT</span>
        </div>
        <button
          disabled={items.length === 0}
          className="btn-primary w-full"
          onClick={() => navigate('/checkout', { state: { restaurantId } })}
        >Passer au paiement</button>
        <Link to="/" className="block text-center text-sm text-gray-600">Continuer les achats</Link>
      </aside>
    </div>
  )
}


