import ActiveOrderItems from "@/components/TrackOrder/ActiveOrderItems";
import { useOrderActive } from "@/Context/orderContext";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingScreen from "../ErrorScreens/loadingscreen";

function CheckOrders() {
  const {orderIDs , loadingOrders} = useOrderActive()
  console.log("this is order ids from check orders", orderIDs)

  if(loadingOrders) return <LoadingScreen/>

  return  <SafeAreaView style={{flex:1}}>
    <ScrollView style={styles.container}>
      <MaterialIcons name='arrow-back' size={24} onPress={()=>router.back()}/>
        <Text style={styles.header}>Multiple orders</Text>
        {Array.isArray(orderIDs) &&
          orderIDs.map((item) => (
            <ActiveOrderItems key={item} activeOrderId={item} />
          ))}
        </ScrollView>
        </SafeAreaView>
  
}

export default CheckOrders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
})