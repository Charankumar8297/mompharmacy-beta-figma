import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const TipSelector = ({ onTipChange }) => {
  const [selectedTip, setSelectedTip] = useState(null);
  const [customTip, setCustomTip] = useState('');
  const tips = [20, 30, 50];

  useEffect(() => {
    if (typeof onTipChange !== 'function') return;

    if (selectedTip === 'custom') {
      const parsed = parseFloat(customTip);
      onTipChange(!isNaN(parsed) ? parsed : 0);
    } else {
      onTipChange(selectedTip || 0);
    }
  }, [selectedTip, customTip]);

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
            onPress={() => setSelectedTip(amount)}
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
          style={styles.input}
          placeholder="Enter custom tip"
          keyboardType="numeric"
          value={customTip}
          onChangeText={setCustomTip}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#d9f2f1',
    padding: 16,
    borderRadius: 10,
    margin: 16,
    width: '95%',
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
    backgroundColor: '#00b2a9',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  tipText: { color: '#fff', fontWeight: 'bold' },
  selected: { backgroundColor: '#007f7a' },
  input: {
    marginTop: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#aaa',
  },
});

export default TipSelector;