import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { userAuth } from '../../Context/authContext';
import { useCart } from "../../Context/cartContext";

export default function CartItem({ item }) {
  const [isSaved, setIsSaved] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const { incrementItem, cartItems, decrementItem, removeFromCart } = useCart();
  const { ExtractParseToken } = userAuth();

  const quantity = (itemId) => {
    const findItem = cartItems.find((item) => item._id === itemId);
    return findItem ? findItem.quantity : 0;
  };

  useFocusEffect(
    useCallback(() => {
      const fetchWishlist = async () => {
        try {
          const token = await ExtractParseToken();
          if (!token) {
            console.warn("No token found");
            setLoading(false);
            return;
          }

          const options = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          };

          const res = await fetch(
            "https://mom-beta-server1.onrender.com/api/wishlist/getwishlist",
            options
          );

          const data = await res.json();
          setLoading(false);

          if (res.ok) {
            const products = data.wishlist.products;
            setWishlist(products);
            setIsSaved(products.some((wishlistItem) => wishlistItem._id === item._id));
          } else {
            console.warn(data.message || "Failed to fetch wishlist");
          }
        } catch (error) {
          console.error("Failed to fetch wishlist:", error);
          setLoading(false);
        }
      };

      fetchWishlist();
    }, [item._id, ExtractParseToken])
  );

  const changeSaveText = async () => {
    const newState = !isSaved;
    setIsSaved(newState);
    const tokenAuth = await ExtractParseToken();

    if (newState) {
      try {
        const response = await fetch(
          "https://mom-beta-server1.onrender.com/api/wishlist/add",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenAuth}`,
            },
            body: JSON.stringify({ productId: item._id }),
          }
        );

        const data = await response.json();
        if (response.ok) {
          console.log("Wishlist added:", data);
        } else {
          console.warn("Wishlist failed:", data?.message || "Error");
        }
      } catch (error) {
        console.error("Error adding to wishlist:", error);
      }
    }
  };

  const isInWishlist = wishlist.some((wishlistItem) => wishlistItem._id === item._id);

  return (
    <View style={styles.itemRow}>
      <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.medicine_name}</Text>
        <Text style={styles.itemUnit}>{item.quantity}</Text>

        <TouchableOpacity
  onPress={changeSaveText}
  disabled={isSaved || wishlist.find((items) => items._id === item._id)}
>
  {loading ? (
    <ActivityIndicator />
  ) : (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {isSaved || wishlist.find((items) => items._id === item._id) ? (
        <Text style={{ color: 'gray' }}>Already in wishlist</Text>
      ) : (
        <Text >Save for later</Text>
      )}
    </View>
  )}
</TouchableOpacity>

      </View>

      <View style={styles.counterBox}>
        <View style={styles.counterControl}>
          <TouchableOpacity
            onPress={() => {
              quantity(item._id) > 1
                ? decrementItem(item._id)
                : removeFromCart(item._id);
            }}
          >
            <Text style={styles.counterBtn}>–</Text>
          </TouchableOpacity>
          <Text style={styles.counterValue}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => incrementItem(item._id)}>
            <Text style={styles.counterBtn}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    justifyContent: "space-between",
  },
  itemImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: "bold",
  },
  itemUnit: {
    color: "#666",
  },
  saveLater: {
    color: "gray",
    textDecorationLine: "underline",
    fontSize: 12,
    marginTop: 4,
  },
  counterBox: {
    alignItems: "center",
  },
  counterControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00bfa5",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  counterBtn: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 6,
  },
  counterValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  itemPrice: {
    marginTop: 4,
    fontWeight: "bold",
  },
});
