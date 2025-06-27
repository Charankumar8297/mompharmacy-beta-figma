import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Checkbox } from 'react-native-paper'
import { useCart } from '../../Context/cartContext'
import CartItem from './cartItem'

export default function CartList() {
  const { cartItems } = useCart()
  const [isChecked, setIsChecked]=useState(false)
  console.log("jgyft",cartItems)
  const toogleCheck=()=>setIsChecked(!isChecked)
  return (
    <View style={styles.deliveryBox}>
      <Text style={styles.deliveryTime}>Delivery on 10 minutes</Text>
      <Text style={styles.shipment}>Shipment of {cartItems.length} items</Text>

      {cartItems.map((item, index) => (
        <CartItem item={item} key={index} />
      ))}
      <View style={styles.checkbox}>
        <Checkbox status={isChecked ? 'checked' : 'unchecked'}
        onPress={toogleCheck}
        color="#00AA9D"
        />
        <Text>Get Printed Bill if you want</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  deliveryBox: {
    backgroundColor: '#e7f6f2',
    borderRadius: 12,
    padding: 12,
  },
  deliveryTime: {
    fontWeight: 'bold',
    fontSize: 16
  },
  shipment: {
    color: '#555',
    marginBottom: 8
  },
  checkbox:{
    flexDirection:'row',
    alignItems:'center',
    marginLeft:10,
  }
})