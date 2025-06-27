import { useCart } from '@/Context/cartContext';
import apiClient from '@/utils/apiClient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Recommended() {
  const { item, cartItems, addToCart, incrementItem, decrementItem, removeFromCart} = useCart();
  const [recommended, setRecommended] = useState([]);

  const quantity = (itemId) => {
    const findItem = cartItems.find(item => item._id === itemId);
    return findItem ? findItem.quantity : 0;
  }
  useEffect(() => {
    const fetchRecommendedMedicines = async () => {
      try {
        const subcategoryIds = cartItems.flatMap(item => item.subcategories || []);
        const uniqueSubcategoryIds = [...new Set(subcategoryIds)];

        const allPromises = uniqueSubcategoryIds.map(id =>
          apiClient(`api/medicines/subcategories/${id}/medicines`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          })
        );

        const responses = await Promise.all(allPromises);
        const allMedicines = responses.flat();
        const filtered = allMedicines.filter(medicine => 
          !cartItems.some(item => item._id === medicine._id)
        );

        setRecommended(filtered);
      } catch (error) {
        console.error('Failed to fetch recommended medicines:', error);
      }
    };

    fetchRecommendedMedicines();
  }, [cartItems]);

  return (
    <SafeAreaView>
    <View style={styles.container}>
   
      <Text style={styles.heading}>Recommended Medicines</Text>


      <FlatList
        data={recommended}

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
                  subcategories: JSON.stringify(item.subcategories || []),
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
          <SafeAreaView>
      <ScrollView>
        <View style={styles.card}>
          <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
          <Text style={styles.cardTitle} numberOfLines={1}>{item.medicine_name}</Text>
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
      </SafeAreaView>
    </View>
  
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    
  },
  heading: {
    fontSize: 17,
    fontWeight: "bold",
  },
  header: {
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#333',
  },
  sortButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  grid: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    gap: 12,
  },
  cardContainer: {
    width: 160,
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#b2d8d833',
    margin: 8,
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
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityBtn: {
    backgroundColor: '#00a99d',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  quantityBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantity: {
    marginHorizontal: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
