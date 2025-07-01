// app/Payments/RazorPayWebView.js
import { userAuth } from '@/Context/authContext';
import { useCart } from '@/Context/cartContext';
import apiClient from '@/utils/apiClient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function RazorPayWebView() {
  const { orderId, amount, razorpayOrderId } = useLocalSearchParams();

  const webviewRef = useRef(null);
  const { ExtractParseToken } = userAuth();
  const { clearCart } = useCart(); 

  const RAZORPAY_KEY = 'rzp_test_jWF66490cd9iq5'; 

  const onMessage = async (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    console.log('Payment response:', data);

    if (data?.razorpay_payment_id && data?.razorpay_order_id && data?.razorpay_signature) {
      const paymentDetails = {
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_order_id: data.razorpay_order_id,
        razorpay_signature: data.razorpay_signature,
        orderId,
      };

      try {
        const token = await ExtractParseToken();
        const response = await apiClient('api/verify/razorpay', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentDetails),
        });

        if (response.success) {
          clearCart(); 
          Alert.alert('Payment Successful!');
          router.replace('/Orders/TrackOrder');
        } else {
          Alert.alert('Verification Failed', response.message || 'Something went wrong');
          router.back();
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        Alert.alert('Error', 'Payment verification failed.');
        router.back();
      }
    } else {
      Alert.alert('Payment Failed or Cancelled');
      router.back();
    }
  };

  const htmlContent = `
    <html>
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body>
        <script>
          var options = {
            "key": "${RAZORPAY_KEY}",
            "amount": "${Number(amount) * 100}",
            "currency": "INR",
            "name": "Mom Pharmacy",
            "description": "Order Payment",
            "order_id": "${razorpayOrderId}",
            "handler": function (response){
              window.ReactNativeWebView.postMessage(JSON.stringify(response));
            },
            "prefill": {
              "email": "customer@example.com"
            },
            "theme": {
              "color": "#00bfa5"
            }
          };
          var rzp = new Razorpay(options);
          rzp.open();
        </script>
      </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        onMessage={onMessage}
        startInLoadingState
        renderLoading={() => <ActivityIndicator size="large" color="#00bfa5" />}
      />
    </View>
  );
}