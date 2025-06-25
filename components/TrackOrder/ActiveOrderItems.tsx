import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { userAuth } from '../../Context/authContext'
import { useOrderActive } from '../../Context/orderContext'
import apiClient from '../../utils/apiClient'
import LoadingScreen from '../LoadingScreen'
export default function ActiveOrderItems({activeOrderId}) {

  const [order , setOrder] = useState(null)
  const [loading , setLoading] = useState(true)
  const {setActiveOrder , loadingOrders} = useOrderActive()
  const [error , setError ] = useState(false)

   const { ExtractParseToken } = userAuth();

    useEffect(() =>{
        async function fetchActiveOrder(){
          const tokenAuth = await ExtractParseToken();
            try {
              setLoading(true)
            const response = await apiClient('api/orderbyid/' + activeOrderId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                     Authorization: `Bearer ${tokenAuth}`,
                },
            })
            setLoading(false)
            setOrder(response.order)
            console.log('Active Order:', response.order);
        } catch (error) {
          setError(true)
            console.error('Error fetching active order:', error);
        }   
    }
        fetchActiveOrder()
    } , [activeOrderId])

    

    if(loading) return <LoadingScreen/>

    console.log("this is order id ",order)

    function handleTrackOrder(){
      setActiveOrder(order._id)
      router.push('/Orders/TrackOrder')
    }


  return (

      <View style={styles.card}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>Order ID: {order._id}</Text>
          <Text style={styles.orderDetails}>({order.medicines.length} Items)</Text>
          <Text style={styles.orderPrice}>₹ {order.medicines.reduce((acc, item) => acc + item.price, 0)}</Text>
        </View>
        {order.medicines.map((item, i) => (
          <View key={i} style={styles.itemRow}>
            <Image source={{uri:item.imageUrl}} style={styles.itemImage} />
            <View style={styles.itemText}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemUnit}>{item.quantity} unit</Text>
              <Text style={styles.itemPrice}>₹ {item.price}</Text>
            </View>
          </View>
        ))}
        <TouchableOpacity style={styles.trackButton} onPress={handleTrackOrder}>
          <Text style={styles.trackText}>Track my order</Text>
        </TouchableOpacity>
      </View>

  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: "#fff",
    },
    header: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 16,
    },
    card: {
      backgroundColor: "#e9f7f6",
      borderRadius: 12,
      padding: 12,
      marginBottom: 20,
    },
    orderHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
      flexWrap: "wrap",
    },
    orderId: {
      color: "#008080",
      fontWeight: "600",
    },
    orderDetails: {
      color: "#008080",
      marginLeft: 8,
    },
    orderPrice: {
      color: "#000",
      fontWeight: "bold",
    },
    itemRow: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 8,
    },
    itemImage: {
      width: 50,
      height: 50,
      borderRadius: 8,
      marginRight: 12,
    },
    itemText: {
      flex: 1,
    },
    itemName: {
      fontWeight: "bold",
    },
    itemUnit: {
      fontSize: 12,
      color: "#666",
    },
    itemPrice: {
      fontWeight: "600",
      marginTop: 2,
    },
    trackButton: {
      borderTopWidth: 1,
      borderColor: "#ccc",
      marginTop: 12,
      paddingTop: 10,
      alignItems: "center",
    },
    trackText: {
      color: "#666",
      fontWeight: "600",
    },
  });


