import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import apiClient from '../../utils/apiClient';

export default function ConnectionTest() {
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing connection to backend...');
        
        // Test a simple GET request
        console.log('Sending test request to /api/health...');
        const response = await apiClient('api/health');
        console.log('Response from server:', response);
        
        if (response) {
          console.log('✅ Successfully connected to the backend!');
        } else {
          console.log('❌ Received empty response from the server');
        }
      } catch (error) {
        console.error('❌ Connection test failed:', error);
      }
    };

    testConnection();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Testing connection to backend...</Text>
      <Text>Check the console logs for details.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
