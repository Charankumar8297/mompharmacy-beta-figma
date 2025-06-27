import TopNavbar from '@/components/Home/topNavbar';
import { useCart } from '@/Context/cartContext';
import apiClient from '@/utils/apiClient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function Medicines({ limit }) {
  const [sortType, setSortType] = useState('low');
  const [showDropdown, setShowDropdown] = useState(false);
  const [medicine, setMedicine] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { subcategoryId } = useLocalSearchParams();
  const { addToCart, cartItems, incrementItem, decrementItem, removeFromCart } = useCart();

  const quantity = (itemId) => {
    const findItem = cartItems.find(item => item._id === itemId);
    return findItem ? findItem.quantity : 0;
  };

  const fetchMedicines = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient('api/medicines/medicines', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response) {
        setMedicine(response);
      } else {
        setError('No medicines found');
      }
    } catch (error) {
      console.error('Failed to fetch medicines:', error);
      setError('Failed to load medicines. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  // Sort the medicines before rendering
  const sortedMedicines = [...medicine].sort((a, b) => {
    if (sortType === 'low') {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00a99d" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchMedicines} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <TopNavbar onBack={() => router.back()} />

        <View style={styles.header}>
          <MaterialIcons name="arrow-back" size={24} color="black" onPress={()=>router.back()} />         
           <Text style={styles.title}>Popular Medicines</Text>
        </View>

        <View style={styles.sortContainer}>
          <TouchableOpacity 
            onPress={() => setShowDropdown(!showDropdown)} 
            style={styles.sortButton}
          >
            <Text style={styles.sortButtonText}>
              Sort: {sortType === 'low' ? 'Low to High' : 'High to Low'}
            </Text>
          </TouchableOpacity>

          {showDropdown && (
            <View style={styles.dropdown}>
              <TouchableOpacity
                style={styles.dropdownOption}
                onPress={() => {
                  setSortType('low');
                  setShowDropdown(false);
                }}
              >
                <Text>Low to High</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dropdownOption}
                onPress={() => {
                  setSortType('high');
                  setShowDropdown(false);
                }}
              >
                <Text>High to Low</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <FlatList
          data={limit ? sortedMedicines.slice(0, limit) : sortedMedicines}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/Details/details',
                  params: {
                    itemId: item._id,
                    itemName: item.medicine_name,
                    itemImage: item.imageUrl,
                    itemPrice: item.price,
                    description: item.description,
                    use: item.use,
                    ingredients: item.ingredients,
                    dose: item.dose,
                    manufacturer: item.manufacturer,
                    notFor: item.notFor,
                    sideEffects: item.sideEffects,
                    store: item.store,
                    expiryDate: item.expiryDate,
                    manufactureDate: item.manufactureDate,
                  },
                })
              }
            >
              <Womencare
                item={item}
                cartItems={cartItems}
                addToCart={addToCart}
                incrementItem={incrementItem}
                decrementItem={decrementItem}
                removeFromCart={removeFromCart}
                quantity={quantity}
              />
            </TouchableOpacity>
          )}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.grid}
          scrollEnabled={true}
        />
      </View>
    </SafeAreaView>
  );
}

const Womencare = ({ item, cartItems, addToCart, incrementItem, decrementItem, removeFromCart, quantity }) => {
  const isInCart = cartItems.some(cartItem => cartItem._id === item._id);

  return (
    <View style={styles.cardContainer}>
      <ScrollView>
        <View style={styles.card}>
          <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
          <Text style={styles.cardTitle}>{item.medicine_name}</Text>
          <View style={styles.nameContainer}>
            <Text style={styles.cardPrice}>Rs {item.price}</Text>
          </View>

          {!isInCart ? (
            <TouchableOpacity style={styles.medicineBtn} onPress={() => addToCart(item)}>
              <Text style={styles.btnText}>Add To Cart</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={() =>
                  quantity(item._id) > 1 ? decrementItem(item._id) : removeFromCart(item._id)
                }
              >
                <Text style={styles.quantityBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{quantity(item._id)}</Text>
              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={() => incrementItem(item._id)}
              >
                <Text style={styles.quantityBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: -20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#00a99d',
    padding: 10,
    borderRadius: 5,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
    padding: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#333',
    left: 20,
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  sortButton: {
    backgroundColor: '#00a99d',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  sortButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 15,
    backgroundColor: '#e0f7fa',
    borderRadius: 8,
    marginTop: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    zIndex: 1000,
  },
  dropdownOption: {
    padding: 8,
  },
  grid: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: 180,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#b2d8d833',
    margin: 10,
  },
  cardImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  cardTitle: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardPrice: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  medicineBtn: {
    backgroundColor: '#00a99d',
    height: 36,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#00a99d',
    borderRadius: 16,
    paddingHorizontal: 10,
    height: 36,
  },
  quantityBtn: {
    paddingHorizontal: 10,
  },
  quantityBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
