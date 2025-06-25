import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import apiClient from "../utils/apiClient";

const OrderContext = createContext({
    
    ActiveOrderId:null,
    orderIDs:[],
    updateActiveOrder:(orderId)=>{},
    setActiveOrder:(orderId)=>{},
    loadingOrders:true,
    
})

export function OrderProvider({children}){

    const [ActiveOrderId , setActiveOrder] = useState(null)
    const [orderIDs , setOrderIDs] = useState(null)
    const [loadingOrders , setLoadingOrders] = useState(true)

    async function getActiveOrders(){
        const token = await AsyncStorage.getItem("jwt_token")
        const parsedToken = JSON.parse(token)
        console.log("this is token from orders:",token)
        try{
            const options = {
                method:"GET",
                headers:{
                    "Authorization":`Bearer ${parsedToken}`,
                    "Content-Type":"application/json"
                }
            }
            const activeOrders = await apiClient("api/activeOrders" , options)
            console.log("this is active order",activeOrders)
            setLoadingOrders(false)
            setActiveOrder(activeOrders.data[0]._id)
            setOrderIDs(activeOrders.data.map((item)=>item._id))
        }catch(error){
            console.log("Error in fetching active orders" , error)
        }
    }

    function updateActiveOrder(orderId){
        setActiveOrder(orderId)
    }

    useEffect(()=>{
        getActiveOrders()
    } , [])

    
    return <OrderContext.Provider value={{ActiveOrderId , setActiveOrder , updateActiveOrder , orderIDs , loadingOrders}}>
        {children}
    </OrderContext.Provider>
}

export function useOrderActive(){
    const context = useContext(OrderContext)
    if(!context) throw new Error("Order Context not found")
    return context
}
