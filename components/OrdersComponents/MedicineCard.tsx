import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { COLOR } from '../../constants/color'
import { useCart } from '../../Context/cartContext'

export default function MedicineCard({ item }) {
    const { addToCart, cartItems, incrementItem, decrementItem, removeFromCart } = useCart()
    console.log(cartItems)

    const quantity = (itemId) => {
        const findItem = cartItems.find(item => item._id === itemId);
        console.log("this is cart item", findItem)
        const isExist = cartItems.some(item => item._id === itemId)
        console.log(isExist)
        return findItem ? findItem.quantity : 0;  // Return 0 if item not found
    };

    return (
        <View style={medicineStyle.cardContainer}>
            <View style={medicineStyle.imageContainer}>
                <Image style={medicineStyle.imageUrl} source={require('../../assets/images/Categories/babyoil.png')} />
            </View>
            <View style={medicineStyle.contentContainer}>
                <View>
                    <Text>{item.name}</Text>
                    <Text style={medicineStyle.price}>Rs {item.price}</Text>
                    <Text style={medicineStyle.discountStyle}>21% off</Text>
                </View>
                <View style={medicineStyle.timeContainer}>
                    <Text style={medicineStyle.time}>30 min</Text>
                </View>
            </View>
            {!cartItems.some(cartItems => cartItems._id === item._id) ? <TouchableOpacity style={medicineStyle.medicineBtn} onPress={() => addToCart(item)}>
                <Text style={medicineStyle.btnText}>Add To cart</Text>
            </TouchableOpacity> : <View style={medicineStyle.quantityContainer}>
                <TouchableOpacity style={medicineStyle.quantityBtn} onPress={() => {
                    quantity(item._id) > 1 ? decrementItem(item._id) : removeFromCart(item._id)
                }}>
                    <Text style={medicineStyle.quantityBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={medicineStyle.quantity}>{quantity(item._id)}</Text>
                <TouchableOpacity style={medicineStyle.quantityBtn} onPress={() => incrementItem(item._id)}>
                    <Text style={medicineStyle.quantityBtnText}>+</Text>
                </TouchableOpacity>

            </View>}



        </View>
    )
}

const medicineStyle = StyleSheet.create({
    imageUrl: {
        height: 100,
        width: 60,
    },
    cardContainer: {
        width: 200,
        borderWidth: 1,
        borderColor: COLOR.light,
        borderRadius: 12,
        padding: 12
    },
    imageContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    contentContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    price: {
        fontWeight: "bold"
    },
    timeContainer: {
        backgroundColor: COLOR.light,
        padding: 5
    },
    time: {
        fontSize: 12,
        color: COLOR.primary
    },
    discountStyle: {
        color: COLOR.primary,
        fontWeight: "bold"
    },
    medicineBtn: {
        padding: 7,
        backgroundColor: "#007e71",
        borderRadius: 24,
        marginTop: 12
    },
    btnText: {
        textAlign: "center",
        color: "white"

    },
    quantityContainer: {
        flexDirection: "row",
        backgroundColor: COLOR.btnPrimary,
        margin: 1,
        alignItems: "center",
        justifyContent: "space-around",
        borderRadius: 18
    },
    quantityBtn: {

    },
    quantityBtnText: {
        fontSize: 30,
        color: "white"
    },
    quantity: {
        color: "white"
    }
})