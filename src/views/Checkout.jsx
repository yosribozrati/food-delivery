import React, { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useCart } from '../state/CartContext.jsx'
import { createOrder, createPaymentIntent } from '../lib/api.js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_12345')

function CheckoutForm() {
  const { state, totals, dispatch } = useCart()
  const [method, setMethod] = useState('card')
  const [customer, setCustomer] = useState({ name: '', phone: '' })
  const [address, setAddress] = useState({ line1: '', line2: '', city: '' })
  const [loading, setLoading] = useState(false)
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()

  const items = useMemo(() => Object.values(state.items).map(({ item, quantity }) => ({
    menuItemId: item.id,
    quantity,
  })), [state.items])

  async function handleSubmit(e) {
    e.preventDefault()
    if (items.length === 0) return
    setLoading(true)
    try {
      const restaurantId = Object.values(state.items)[0]?.item.restaurantId
      const order = await createOrder({
        restaurantId,
        customerName: customer.name,
        customerPhone: customer.phone,
        addressLine1: address.line1,
        addressLine2: address.line2,
        city: address.city,
        items,
        paymentMethod: method,
      })

      if (method === 'card') {
        const { clientSecret } = await createPaymentIntent(order.orderId)
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: { name: customer.name },
          },
        })
        if (result.error) throw new Error(result.error.message)
      }

      dispatch({ type: 'reset' })
      navigate('/?success=1')
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="card p-4 grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Nom complet</label>
          <input className="w-full border rounded px-3 py-2" value={customer.name} onChange={e=>setCustomer({...customer, name:e.target.value})} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Téléphone (8 chiffres)</label>
          <input
            type="tel"
            pattern="[0-9]{8}"
            maxLength="8"
            placeholder="12345678"
            className="w-full border rounded px-3 py-2"
            value={customer.phone}
            onChange={e=>setCustomer({...customer, phone:e.target.value.replace(/\D/g, '')})}
            required
            title="Le numéro de téléphone doit contenir exactement 8 chiffres"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm mb-1">Adresse</label>
          <input className="w-full border rounded px-3 py-2 mb-2" placeholder="Ligne 1" value={address.line1} onChange={e=>setAddress({...address, line1:e.target.value})} required />
          <input className="w-full border rounded px-3 py-2" placeholder="Ligne 2" value={address.line2} onChange={e=>setAddress({...address, line2:e.target.value})} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm mb-1">Ville</label>
          <select className="w-full border rounded px-3 py-2" value={address.city} onChange={e=>setAddress({...address, city:e.target.value})} required>
            <option value="">Sélectionnez une ville</option>
            <option value="Tunis">Tunis</option>
            <option value="Sfax">Sfax</option>
            <option value="Sousse">Sousse</option>
            <option value="Ettadhamen">Ettadhamen</option>
            <option value="Kairouan">Kairouan</option>
            <option value="Gabès">Gabès</option>
            <option value="Bizerte">Bizerte</option>
            <option value="Ariana">Ariana</option>
            <option value="Gafsa">Gafsa</option>
            <option value="La Marsa">La Marsa</option>
            <option value="Ben Arous">Ben Arous</option>
            <option value="Monastir">Monastir</option>
            <option value="Nabeul">Nabeul</option>
            <option value="Tataouine">Tataouine</option>
            <option value="Médenine">Médenine</option>
            <option value="Le Kef">Le Kef</option>
            <option value="Mahdia">Mahdia</option>
            <option value="Sidi Bouzid">Sidi Bouzid</option>
            <option value="Jendouba">Jendouba</option>
            <option value="Tozeur">Tozeur</option>
            <option value="Kasserine">Kasserine</option>
            <option value="Siliana">Siliana</option>
            <option value="Zaghouan">Zaghouan</option>
            <option value="Kebili">Kebili</option>
          </select>
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="method" value="card" checked={method==='card'} onChange={()=>setMethod('card')} />
            <span>Carte bancaire</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="method" value="cash" checked={method==='cash'} onChange={()=>setMethod('cash')} />
            <span>Espèces à la livraison</span>
          </label>
        </div>
        {method === 'card' && (
          <div className="p-3 border rounded">
            <CardElement options={{ hidePostalCode: true }} />
          </div>
        )}
        <div className="flex items-center justify-between">
          <span>Total</span>
          <span className="font-semibold">{(totals.subtotal/100).toFixed(2)} DT</span>
        </div>
        <button disabled={loading || (method==='card' && !stripe)} className="btn-primary w-full" type="submit">
          {loading ? 'Traitement...' : 'Confirmer la commande'}
        </button>
      </div>
    </form>
  )
}

export default function Checkout() {
  const location = useLocation()
  const restaurantId = location.state?.restaurantId
  if (!restaurantId) {
    return <div>Votre panier est vide.</div>
  }
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  )
}


