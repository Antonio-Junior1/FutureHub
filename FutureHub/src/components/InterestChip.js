import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const InterestChip = ({ interest, selected, onPress, theme }) => {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        { 
          backgroundColor: selected ? interest.color : theme.surface,
          borderColor: interest.color,
          borderWidth: 2,
        }
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <Ionicons 
          name={interest.icon} 
          size={24} 
          color={selected ? '#fff' : interest.color} 
        />
        <Text 
          style={[
            styles.text, 
            { color: selected ? '#fff' : theme.text.primary }
          ]}
        >
          {interest.nome}
        </Text>
        {selected && (
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
});

export default InterestChip;
