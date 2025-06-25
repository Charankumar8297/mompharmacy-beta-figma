import { router } from "expo-router"
import React from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { COLOR, screenWidth } from '../../constants/color'

function FloatOrders(){

    function handleOnPress(){
        console.log("this is pressed")
        router.push("/Orders/CheckOrders")
    }
    
    return <TouchableOpacity style={styles.floatContainer} onPress={handleOnPress}>
        <View>
        <Text style={styles.floatingText}>Your order is on the way...</Text>
        </View>
    </TouchableOpacity>
}

export default FloatOrders

const styles = StyleSheet.create({
    floatContainer:{
        zIndex:1,
        position:"absolute",
        bottom:0 , 
        left:0,
        width:screenWidth,
        backgroundColor:COLOR.primary,
        padding:12,

    },
    floatingText:{
                color:"white",
        fontWeight:"bold",
        textAlign:"center"
    }
})