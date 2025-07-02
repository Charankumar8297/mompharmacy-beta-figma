import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface CashfreePaymentProps {
  orderId: string;
  orderAmount: string;
  cashfreeToken: string;
  appId: string;
  onPaymentSuccess: () => void;
  onPaymentFailure: () => void;
  style?: any;
}

const CashfreePayment = ({ 
  orderId, 
  orderAmount, 
  cashfreeToken, 
  appId, 
  onPaymentSuccess, 
  onPaymentFailure,
  style 
}: CashfreePaymentProps) => {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  useEffect(() => {
    if (cashfreeToken && appId) {
      generateHtml();
    }
  }, [cashfreeToken]);

  const generateHtml = () => {
    const returnUrl = "https://test.cashfree.com/billpay/return";

const formHtml = `
  <html>
    <body onload="document.forms[0].submit()">
      <form method="post" action="https://test.cashfree.com/billpay/checkout/post/submit">
        <input type="hidden" name="orderId" value="${orderId}" />
        <input type="hidden" name="orderAmount" value="${orderAmount}" />
        <input type="hidden" name="orderCurrency" value="INR" />
        <input type="hidden" name="customerName" value="Teja S" />
        <input type="hidden" name="customerEmail" value="test@example.com" />
        <input type="hidden" name="customerPhone" value="9999999999" />
        <input type="hidden" name="tokenData" value="${cashfreeToken}" />
        <input type="hidden" name="appId" value="${appId}" />
        <input type="hidden" name="returnUrl" value="${returnUrl}" />
      </form>
    </body>
  </html>
`;

    setHtmlContent(formHtml);
  };

const handleNavigationChange = (navState: any) => {
  const url = navState.url;
  console.log('Redirect URL:', url);

  if (url.includes('cashfree.com/billpay/return')) {
    if (onPaymentSuccess) onPaymentSuccess();
  }
};



  if (!htmlContent) {
    return (
      <View style={[style, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#00bcd4" />
      </View>
    );
  }

  return (
    <View style={style}>
      <WebView
        source={{ html: htmlContent }}
        style={{ flex: 1 }}
        onNavigationStateChange={handleNavigationChange}
        onError={onPaymentFailure}
      />
    </View>
  );
};

export default CashfreePayment;