import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function PayUWebView() {
  const router = useRouter();
  const webviewRef = useRef(null);

  const {
    key,
    txnid,
    amount,
    firstname,
    email,
    phone,
    productinfo,
    surl,
    furl,
    service_provider,
    hash,
  } = useLocalSearchParams();

  useEffect(() => {
    console.log('PayUWebView params:', {
      key,
      txnid,
      amount,
      firstname,
      email,
      phone,
      productinfo,
      surl,
      furl,
      service_provider,
      hash,
    });
  }, []);

  const payuForm = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PayU Payment</title>
      </head>
      <body onload="document.forms[0].submit()">
        <p style="text-align:center;margin-top:30px;">Redirecting to PayU...</p>
        <form action="https://test.payu.in/_payment" method="post">
          <input type="hidden" name="key" value="${key}" />
          <input type="hidden" name="txnid" value="${txnid}" />
          <input type="hidden" name="amount" value="${amount}" />
          <input type="hidden" name="productinfo" value="${productinfo}" />
          <input type="hidden" name="firstname" value="${firstname}" />
          <input type="hidden" name="email" value="${email}" />
          <input type="hidden" name="phone" value="${phone || ''}" />
          <input type="hidden" name="surl" value="${surl}" />
          <input type="hidden" name="furl" value="${furl}" />
          <input type="hidden" name="service_provider" value="${service_provider}" />
          <input type="hidden" name="hash" value="${hash}" />
        </form>
      </body>
    </html>
  `;

  const handleNavigationChange = (navState) => {
    const url = navState.url;
    console.log('Navigated to:', url);

    if (url.includes('/payment-success')) {
      Alert.alert('Payment Success', 'Your payment was successful.');
      router.replace('/Orders/TrackOrder');
    } else if (url.includes('/payment-failure')) {
      Alert.alert('Payment Failed', 'Your payment failed.');
      router.back();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html: payuForm, baseUrl: '' }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onNavigationStateChange={handleNavigationChange}
        startInLoadingState
        renderLoading={() => <ActivityIndicator size="large" color="#00bfa5" />}
      />
    </View>
  );
}
