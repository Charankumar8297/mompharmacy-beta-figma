import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Checkbox } from 'react-native-paper'
import { useCart } from '../../Context/cartContext'
import CartItem from './cartItem'

interface CartListProps {
  isPrintedInvoice: boolean;
  setIsPrintedInvoice: (value: boolean) => void;
}

export default function CartList({ isPrintedInvoice, setIsPrintedInvoice }: CartListProps) {
  const { cartItems } = useCart()
  console.log("jgyft", cartItems)
  return (
    <View style={styles.deliveryBox}>
      <Text style={styles.deliveryTime}>Delivery on 10 minutes</Text>
      <Text style={styles.shipment}>Shipment of {cartItems.length} items</Text>

      {cartItems.map((item, index) => (
        <CartItem item={item} key={index} />
      ))}
      <View style={styles.checkboxWrapper}>
        <TouchableOpacity 
          style={styles.checkbox} 
          onPress={() => setIsPrintedInvoice(!isPrintedInvoice)}
          activeOpacity={0.7}
        >
          <View style={styles.checkboxContent}>
            <View style={[styles.checkboxContainer, isPrintedInvoice && styles.checkboxContainerChecked]}>
              <Checkbox.Android 
                status={isPrintedInvoice ? 'checked' : 'unchecked'}
                onPress={() => {}}
                color="#00a99d"
                uncheckedColor="#CCCCCC"
                pointerEvents="none"
              />
            </View>
            <Text>Get your Invoice Printed</Text>
          </View>
          <Text style={styles.printPrice}>₹ 5.00</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  deliveryBox: {
    backgroundColor: '#d5ece9',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 12,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 12,
    marginVertical: 8,
  },
  checkboxContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    borderRadius: 4,
    width: 24,
    height: 24,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxContainerChecked: {
    backgroundColor: 'transparent',
  },
  printPrice: {
    marginLeft: 40,
    fontWeight: 'bold'
  },
  checkboxWrapper: {
    width: '100%'
  }
})