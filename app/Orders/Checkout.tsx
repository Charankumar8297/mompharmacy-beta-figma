import TipSelector from '@/components/Cart/tip';
import CartList from '@/components/OrdersComponents/CartList';
import OrderSummary from '@/components/OrdersComponents/OrderSummary';
import StatusHeader from '@/components/OrdersComponents/StatusHeader';
import { COLOR, screen } from '@/constants/color';
import { useAddress } from '@/Context/addressContext';
import { userAuth } from '@/Context/authContext';
import apiClient from '@/utils/apiClient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useCart } from '../../Context/cartContext';
import OrderConfirmationModal from './OrderConfirmation';
const OrderReviewScreen = () => {
  const { cartItems, subtotal, updateQuantity } = useCart();
  const [orderId, setOrderId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [ medicine, setMedicine]=useState([])
  const [isLoading ,setIsLoading] = useState(false)
  const [tipAmount, setTipAmount] = useState(0);

  const {ExtractParseToken} = userAuth()
  const {clearCart} = useCart()
  const {getPrimaryAddress , primaryAddress} = useAddress()

  console.log("this is primary Address" ,primaryAddress)

  const handleQuantityChange = (id, type) => {
    const item = cartItems.find((item) => item.id === id);
    if (!item) return;
    const newQty = type === 'inc' ? item.quantity + 1 : item.quantity - 1;
    updateQuantity(id, newQty > 0 ? newQty : 1);

  };

  // const {primaryAddress} = useAddress()

  async function postOrders(medicines) {
    const tokenAuth = await ExtractParseToken();
    
    const orderMedicines = medicines.map((item) => {
      console.log(item)
      return({
        medicine_id: item._id,
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.imageUrl,
        name: item.medicine_name
      })
    });

    const orderData = {
      address_id: primaryAddress,
      medicines: orderMedicines,
      ETA: 10,
      subtotal: subtotal,
      shippingFee: 5,
      tax: 2.5,
      discount: 3,
      total_amount: subtotal + 5 + 2.5 - 3+tipAmount,
      paymentMethod: "COD",
    };

    setIsLoading(true);

    try {
      const response = await apiClient('api/add-order', {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${tokenAuth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response && response.order) {
        console.log('Order placed successfully:', response.order);
        clearCart();
        setOrderId(response.order._id);
        setMedicine(response.order.medicines);
        setModalVisible(true);
      } else {
        console.error('Error placing order: No order data received');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  if(!primaryAddress) return <View style={{marginTop:20 , padding:12}}>
    <Text style={{marginVertical:12 , color:COLOR.btnPrimary}}>You dont have saved address, add address first</Text>
    <TouchableOpacity style={{width:"100%" , padding:12 , backgroundColor:COLOR.primary ,borderRadius:12 }} onPress={()=>{router.push('/Maps/addAddress')}}>
    <Text style={{textAlign:"center" , color:"white"}}>Add Address</Text>
  </TouchableOpacity>
  </View>

  

  return (
    <View style={styles.mainContainer}>
    <SafeAreaView>
    <ScrollView style={styles.container}>
      
      <StatusHeader title={"Order Review"} />
    
      <CartList/>
      <View style={styles.addressBox}>
        <Ionicons name="location-outline" size={24} color="#007F5F" style={styles.icon} />
        <View>
          <Text style={styles.addressTitle}>Deliver to</Text>
          <Text style={styles.address}>
            {getPrimaryAddress().slice(0 , 30)}
            {/* 100ft Rd Madhapur <Text style={styles.inTime}>in 10mins</Text> */}
          </Text>
        </View>
  
        <TouchableOpacity onPress={()=>{
          router.push("/Maps/myAddress")
        }}>
          <Text>Change</Text>
        </TouchableOpacity>
      </View>
      <TipSelector onTipChange={(tip) => setTipAmount(tip)} />
        
      <OrderSummary tipAmount={tipAmount} />


      <TouchableOpacity
        style={styles.proceedButton}
        onPress={() => postOrders(cartItems)}
        disabled={isLoading}
      >
        {isLoading ? (<ActivityIndicator size="small" color="#fff" />) :  <Text style={styles.proceedText}>Proceed</Text>}
       
      </TouchableOpacity>

      <OrderConfirmationModal visible={modalVisible} orderId={orderId} />
      
    </ScrollView>
    </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 16,
    backgroundColor: '#fff',
    marginTop:20,
  },
  icon: {
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  addressBox: {
    backgroundColor: '#DFF4EF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 20,
    marginHorizontal: 12,
    marginVertical: 10,
  },
  addressTitle: {
    fontWeight: 'bold',
  },
  address: {
    marginTop: 4,
    
  },
  inTime: {
    color: '#444',
  },
  mainContainer: {
    flex: 1,
    height: screen.width,
    backgroundColor:"#fff"
  },
  proceedButton: {
    backgroundColor: '#00bfa5',
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 12,
    // marginTop: -15,
    marginBottom: 5,
    width: "90%",
    alignSelf: "center"
  },
  proceedText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  changeBtn: {
    marginLeft: 60,
    fontWeight: 'bold',
    marginTop: -20,
  }
});

export default OrderReviewScreen;