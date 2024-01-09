//Employee.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import { FIRESTORE_DB } from './FirebaseConfig'; 
import servicesData from './Services.json'
import { useNavigation, useRoute } from '@react-navigation/native';
import { getFirestore, collection, addDoc, updateDoc, doc } from 'firebase/firestore';

function Employee() {
  const route = useRoute(); 
  const { editWorker } = route.params || {}; 
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    // Check if there is editWorker data
    if (editWorker) {
      setFirstName(editWorker.firstName || '');
      setLastName(editWorker.lastName || '');
      setEmail(editWorker.email || '');
      setPhone(editWorker.phone || '');
  
      // Check if the editWorker position is in the jobTypes array
      if (positions.includes(editWorker.position)) {
        setPosition(editWorker.position || '');
      } else {
        // If not, you might want to set a default value or handle it differently
        setPosition('');
      }
    }
  }, [editWorker, positions]);

  useEffect(() => {
    const jobTypes = servicesData.services.map((service) => service.type);
    setPositions(jobTypes);
  }, []);

  const addEmployeeToFirestore = async () => {
    try {
      setLoading(true);
  
      const employeeData = {
        firstName,
        lastName,
        email,
        phone,
        position,
      };
  
      if (editWorker) {
        // Editing an existing worker
        // Update the document in Firestore
        await updateDoc(doc(FIRESTORE_DB, 'employees', editWorker.id), employeeData);
        console.log('Employee updated successfully!');
      } else {
        // Adding a new worker
        // Add a new document to Firestore
        const docRef = await addDoc(collection(FIRESTORE_DB, 'employees'), employeeData);
        console.log('Employee added with ID: ', docRef.id);
      }
  
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setPosition('');
  
      setLoading(false);
      Alert.alert('Success', 'Employee data updated successfully!');
  
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      console.error('Error updating/adding employee: ', error);
      Alert.alert('Error', 'Failed to update/add employee. Please try again.');
    }
  };
  return (
    <View style={styles.container}>
      <Text>First Name:</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={(text) => setFirstName(text)}
      />

      <Text>Last Name:</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={(text) => setLastName(text)}
      />

      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
      />

      <Text>Phone:</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={(text) => setPhone(text)}
        keyboardType="phone-pad"
      />

      <Text>Position:</Text>
      <ModalDropdown
        options={positions}
        textStyle={{ color: 'black' }}
        dropdownStyle={styles.dropdown}
        onSelect={(index, value) => setPosition(value)}
      />

      {/* Loading indicator */}
      {loading && (
        <ActivityIndicator size="large" color="blue" style={{ marginTop: 10 }} />
      )}

      <TouchableOpacity onPress={addEmployeeToFirestore} style={[styles.button, { marginTop: 10 }]} disabled={loading}>
        <Text style={styles.buttonText}>Add new employee</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  dropdown: {
    borderColor: 'gray',
    borderWidth: 1,
    maxHeight: 150, 
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Employee;
