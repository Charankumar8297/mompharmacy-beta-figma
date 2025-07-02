import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import SwipeButton from '../OrdersComponents/SwipeButton';
const { height, width } = Dimensions.get('window');

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
  const translateY = useRef(new Animated.Value(0)).current;


  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          onClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(0);
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <Animated.View
            style={[
              styles.popup,
              {
                transform: [{ translateY }],
              },
            ]}
            {...panResponder.panHandlers}
          >
            <View style={styles.handle} />
            <Text style={styles.sectionTitle}>PAYMENT METHOD</Text>

            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => setSelectedOption('COD')}
            >
              <View style={styles.circleIcon}>
                <Ionicons name="cash-outline" size={24} color="#00A99D" />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentText}>Cash on Delivery</Text>
              </View>
              <View
                style={[
                  styles.radioCircle,
                  selectedOption === 'COD' && styles.selectedRadio,
                ]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => setSelectedOption('RAZORPAY')}
            >
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
              <View
                style={[
                  styles.radioCircle,
                  selectedOption === 'RAZORPAY' && styles.selectedRadio,
                ]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => setSelectedOption('PAYU')}
            >
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
              <View
                style={[
                  styles.radioCircle,
                  selectedOption === 'PAYU' && styles.selectedRadio,
                ]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => setSelectedOption('CASHFREE')}
            >
              <View style={styles.circleIcon}>
                <Image
                  source={require('../../assets/images/cashfree-logo.png')}
                  style={styles.iconImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentText}>Cashfree</Text>
              </View>
              <View
                style={[
                  styles.radioCircle,
                  selectedOption === 'CASHFREE' && styles.selectedRadio,
                ]}
              />
            </TouchableOpacity>

            <SwipeButton
              visible={visible}
              onClose={onClose}
              onConfirm={() => {
                if (selectedOption) {
                  onPay(selectedOption);
                  onClose();
                }
              }}
            />
          </Animated.View>
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
    height: height * 0.5,
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
});
