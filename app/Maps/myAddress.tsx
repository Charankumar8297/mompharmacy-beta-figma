import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Button,
    Linking,
    Modal,
    Pressable,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLOR } from '../../constants/color';
import { useAddress } from '../../Context/addressContext';
import apiClient from '../../utils/apiClient';

const MyAddressesScreen = () => {
  const [data, setData] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('Rohith, 13-55, beside HP petrol bunk, Yadav Nagar, Malkajgiri, Secunderabad');
  const [customAddress, setCustomAddress] = useState(selectedAddress);

  const handleEditAddress = () => {
    setSelectedAddress(customAddress);
    setModalVisible(false);
  };

  const handleDeleteAddress = () => {
    setSelectedAddress('');
    setModalVisible(false);
  };


  const handleWhatsAppClick = () => {
    const message = "Please share your delivery location to ensure a hassle-free delivery by clicking on this link";
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;

    Linking.openURL(url)
      .catch(() => {
        alert('WhatsApp is not installed on this device');
      });
  };

  const handleShareAddress = async () => {
    try {
      const result = await Share.share({
        message: `Address: ${selectedAddress}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`Shared via ${result.activityType}`);
        } else {
          console.log('Address shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Sharing dismissed');
      }
    } catch (error) {
      console.error('Error sharing address:', error);
    }
  };



  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      console.log("error")
      const response = await apiClient("/address/alladdress");

      const res = await response.json();
      console.log("jashoww", res);

      if (Array.isArray(res)) {
        setData(res);
      } else if (res.data) {
        setData([res.data]);
      } else {
        setData([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const {address , setAddressAsPrimary , primaryAddress} = useAddress()
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView style={styles.container}>
        <View style={styles.statusContainer}>
          <Pressable style={styles.Container} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={COLOR.secondary} />
            <Text style={styles.Text}>Add Address</Text>
          </Pressable>
        </View>
        {/* Add Address */}
        <TouchableOpacity style={styles.button} onPress={() => router.push('./addAddress')}>
          <Icon name="plus-circle" size={24} color="#5cb85c" style={styles.icon} />
          <Text style={styles.buttonText}>Add new address</Text>
          <Icon name="chevron-right" size={20} color="gray" style={styles.arrowIcon} />
        </TouchableOpacity>

        {/* Request Address */}
        <TouchableOpacity style={styles.button} onPress={handleWhatsAppClick}>
          <View style={styles.iconBackground}>
            <Icon name="whatsapp" size={24} color="white" />
          </View>
          <Text style={styles.buttonText}>Request address from someone else</Text>
          <Icon name="chevron-right" size={20} color="gray" style={styles.arrowIcon} />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Your saved addresses</Text>

        {/* Address Card */}
        {address.map((item, index) => (

          <TouchableOpacity key={index} style={styles.addressCard} onPress={()=>{
            setAddressAsPrimary(item._id)
            router.back()
            }}>
            <View style={styles.addressHeader}>
              <View style={{flexDirection:"row" , flex:1 , justifyContent:"space-between"}}>
              <View style={styles.homeIconBackground}>
                <Icon name="home" size={20} color="#f0ad4e" />
                <Text style={{fontWeight:"bold" , fontSize:18}}>Saved</Text>
              </View>

             {primaryAddress===item._id? <View style={{padding:2 , borderColor:COLOR.primary , borderWidth:2, paddingHorizontal:6 ,alignItems:"center", backgroundColor:COLOR.light , borderRadius:12}}>
                <Text>Primary</Text>
              </View>:""}
              </View>
            </View>
            <Text style={styles.addressDetails}>
              {item.name}, {item.houseNo}, {item.buildingName}, {item.street}, {item.city}, {item.state}, {item.pincode}
            </Text>
            <View style={styles.addressActions}>
              <TouchableOpacity style={styles.actionButton} onPress={() => {
                setCustomAddress(`${item.name}, ${item.houseNo}, ${item.buildingName}, ${item.street}, ${item.city}, ${item.state}, ${item.pincode}`);
                setSelectedAddress(`${item.name}, ${item.houseNo}, ${item.buildingName}, ${item.street}, ${item.city}, ${item.state}, ${item.pincode}`);
                setModalVisible(true);
              }}>
                <Icon name="ellipsis-h" size={20} color="gray" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => {
                Share.share({ message: `Address: ${item.name}, ${item.houseNo}, ${item.buildingName}, ${item.street}, ${item.city}, ${item.state}, ${item.pincode}` });
              }}>
                <Icon name="upload" size={20} color="gray" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}


        {/* Modal */}
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              value={customAddress}
              onChangeText={setCustomAddress}
              placeholder="Edit your address"
              multiline
            />
            <View style={styles.modalButtons}>
              <Button title="Save" onPress={handleEditAddress} />
              <Button title="Delete" color="red" onPress={handleDeleteAddress} />
              <Button title="Cancel" color="gray" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyAddressesScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  icon: {
    marginRight: 10,
  },
  iconBackground: {
    backgroundColor: '#25D366',
    padding: 8,
    borderRadius: 25,
    marginRight: 10,
  },
  arrowIcon: {
    marginLeft: 'auto',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  addressCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  homeIconBackground: {
    marginRight: 10,
    flexDirection:"row",
    gap:4 ,
    alignItems:"center"
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addressDetails: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginLeft: 10,
  },
  modalView: {
    marginTop: 'auto',
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'column',
    gap: 10,
  },
  screen: {
    flex: 1,
    backgroundColor: '#fff',

  },
  statusContainer: {
    
    backgroundColor: "white",
    marginBottom:25
    
     }
  ,
  Container: {
    flexDirection: 'row',
    gap: 20
  },
  Text: {
    fontWeight: 700,
    fontSize: 22,
    color: '#00a99d'

  }
});