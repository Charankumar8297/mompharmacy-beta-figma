import { userAuth } from '@/Context/authContext';
import { useCart } from '@/Context/cartContext';
import apiClient from '@/utils/apiClient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, BackHandler, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function RazorPayWebView() {
  const { orderId, amount, razorpayOrderId } = useLocalSearchParams();
  const webviewRef = useRef(null);
  const { ExtractParseToken } = userAuth();
  const { clearCart } = useCart(); 
  const [isProcessing, setIsProcessing] = useState(false);

  const RAZORPAY_KEY = 'rzp_test_jWF66490cd9iq5';

  const handleBackPress = useCallback(() => {
    if (!isProcessing) {
      router.back();
      return true;
    }
    return false;
  }, [isProcessing]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );

    return () => backHandler.remove();
  }, [handleBackPress]);

  const onMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('Payment response:', data);

      if (data?.razorpay_payment_id && data?.razorpay_order_id && data?.razorpay_signature) {
        setIsProcessing(true);
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
            console.log('Payment Successful!', 'Your order has been placed successfully.');
            router.replace('/Orders/TrackOrder');
          } else {
            console.error('Verification Failed', response.message || 'Something went wrong');
            router.back();
          }
        } catch (err) {
          console.error('Payment verification error:', err);
          console.error('Error', 'Payment verification failed.');
          router.back();
        } finally {
          setIsProcessing(false);
        }
      } else if (data?.action === 'close_webview') {
        router.back();
      } else if (data?.error) {
        if (data.error.code === 'CHECKOUT_CLOSED' || data.error.code === 'PAYMENT_CANCELLED') {
          router.back();
        } else if (data.error.code !== 'PAYMENT_CANCELLED') {
          Alert.alert('Payment Error', data.error.description || 'Payment was not completed');
        }
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      router.back();
    }
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
          }
        </style>
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
            "handler": function(response) {
              window.ReactNativeWebView.postMessage(JSON.stringify(response));
            },
            "modal": {
              "ondismiss": function() {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  error: {
                    code: 'CHECKOUT_CLOSED',
                    description: 'User closed the checkout form'
                  }
                }));
              }
            },
            "prefill": {
              "email": "customer@example.com"
            },
            "theme": {
              "color": "#00a99d"
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
        
            window.onpopstate = function() {
              rzp.close();
              window.history.go(-1);
              return false;
            };
            
            rzp.open();
            
            setTimeout(function() {
              window.history.pushState(null, document.title, window.location.pathname + '?t=' + new Date().getTime());
            }, 500);
            
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
    <View style={{ flex: 1, marginTop: 60 }}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        onMessage={onMessage}
        startInLoadingState
        renderLoading={() => <ActivityIndicator size="large" color="#00a99d" />}
        onNavigationStateChange={(navState) => {
          console.log('Navigation state changed:', navState);
        }}
      />
    </View>
  );
}