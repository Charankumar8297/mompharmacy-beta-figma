import React, { useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function PaymentPop({ visible, onClose }: { visible: boolean, onClose: () => void }) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <View style={styles.handle} />

          <Text style={styles.sectionTitle}>PAYMENT METHOD</Text>

          
          <TouchableOpacity style={styles.paymentOption} onPress={() => setSelectedOption('razorpay')}>
            <View style={styles.circleIcon}>
              <Image source={require('../../assets/images/razorpay.png')}
              style={styles.iconImage}
              resizeMode="contain"/>
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentText}>Razorpay</Text>
            </View>
            <View style={[styles.radioCircle, selectedOption === 'razorpay' && styles.selectedRadio]} />
          </TouchableOpacity>

          
          <TouchableOpacity style={styles.paymentOption} onPress={() => setSelectedOption('payu')}>
          <View style={styles.circleIcon}>
              <Image source={require('../../assets/images/payu.png')}
              style={styles.iconImage}
              resizeMode="contain"/>
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentText}>PayU</Text>
            </View>
            <View style={[styles.radioCircle, selectedOption === 'payu' && styles.selectedRadio]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.payButton, !selectedOption && { backgroundColor: '#ccc' }]}
            disabled={!selectedOption}
            onPress={() => {
              if (selectedOption) {
                console.log('Proceeding with:', selectedOption);
                onClose();
              }
            }}
          >
            <Text style={styles.payButtonText}>Pay</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  amount: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black ',
    marginTop: 20,
    alignSelf: 'center',
    marginBottom: 8,
  },
  iconImage: {
  width: 24,
  height: 24,
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
  selectedRadio: {
  backgroundColor: '#00A99D',
  borderColor: '#00A99D',
},
  iconText: {
    color: 'white',
    fontWeight: 'bold'
    
  },
  paymentInfo: {
    flex: 1,
  },
  paymentText: {
    fontSize: 16,
    fontWeight: '500',
  },
  subText: {
    fontSize: 12,
    color: 'gray',
  },
  checkMark: {
    fontSize: 18,
    color: 'green',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#aaa',
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
