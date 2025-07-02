import { userAuth } from '@/Context/authContext';
import { useCart } from '@/Context/cartContext';
import apiClient from '@/utils/apiClient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, BackHandler, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function RazorPayWebView() {
  const { orderId, amount, razorpayOrderId } = useLocalSearchParams();
  const { ExtractParseToken } = userAuth();
  const { clearCart } = useCart();
  const webviewRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  const RAZORPAY_KEY = 'rzp_test_jWF66490cd9iq5';

  const handleBackPress = useCallback(() => {
    if (!isProcessing) {
      router.back();
      return true;
    }
    return false;
  }, [isProcessing]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, [handleBackPress]);

  const onMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data?.razorpay_payment_id && data?.razorpay_order_id && data?.razorpay_signature) {
        setIsProcessing(true);
        const paymentDetails = {
          razorpay_payment_id: data.razorpay_payment_id,
          razorpay_order_id: data.razorpay_order_id,
          razorpay_signature: data.razorpay_signature,
          orderId,
        };

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
          console.log('Payment Successful!', 'Your order has been placed.');
          router.replace('/Orders/TrackOrder');
        } else {
          console.error('Verification Failed', response.message || 'Something went wrong');
          router.back();
        }
      } else if (data?.action === 'close_webview' || data?.error?.code === 'CHECKOUT_CLOSED') {
        router.back();
      } else if (data?.error) {
        Alert.alert('Payment Error', data.error.description || 'Payment was not completed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process payment.');
      router.back();
    } finally {
      setIsProcessing(false);
    }
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        <style>
          html, body {
            height: 100%;
            margin: 0;
            overflow: hidden;
            background-color: #f8f8f8;
          }
        </style>
      </head>
      <body>
        <script>
          var options = {
            key: "${RAZORPAY_KEY}",
            amount: "${Number(amount) * 100}",
            currency: "INR",
            name: "Mom Pharmacy",
            description: "Order Payment",
            order_id: "${razorpayOrderId}",
            handler: function(response) {
              window.ReactNativeWebView.postMessage(JSON.stringify(response));
            },
            modal: {
              ondismiss: function() {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  error: {
                    code: 'CHECKOUT_CLOSED',
                    description: 'User closed the checkout form'
                  }
                }));
              }
            },
            prefill: {
              email: "customer@example.com"
            },
            theme: {
              color: "#00a99d"
            }
          };

          try {
            var rzp = new Razorpay(options);
            rzp.on('payment.failed', function(response) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                error: {
                  code: 'PAYMENT_FAILED',
                  description: response.error.description || 'Payment failed'
                }
              }));
            });

            rzp.open();
          } catch (e) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              error: {
                code: 'INIT_ERROR',
                description: 'Failed to initialize payment: ' + (e.message || 'Unknown error')
              }
            }));
          }
        </script>
      </body>
    </html>
  `;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ height: 56, justifyContent: 'center', paddingHorizontal: 16 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: '#00a99d', fontSize: 18 }}>Close</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        <WebView
          ref={webviewRef}
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          onMessage={onMessage}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          startInLoadingState={false}
          renderLoading={() => null}
          onNavigationStateChange={(navState) => {
            // Optional: handle navigation changes
          }}
        />
        {loading && (
          <View style={{
            position: 'absolute',
            top: 56, left: 0, right: 0, bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.7)',
            zIndex: 10,
          }}>
            <ActivityIndicator size="large" color="#00a99d" />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}