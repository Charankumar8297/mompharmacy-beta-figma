import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

export default function PaymentPop({
  visible,
  onClose,
  onPay,
}: {
  visible: boolean;
  onClose: () => void;
  onPay: (method: string) => void;
}) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <Modal transparent visible={visible} animationType="slide">
      <TouchableWithoutFeedback onPress={() => {}}>
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>

            <View style={styles.handle} />
            <Text style={styles.sectionTitle}>PAYMENT METHOD</Text>

            <TouchableOpacity style={styles.paymentOption} onPress={() => setSelectedOption('RAZORPAY')}>
              <View style={styles.circleIcon}>
                <Image
                  source={require('../../assets/images/razorpay.png')}
                  style={styles.iconImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentText}>Razorpay</Text>
              </View>
              <View style={[styles.radioCircle, selectedOption === 'RAZORPAY' && styles.selectedRadio]} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.paymentOption} onPress={() => setSelectedOption('PAYU')}>
              <View style={styles.circleIcon}>
                <Image
                  source={require('../../assets/images/payu.png')}
                  style={styles.iconImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentText}>PayU</Text>
              </View>
              <View style={[styles.radioCircle, selectedOption === 'PAYU' && styles.selectedRadio]} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.paymentOption} onPress={() => setSelectedOption('COD')}>
              <View style={styles.circleIcon}>
                <Ionicons name="cash-outline" size={24} color="#00A99D" />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentText}>Cash on Delivery</Text>
              </View>
              <View style={[styles.radioCircle, selectedOption === 'COD' && styles.selectedRadio]} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.payButton, !selectedOption && { backgroundColor: '#ccc' }]}
              disabled={!selectedOption}
              onPress={() => {
                if (selectedOption) {
                  onPay(selectedOption);
                  onClose();
                }
              }}
            >
              <Text style={styles.payButtonText}>
                {selectedOption === 'cod' ? 'Place Order (COD)' : 'Pay'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  popup: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 2,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'center',
    marginBottom: 12,
    marginTop: 5,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  circleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconImage: {
    width: 24,
    height: 24,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentText: {
    fontSize: 16,
    fontWeight: '500',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#aaa',
  },
  selectedRadio: {
    backgroundColor: '#00A99D',
    borderColor: '#00A99D',
  },
  payButton: {
    backgroundColor: '#00A99D',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});