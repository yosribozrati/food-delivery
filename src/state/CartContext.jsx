import React, { createContext, useContext, useMemo, useReducer } from 'react'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const key = String(action.item.id)
      const quantity = (state.items[key]?.quantity || 0) + (action.quantity || 1)
      const next = {
        ...state.items,
        [key]: { item: action.item, quantity },
      }
      return { ...state, items: next }
    }
    case 'remove': {
      const next = { ...state.items }
      delete next[String(action.id)]
      return { ...state, items: next }
    }
    case 'setQty': {
      const key = String(action.id)
      const next = { ...state.items }
      if (action.quantity <= 0) delete next[key]
      else next[key] = { ...next[key], quantity: action.quantity }
      return { ...state, items: next }
    }
    case 'reset':
      return { items: {} }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: {} })

  const totals = useMemo(() => {
    let subtotal = 0
    for (const key of Object.keys(state.items)) {
      const { item, quantity } = state.items[key]
      subtotal += item.priceCents * quantity
    }
    return { subtotal, itemCount: Object.keys(state.items).length }
  }, [state.items])

  const value = useMemo(() => ({ state, dispatch, totals }), [state, totals])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}


