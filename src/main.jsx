import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import RootLayout from './views/RootLayout.jsx'
import Home from './views/Home.jsx'
import Restaurant from './views/Restaurant.jsx'
import Cart from './views/Cart.jsx'
import Checkout from './views/Checkout.jsx'
import { CartProvider } from './state/CartContext.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'restaurant/:id', element: <Restaurant /> },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <Checkout /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </React.StrictMode>
)


