import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';

const CustomDropdown = ({ options, onSelect, selectedValue }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setShowDropdown(true)} style={styles.dropdownButton}>
        <Text>{selectedValue}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showDropdown}
        onRequestClose={() => setShowDropdown(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowDropdown(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.option}
                onPress={() => {
                  onSelect(option);
                  setShowDropdown(false);
                }}
              >
                <Text>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  modal: {
    flex: 1,
    justifyContent: 'flex-end', // Adjust the alignment of the modal
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: Dimensions.get('window').width, // Set the width to the screen width
    maxHeight: Dimensions.get('window').height * 0.6, // Set the maximum height
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  closeButton: {
    alignItems: 'flex-end',
    padding: 10,
  },
  closeButtonText: {
    color: 'blue',
  },
});

export default CustomDropdown;
