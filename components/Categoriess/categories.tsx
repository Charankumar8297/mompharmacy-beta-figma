import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import apiClient from '../../utils/apiClient';
import Womencare from './womenCare';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient('api/medicines/categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response) {
        setCategories(response);
      } else {
        setError('No categories found');
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
        <TouchableOpacity onPress={fetchCategories} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={categories}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View>
            <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
              <Text style={{ flex: 1, fontWeight: '500', fontSize: 20}} onPress={()=>router.push({pathname:'/CategoriesWiseMedicines', params:{CategoryId:item._id}})}>
                {item.category_name}
              </Text>
              <TouchableOpacity onPress={()=>router.push({pathname:'/CategoriesWiseMedicines', params:{CategoryId:item._id}})}>
                <Text style={{ fontWeight: '500', fontSize: 16, color: '#00a99d' }}>
                  See All <AntDesign name="arrowright" size={20} color="#00a99d" />
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={item.subcategories?.slice(0,4) || []}
              keyExtractor={(sub) => sub._id}
              numColumns={4}
              scrollEnabled={false}
              contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 10 }}
              renderItem={({ item: sub }) => (
                <TouchableOpacity
                  onPress={() => {
                    router.push({
                      pathname: '/medicine',
                      params: { subcategoryId: sub._id },
                    });
                  }}
                >
                  <Womencare
                    name={sub.subcategory_name}
                    Icon={
                      <Image
                        source={{ uri: sub.imageUrl }}
                        style={styles.icon}
                      />
                    }
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    height: 60,
    width: 50,
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
});