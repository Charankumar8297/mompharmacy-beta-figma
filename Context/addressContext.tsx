import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import { userAuth } from "./authContext";

const AddressContext = createContext(null);

export const AddressProvider = ({ children }) => {
  const [primaryAddress, setPrimaryAddress] = useState(null);
  const [address, setAddress] = useState([]);

  const { ExtractParseToken, userDetails } = userAuth();

  useEffect(() => {
    async function getAddress() {
      const token = await AsyncStorage.getItem("jwt_token");
      const parsedToken = JSON.parse(token);
      try {
        const options = {
          headers: {
            Authorization: `Bearer ${parsedToken}`,
            "Content-Type": "application/json",
          },
        };
        const response = await apiClient("address/address", options);
        if (response) {
          setAddress(response.data);
        } else {
          console.log("something is", response);
        }
      } catch (e) {
        console.log("Error in Fetching data", e);
      }
    }
    getAddress();
  }, []);

  useEffect(() => {
    if (userDetails) setPrimaryAddress(userDetails.primaryAddress);
  }, []);

  async function setAddressAsPrimary(addressId) {
    setPrimaryAddress(addressId);
    const authToken = await ExtractParseToken();
    try {
      const options = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      };
      const response = await apiClient(
        `address/make-primary/${addressId}`,
        options
      );
      if (response) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log("Error in updating address", e);
      return false;
    }
  }

  async function addAddress(data) {
    console.log("this is data", data);
    const authToken = await ExtractParseToken();
    try {
      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
      const response = await apiClient("address/add-address", options);

      // console.log(response)
      setAddressAsPrimary(response.address._id);

      if (response) {
        console.log(response);
        setAddress((prev) => {
          const newAddress = [...prev, response.address];
          return newAddress;
        });
        return true;
      } else {
        console.log(response);
        return false;
      }
    } catch (e) {
      console.log("Error in adding address", e);
      return false;
    }
  }

  function getPrimaryAddress() {
    // console.log("C",address)
    if (!address) return;
    const primaryAddressFull = address.find(
      (item) => item._id === primaryAddress
    );
    if (primaryAddressFull) {
      return `${primaryAddressFull.street},${primaryAddressFull.pincode},${primaryAddressFull.city},${primaryAddressFull.state}`;
    }
    return null;
  }

  async function deleteAddress(id) {
    const authToken = await ExtractParseToken();
    console.log("this is", authToken);

    try {
      const options = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };
      const response = await apiClient(`address/delete/${id}`, options);

      if (response) {
        setAddress((prev) => {
          const filtered = prev.filter((item) => item._id !== id);
          return filtered;
        });
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  return (
    <AddressContext.Provider
      value={{
        primaryAddress,
        address,
        addAddress,
        deleteAddress,
        setAddressAsPrimary,
        getPrimaryAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("Addresss context not found");
  }
  return context;
};
