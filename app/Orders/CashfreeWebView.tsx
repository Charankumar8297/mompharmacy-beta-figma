import CashfreePayment from '@/components/CashfreePayment';
import { useRoute } from '@react-navigation/native';
import { router } from 'expo-router';
import React from 'react';

const CashfreeWebview = () => {
  const route = useRoute<any>();

  const { orderId, orderAmount, cashfreeToken, appId } = route.params;

  return (
    <CashfreePayment style={{flex: 1, marginTop: 50}}
      orderId={orderId}
      orderAmount={orderAmount}
      cashfreeToken={cashfreeToken}
      appId={appId}
      onPaymentSuccess={() => router.replace('/Orders/TrackOrder')}
      onPaymentFailure={() => router.back()}
    />
  );
};

export default CashfreeWebview;