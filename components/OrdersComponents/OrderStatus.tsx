import { AntDesign, Feather, FontAwesome, Octicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLOR } from '../../constants/color';

const orderStatusList = [
  {
    id: 1,
    title: "Order Confirmed",
    isDone: false,
    icon: <Feather name="check-circle" size={24} color={COLOR.primary} />
  },
  {
    id: 2,
    title: "Order Packed",
    isDone: false,
    icon: <Octicons name="package" size={24} color={COLOR.primary} />
  },
  {
    id: 3,
    title: "Dispatched on the way",
    isDone: false,
    icon: <Feather name="truck" size={24} color={COLOR.primary} />
  },
  {
    id: 4,
    title: "Order Delivered",
    isDone: false,
    icon: <FontAwesome name="handshake-o" size={24} color="black" />
  },
];

function OrderStatus(){
    const [openOrderStatus, setOpenOrderStatus] = React.useState(false);

    const handleOrderStatus = () => {
        setOpenOrderStatus(prev => !prev);
    }
    const orderStatusIcon = openOrderStatus ? "up" : "down";
    const orderStatusIconColor = openOrderStatus ? COLOR.primary : "black";

    return <View style={styles.orderStatusContainer}>
        <TouchableOpacity style={styles.orderStatusBtn} onPress={()=>handleOrderStatus()}>
            <Text style={{fontSize:18 , fontWeight:"bold" , color:"black"}}>Order Status</Text>
            <AntDesign name={orderStatusIcon} size={24} color="black" />    
        </TouchableOpacity>
        {openOrderStatus && (
            <View style={styles.orderStatusDropdownContainer}>
                {orderStatusList.map(item => (
                    <View key={item.id} style={{flexDirection:"row" , alignItems:"center" , marginVertical:5}}>
                        {item.icon}
                        <Text style={{marginLeft:10 , fontSize:16}}>{item.title}</Text>
                    </View>
                ))}
            </View>
        )}
    </View>
} 

export default OrderStatus;

const styles = StyleSheet.create({
    orderStatusContainer:{
        padding: 14,
    },
    orderStatusBtn:{
        backgroundColor:COLOR.light,
        padding: 12,
        flexDirection:"row",
        justifyContent:"space-between",
        // borderRadius: 10,
    },
    orderStatusDropdownContainer:{
        backgroundColor:COLOR.light,
        padding: 12,
        // borderRadius: 10,
    }
})