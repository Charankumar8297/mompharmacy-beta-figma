import PaymentPop from '@/components/Cart/paymentpop';
import TipSelector from '@/components/Cart/tip';
import CartList from '@/components/OrdersComponents/CartList';
import OrderSummary from '@/components/OrdersComponents/OrderSummary';
import ProtectedLayout from '@/components/ProtectedRoute';
import { COLOR, screen } from '@/constants/color';
import { useAddress } from '@/Context/addressContext';
import { userAuth } from '@/Context/authContext';
import { useOrderActive } from '@/Context/orderContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useCart } from '../../Context/cartContext';
import apiClient from "../../utils/apiClient";
import Recommended from '../Recommended';

const OrderReviewScreen = () => {
  const { cartItems, subtotal, updateQuantity, clearCart } = useCart();
  const { ExtractParseToken } = userAuth();
  const { getPrimaryAddress, primaryAddress } = useAddress();
  const { updateActiveOrder } = useOrderActive();

  const [isLoading, setIsLoading] = useState(false);
  const [tipAmount, setTipAmount] = useState(0);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [isPrintedInvoice, setIsPrintedInvoice] = useState(false);

  const handleQuantityChange = (id, type) => {
    const item = cartItems.find((item) => item.id === id);
    if (!item) return;
    const newQty = type === 'inc' ? item.quantity + 1 : item.quantity - 1;
    updateQuantity(id, newQty > 0 ? newQty : 1);
  };

  const postOrders = async (paymentMethod = 'COD', transactionId = null) => {
    const tokenAuth = await ExtractParseToken();
    const orderMedicines = cartItems.map((item) => ({
      medicine_id: item._id,
      quantity: item.quantity,
      price: item.price,
      imageUrl: item.imageUrl,
      name: item.medicine_name
    }));

    const totalAmount = subtotal + 5 + 2.5 - 3 + tipAmount;

    const orderData = {
      address_id: primaryAddress,
      medicines: orderMedicines,
      ETA: 10,
      subtotal,
      shippingFee: 5,
      tax: 2.5,
      discount: 3,
      total_amount: totalAmount,
      paymentMethod,
      transactionId,
    };

    setIsLoading(true);
    try {
      const response = await apiClient('api/add-order', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenAuth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      console.log('Order response:', response);
      return response;
    } catch (error: any) {
      console.error('Error placing order:', {
        message: error.message,
        status: error.status,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        } : 'No response',
        stack: error.stack
      });
      
      let errorMessage = 'Failed to place order';
      if (error.response) {
        errorMessage = error.response.data?.message || error.response.statusText || errorMessage;
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your internet connection.';
      }
      
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={styles.emptyText}>Your cart is empty.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!primaryAddress) {
    return (
      <View style={{ marginTop: 20, padding: 12 }}>
        <Text style={{ marginVertical: 12, color: COLOR.btnPrimary }}>
          You don’t have a saved address. Please add one.
        </Text>
      </View>
    );
  }

  const totalAmount = subtotal + 5 + 2.5 - 3 + tipAmount;

  return (

    <ProtectedLayout>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
      <SafeAreaView style={{ flex: 1,marginBottom: '20%', backgroundColor: 'white' }}>
        <View style={styles.mainContainer}>

          <View style={styles.headerRow}>
            <MaterialIcons name='arrow-back' size={24} color='#00a99d' style={styles.backButton} onPress={() => router.back()} />
            <Text style={styles.cartText}>Cart</Text>
          </View>
          <ScrollView style={styles.container}>
            <CartList 
              isPrintedInvoice={isPrintedInvoice} 
              setIsPrintedInvoice={setIsPrintedInvoice} 
            />

            <View style={styles.FreeDelivery}>
              <Text style={styles.freeDeliveryText}>Just ₹xx away from free delivery</Text>
              <TouchableOpacity onPress={() => router.push("/essential")}>
                <Text style={styles.addMoreText}>+Add More</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.addressBox}>
              <Ionicons name="location-outline" size={24} color="#007F5F" style={styles.icon} />
              <View>
                <Text style={styles.addressTitle}>Deliver to</Text>
                <Text style={styles.address}>
                  {getPrimaryAddress() ? getPrimaryAddress().slice(0, 30) : 'No address found'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => router.push("/Maps/myAddress")}>
                <Text>Change</Text>
              </TouchableOpacity>
            </View>

            <Recommended />

            <TipSelector onTipChange={(tip) => setTipAmount(tip)} />
            <OrderSummary 
              tipAmount={tipAmount} 
              printedInvoiceFee={isPrintedInvoice} 
            />
          </ScrollView>

          <PaymentPop
            visible={paymentModalVisible}
            onClose={() => setPaymentModalVisible(false)}
            onPay={async (method) => {
              setPaymentModalVisible(false);
              const response = await postOrders(method);

              if (!response?.order) {
                return;
              }

              updateActiveOrder(response.order._id);

              if (method === 'RAZORPAY' && response.payment?.razorpayOrderId) {
                router.push({
                  pathname: 'Orders/RazorPayWebView',
                  params: {
                    amount: totalAmount.toFixed(2),
                    razorpayOrderId: response.payment.razorpayOrderId,
                    orderId: response.order._id,
                  },
                });
              } else if (method === 'PAYU') {
                const payu = response.payu;
                if (!payu || !payu.txnid) {
                  Alert.alert("Error", "Missing PayU payment details");
                  return;
                }
                
                router.push({
                  pathname: '/Orders/PayUWeb',
                  params: {
                    key: payu.key,
                    txnid: payu.txnid,
                    amount: payu.amount.toString(),  // convert number to string
                    firstname: payu.firstname,
                    email: payu.email,
                    phone: payu.phone || '',          // phone might be empty string
                    productinfo: payu.productinfo,
                    surl: payu.surl,
                    furl: payu.furl,
                    service_provider: payu.service_provider,
                    hash: payu.hash,
                  },
                });
  
              } else if (method === 'CASHFREE' && response.cashfree?.token) {
                router.push({
                  pathname: 'Orders/CashfreeWebView',
                  params: {
                    orderId: response.cashfree.orderId,
                    orderAmount: totalAmount.toFixed(2),
                    cashfreeToken: response.cashfree.token,
                    appId: response.cashfree.appId,
                  },
                });
                clearCart();
              }
        
              else {
                clearCart();
                router.replace({
                  pathname: "/Orders/TrackOrder",
                  params: { orderId: response.order._id },
                });
              }
            }}
          />
        </View>
      </SafeAreaView>

      
        <TouchableOpacity
          style={styles.proceedButton}
          onPress={() => setPaymentModalVisible(true)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.proceedText}>Select Payment Method</Text>
          )}
        </TouchableOpacity>
      </View>
    </ProtectedLayout>
  );
};

const styles = StyleSheet.create({
  cartText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00a99d',
    marginHorizontal: 30
  },
  backButton: {
    // marginTop: 20,
    marginLeft: 20
  },
  headerRow: {
    flexDirection: 'row',

    alignItems: 'center'

  },
  container: { backgroundColor: '#fff', marginTop: 20 },
  mainContainer: { flex: 1, height: screen.width, backgroundColor: "#fff" },
  icon: { marginRight: 12 },
  addressBox: {
    backgroundColor: '#DFF4EF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 20,
    marginHorizontal: 12,
    marginVertical: 10,
  },
  addressTitle: { fontWeight: 'bold' },
  address: { marginTop: 4 },
  proceedButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#00a99d',
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 0,
    width: "90%",
    alignSelf: "center",
  },
  proceedText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  FreeDelivery: {
    marginTop: 10,
    borderRadius: 20,
    marginHorizontal: 15,
    backgroundColor: '#e7f6f2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  freeDeliveryText: {
    margin: 10,
    fontWeight: '600',
    textAlign: 'center'
  },
  addMoreText: {
    textDecorationLine: 'underline',
    color: '#00a99d',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#555',
    marginBottom: 20,
  },
  shopNowButton: {
    backgroundColor: '#00bfa5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  shopNowText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default OrderReviewScreen;