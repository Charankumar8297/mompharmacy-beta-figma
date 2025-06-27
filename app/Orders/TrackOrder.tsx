import BannerCarousel from '@/components/Cart/carousal';
import StatusHeader from '@/components/OrdersComponents/StatusHeader';
import { COLOR } from '@/constants/color';
import { userAuth } from '@/Context/authContext';
import { useOrderActive } from '@/Context/orderContext';
import apiClient from '@/utils/apiClient';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TrackOrder() {
  const [openOrderSummary, setOpenOrderSummary] = useState(false);
  const { ActiveOrderId } = useOrderActive();
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const { ExtractParseToken } = userAuth();

  useEffect(() => {
    console.log('ActiveOrderId:', ActiveOrderId);
  }, [ActiveOrderId]);

  const fetchOrderData = useCallback(async (isInitial = false) => {
    try {
      isInitial ? setLoading(true) : setIsFetching(true);
      setError(null);

      const tokenAuth = await ExtractParseToken();
      if (!tokenAuth) {
        setError('Authentication required');
        return;
      }

      const response = await apiClient(`api/orderbyid/${ActiveOrderId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenAuth}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Full API response:', response);

      if (response && response.order) {
        console.log('Fetched order:', response.order);
        console.log('Address field:', response.order.address);
        setOrder(response.order);
      } else {
        setError('No order data found');
      }
    } catch (err) {
      console.error('Failed to fetch order data:', err);
      setError('Failed to load order data. Please try again.');
    } finally {
      isInitial ? setLoading(false) : setIsFetching(false);
    }
  }, [ActiveOrderId, ExtractParseToken]);

  useFocusEffect(
    useCallback(() => {
      fetchOrderData(true);
      const id = setInterval(() => fetchOrderData(false), 5000);
      return () => clearInterval(id);
    }, [fetchOrderData])
  );

  const handleCall = (phone: string) => Linking.openURL(`tel:${phone}`);
  const handleMessage = (phone: string) => Linking.openURL(`sms:${phone}`);

  const formatAddress = (address: any) => {
    if (!address) return 'No address available';
    if (typeof address === 'string') return address;
    const { line1, line2, city, state, zip, country } = address;
    return [line1, line2, city, state, zip, country].filter(Boolean).join(', ');
  };

  const OrderItems = () => {
    if (!order?.medicines?.length) {
      return <Text style={styles.noDataText}>No medicines found in this order</Text>;
    }
    return (
      <View style={styles.orderItemsContainer}>
        {order.medicines.map((med: any, idx: number) => (
          <View key={idx} style={styles.orderItemContainer}>
            <Image
              source={med.imageUrl ? { uri: med.imageUrl } : require('@/assets/images/Categories/babyoil.png')}
              style={styles.medicineImage}
            />
            <View style={styles.orderItemQuantityContainer}>
              <Text style={styles.quantityText}>x{med.quantity}</Text>
              <Text style={styles.priceText}>₹{med.price}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLOR.primary} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => fetchOrderData(true)} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <StatusHeader title="Track Order" />
        <View style={trackPageStyles.cor}>
          <BannerCarousel />
        </View>

        <View style={trackPageStyles.content}>
          <View style={trackPageStyles.container}>
            <View style={trackPageStyles.deliveryBoyETA}>
              <Image source={require('@/assets/images/deliveryboy.png')} style={styles.deliveryBoyImage} />
              <View style={trackPageStyles.ETAContainer}>
                <View style={trackPageStyles.innerCircle}>
                  <Text style={trackPageStyles.arriving}>Arriving in</Text>
                  <Text style={trackPageStyles.ETA}>10 MINS</Text>
                  <Text style={trackPageStyles.way}>On the way</Text>
                </View>
              </View>
            </View>

            {order?.deliveryboy_id && (
              <View style={trackPageStyles.deliveryBoyContainer}>
                <View style={trackPageStyles.deliveryBoyDetailsContainer}>
                  <Image source={require('@/assets/images/deliveryProfile.png')} style={styles.deliveryBoyProfileImage} />
                  <View>
                    <Text style={styles.deliveryBoyName}>
                      {order.deliveryboy_id.name ||
                        `${order.deliveryboy_id.firstName || ''} ${order.deliveryboy_id.lastName || ''}`.trim() ||
                        'Heal Porter'}
                    </Text>
                    <Text style={styles.deliveryBoyRole}>Heal Porter</Text>
                  </View>
                </View>

                <View style={trackPageStyles.deliveryIconsContainer}>
                  <TouchableOpacity style={trackPageStyles.iconsBtn} onPress={() => handleCall(order.deliveryboy_id.mobileNumber)}>
                    <Ionicons name="call" size={20} color={COLOR.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={trackPageStyles.iconsBtn} onPress={() => handleMessage(order.deliveryboy_id.mobileNumber)}>
                    <MaterialIcons name="message" size={20} color={COLOR.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <Text style={trackPageStyles.orderItemHeading}>Item Detail(s)</Text>
            <OrderItems />

           {order?.address_id && typeof order.address_id === 'object' && (
            <View style={styles.addressContainer}>
              <Text style={styles.addressTitle}>Delivery Address</Text>
              <Text style={styles.addressText}>{order.address_id.street}, {order.address_id.city},{' '}{order.address_id.state} - {order.address_id.pincode}</Text>
            </View>
          )}

          </View>
        </View>

        <TouchableOpacity style={trackPageStyles.borderSummaryBtn} onPress={() => setOpenOrderSummary(o => !o)}>
          <Text style={trackPageStyles.orderSummarybtnText}>Order Summary</Text>
          <AntDesign name={openOrderSummary ? 'up' : 'down'} size={24} color="black" />
        </TouchableOpacity>

        {openOrderSummary && (
          <View style={trackPageStyles.OrderSummaryDropdownContainer}>
            <View style={styles.summaryBox}>
              <Text style={styles.OrderSummary}>Order Summary</Text>
              {['subtotal', 'Shipping', 'Tax', 'Discount'].map((label, i) => (
                <View key={i} style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{label}</Text>
                  <Text style={styles.summaryValue}>
                    ₹{label === 'subtotal' ? order.subtotal.toFixed(2) : label === 'Discount' ? `– ${order.discount || 0}` : (label === 'Shipping' ? 5 : 2.5).toFixed(2)}
                  </Text>
                </View>
              ))}
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>₹{(order.subtotal + 5 + 2.5 - (order.discount || 0)).toFixed(0)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.payByLabel}>Pay By</Text>
                <Text style={styles.cod}>COD/TNPL</Text>
              </View>
            </View>
          </View>
        )}

        {isFetching && <ActivityIndicator size="small" color={COLOR.primary} style={{ marginTop: 10 }} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  contentContainer: { flex: 1, backgroundColor: 'white' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { color: 'red', marginBottom: 10, textAlign: 'center' },
  retryButton: { backgroundColor: COLOR.primary, padding: 10, borderRadius: 5 },
  retryText: { color: 'white', fontWeight: 'bold' },
  noDataText: { textAlign: 'center', color: 'gray', marginTop: 20 },
  addressContainer: {marginTop: 12,padding: 12,backgroundColor: '#F9F9F9',borderRadius: 8,borderColor: '#ccc',borderWidth: 1,marginHorizontal: 8,},
  addressTitle: {fontWeight: 'bold',fontSize: 16,marginBottom: 4,},
  addressText: {fontSize: 14,color: '#000',lineHeight: 20,},
  deliveryBoyImage: { width: 180, height: 163 },
  deliveryBoyProfileImage: { width: 40, height: 40 },
  deliveryBoyName: { fontSize: 16, fontWeight: '500' },
  deliveryBoyRole: { color: 'grey', fontSize: 16 },
  medicineImage: { width: 38, height: 40 },
  quantityText: { fontSize: 14 },
  priceText: { fontSize: 14, fontWeight: '500' },
  orderItemsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 12 },
  orderItemContainer: {backgroundColor: COLOR.light,padding: 8,width: 70,height: 70,justifyContent: 'center',alignItems: 'center',borderRadius: 12,position: 'relative'},
  orderItemQuantityContainer: {position: 'absolute',top: -10,right: -10,backgroundColor: 'white',padding: 2,borderRadius: 12,alignItems: 'center'},
  OrderSummary: { fontWeight: 'bold', fontSize: 15 },
  summaryBox: { marginVertical: 20, paddingHorizontal: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  summaryLabel: { fontSize: 16, color: '#333' },
  summaryValue: { fontWeight: '500' },
  discountValue: { fontWeight: '500', color: 'green' },
  totalLabel: { fontSize: 18, fontWeight: '700', color: '#000' },
  totalValue: { fontWeight: 'bold' },
  payByLabel: { fontSize: 15, color: '#555' },
  cod: { fontSize: 16, color: '#0BA29D', fontWeight: '600' },
});

const trackPageStyles = StyleSheet.create({
  container: {
    margin: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#000",
    paddingBottom: 15,
    backgroundColor: "#fff",
  },
  top: { margin: -10 },
  cor: {
    backgroundColor: "#00a99d",
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 3,
    padding: 15,
    borderRadius: 12,
  },
  content: {
    padding: 15,
    marginTop: -50,
  },
  deliveryBoyETA: {
    padding: 16,
    flexDirection: "row",
    margin: 10,
    borderWidth: 1.5,
    borderColor: "gray",
    borderRadius: 12,
    alignItems: "center",
  },
  ETAContainer: { justifyContent: "center", alignItems: "center", marginRight: -5 },
  innerCircle: {
    backgroundColor: 'white',
    height: 140,
    width: 140,
    marginLeft: -10,
    borderRadius: 70,
    alignItems: 'center',
    borderColor: "#00a99d",
    borderWidth: 6,
  },
  arriving: { fontSize: 15, color: "gray", marginBottom: 7, marginTop: 25 },
  ETA: { fontSize: 20, color: COLOR.primary, marginBottom: 8 },
  way: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  deliveryBoyContainer: {
    margin: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 24
  },
  deliveryBoyDetailsContainer: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    paddingHorizontal: 12
  },
  deliveryIconsContainer: {
    flexDirection: "row",
    gap: 6,
    marginRight: 12
  },
  iconsBtn: {
    padding: 4,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  orderItemHeadingContainer: {
    padding: 10,
    marginHorizontal: 16,
    marginTop: -10,
  },
  orderItemHeading: { fontWeight: "600", fontSize: 14, padding:12, },
  orderItemAlign: {
    flexDirection: "row",
    gap: 7,
    padding: 10,
    flexWrap: "wrap",
    marginTop: -10,
  },
  borderSummaryBtn: {
    marginTop: 0,
    marginHorizontal: 12,
    padding: 12,
    backgroundColor: '#fff',
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
    borderColor: "#000",
    borderWidth: 1,
  },
  orderSummarybtnText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  OrderSummaryDropdownContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
  },
});
