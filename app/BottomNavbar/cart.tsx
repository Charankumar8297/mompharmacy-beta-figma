import ProtectedLayout from '@/components/ProtectedRoute'
import React from 'react'
import Cart1 from '../Orders/Cart'

const Cart = () => {
  return (
    <ProtectedLayout>
      <Cart1 />
    </ProtectedLayout>
  )
}

export default Cart