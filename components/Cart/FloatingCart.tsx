import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useCart } from '../../Context/cartContext';
export default function FloatingCartButton() {
  const { cartItems } = useCart();
  const router = useRouter();

  if (!cartItems || cartItems.length === 0) return null;

  return (
    <TouchableOpacity
      style={styles.Button}
      onPress={() => router.push('/BottomNavbar/cart')}
    >
      <Text style={styles.ButtonText}><FontAwesome name="cart-plus" size={24} color="#fff" />   Go to Cart  {cartItems.length}</Text>
    </TouchableOpacity>
  );
}

 const styles = StyleSheet.create({
  Button: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: '#00A99D', 
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
  ButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
