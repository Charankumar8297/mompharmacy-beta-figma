import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCart } from '../../Context/cartContext';

interface OrderSummaryProps {
  tipAmount: number;
  printedInvoiceFee: boolean;
}

const { height } = Dimensions.get('window');

export default function OrderSummary({ tipAmount = 0, printedInvoiceFee = false }: OrderSummaryProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { subtotal } = useCart();
  const total = (subtotal + 20 + 5 - 10 + tipAmount + (printedInvoiceFee ? 5 : 0)).toFixed(2);

  return (
    <>
      <TouchableOpacity
        style={styles.summaryContainer}
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.8}
      >
        <View style={styles.summaryBox}>
          <MaterialIcons name='receipt-long' size={24} color='black' />
          <Text style={styles.OrderSummary}>Order Summary</Text>
          <MaterialIcons name='keyboard-arrow-down' size={24} color='black' />
        </View>
      </TouchableOpacity>

      <Modal
        animationType='slide'
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.overlayTouchable}
            activeOpacity={1}
            onPress={() => setIsModalVisible(false)}
          />
          <View style={styles.modalWrapper}>
            <View style={styles.closebtnnwrapper}>
              <TouchableOpacity
                style={styles.closebtn}
                onPress={() => setIsModalVisible(false)}
              >
                <MaterialIcons name='close' size={24} color='white' />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <Text style={styles.OrderSummary}>Order Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery</Text>
                <Text style={styles.summaryValue}>₹20.00</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax</Text>
                <Text style={styles.summaryValue}>₹5.00</Text>
              </View>
              {printedInvoiceFee && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Printed Invoice</Text>
                  <Text style={styles.summaryValue}>₹5.00</Text>
                </View>
              )}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount</Text>
                <Text style={styles.discountValue}>–₹10.00</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tip</Text>
                <Text style={styles.summaryValue}>₹{tipAmount.toFixed(2)}</Text>
              </View>

              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>₹{total}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.payByLabel}>Pay By</Text>
                <Text style={styles.cod}>COD/TNPL</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  summaryContainer: {
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    overflow: 'hidden',
  },
  summaryBox: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00a99d',
    borderRadius: 10,
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#d5ece9'
  },
  OrderSummary: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    alignSelf: 'center',

  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalWrapper: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 40,
    maxHeight: '70%',
  },
  closebtnnwrapper: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  closebtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00a99d',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  // closeText: {
  //   fontSize: 22,
  //   color: 'white',
  //   lineHeight: 20,
  //   marginBottom: 0,
  // },
  modalContent: {
    padding: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#333',
  },
  summaryValue: {
    fontWeight: '500',
  },
  discountValue: {
    fontWeight: '500',
    color: 'green',
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  totalValue: {
    fontWeight: 'bold',
    color: '#0BA29D',
  },
  payByLabel: {
    fontSize: 15,
    color: '#555',
  },
  cod: {
    fontSize: 16,
    color: '#0BA29D',
    fontWeight: '600',
  },
});