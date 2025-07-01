import { useCart } from '@/Context/cartContext';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Cartt from '../../assets/images/carttab';
import Category from '../../assets/images/categorytab';
import Home from '../../assets/images/hometab';
import Profile from '../../assets/images/profiletab';
export default function BottomNavbar() {
  const {cartItems} = useCart()
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#00a99d',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Home width={25} height={25}/>
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          tabBarLabel: 'Categories',
          tabBarIcon: ({ color }) => (
            <Category width={60} height={60}/>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color }) => (
            <View style={styles.cardContainer}>
              <Cartt width={65} height={65} />
              {cartItems.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartItems.length > 9 ? '9+' : cartItems.length}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color }) => (
            <Profile width={70} height={70}/>
          ),
        }}
      />
    </Tabs>
  );
}
const styles = StyleSheet.create({
  cardContainer: {
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    right: 15,
    top: 19,
    backgroundColor: '#00a99d',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});