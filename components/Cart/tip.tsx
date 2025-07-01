import React, { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const TipSelector = ({ onTipChange }) => {
  const [selectedTip, setSelectedTip] = useState<number | 'custom' | null>(null);
  const [customTip, setCustomTip] = useState('');
  const tips = [20, 30, 50];

  const handleTipSelect = useCallback((amount: number) => {
    const newTip = selectedTip === amount ? null : amount;
    setSelectedTip(newTip);
    if (onTipChange) {
      onTipChange(newTip || 0);
    }
  }, [selectedTip, onTipChange]);

  const handleCustomTipChange = useCallback((value: string) => {
    if (value !== ''&& !/^\d*$/.test(value)) {
      Alert.alert('Invalid Input', 'Please enter a valid number')
      return;
    }
    if (value.length > 3)
      return;
    const parsed = parseInt(value, 10) || 0;
    if (parsed > 500) {
      Alert.alert('Invalid Input', 'Tip amount cannot exceed 500')
      setCustomTip('500');
      setSelectedTip('custom');
      if (onTipChange) {
        onTipChange(500);
      }
      return;
    }
    setCustomTip(value);
    if (value) {
      setSelectedTip('custom');
      const parsed = parseFloat(value);
      if (onTipChange) {
        onTipChange(parsed);
      }
    } else {
      setSelectedTip(null);
      if (onTipChange) {
        onTipChange(0);
      }
    }
  }, [onTipChange]);

  useEffect(() => {
    if (selectedTip === 'custom' && customTip) {
      const parsed = parseFloat(customTip);
      if (onTipChange) {
        onTipChange(parsed);
      }
    }
  }, [customTip, selectedTip, onTipChange]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tip your delivery partner!</Text>
      <Text style={styles.subtitle}>
        Your kindness means a lot! Your tip will go directly to your delivery partner.
      </Text>
      <View style={styles.tipOptions}>
        {tips.map((amount) => (
          <TouchableOpacity
            key={amount}
            style={[
              styles.tipButton,
              selectedTip === amount && styles.selected,
            ]}
            onPress={() => handleTipSelect(amount)}
          >
            <Text style={styles.tipText}>Rs.{amount}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[
            styles.tipButton,
            selectedTip === 'custom' && styles.selected,
          ]}
          onPress={() => setSelectedTip('custom')}
        >
          <Text style={styles.tipText}>Custom</Text>
        </TouchableOpacity>
      </View>

      {selectedTip === 'custom' && (
        <TextInput
          style={[
            styles.tipButton,
            styles.customInput,
            {color:'white'},
            selectedTip === 'custom' && styles.selected,
          ]}
          placeholder="Enter amount"
          placeholderTextColor="white"
          keyboardType="number-pad"
          value={customTip}
          onChangeText={handleCustomTipChange}
          maxLength={3}
          textAlign="center"
          selectionColor="white"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#d5ece9',
    padding: 16,
    borderRadius: 10,
    margin: 16,
    marginHorizontal: 12,
    alignSelf: 'center',
  },
  title: { fontSize: 16, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#555', marginBottom: 12 },
  tipOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  tipButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  tipText: { color: 'black', fontWeight: 'bold' },
  selected: { backgroundColor: '#00A99D' },
  customInput: {
    width: '100%',
    height: 40,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
});

export default TipSelector;