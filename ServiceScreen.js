//ServiceScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Alert, Button, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import ModalDropdown from 'react-native-modal-dropdown';
import { useNavigation } from '@react-navigation/native';
import { FIRESTORE_DB } from './FirebaseConfig';
import { collection, doc, updateDoc, getDocs, getDoc, setDoc } from 'firebase/firestore';

const ServiceScreen = () => {
  const navigation = useNavigation();
  const [selectedDates, setSelectedDates] = useState({});
  const [workerId, setWorkerId] = useState('');
  const [availableWorkers, setAvailableWorkers] = useState([]);
  const [refresh, setRefresh] = useState(false); // State variable to trigger refresh

  useEffect(() => {
    // Fetch worker availability data from the database
    const fetchAvailability = async () => {
      try {
        const workersCollection = collection(FIRESTORE_DB, 'employees');
        const querySnapshot = await getDocs(workersCollection);
        const availableWorkersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAvailableWorkers(availableWorkersData);
      } catch (error) {
        console.error('Error fetching available workers: ', error);
      }
    };

    fetchAvailability();
    // Reset the refresh state after the data is fetched
    setRefresh(false);
  }, [refresh]); // Trigger the effect when refresh state changes

  const handleDayPress = (day) => {
    const updatedDates = { ...selectedDates };

    if (updatedDates[day.dateString]) {
      delete updatedDates[day.dateString];
    } else {
      updatedDates[day.dateString] = {
        selected: true,
        marked: true,
        startTime: '8:00', // Set the fixed start time
        endTime: '18:00', // Set the fixed end time
      };
    }

    setSelectedDates(updatedDates);
  };

  const handleSaveAvailability = async () => {
    try {
      // Check if the document exists
      const availabilityDocRef = doc(FIRESTORE_DB, 'availability', workerId);
      const availabilityDocSnapshot = await getDoc(availabilityDocRef);
  
      const worker = availableWorkers.find((worker) => worker.id === workerId);
  
      if (availabilityDocSnapshot.exists()) {
        // Update the existing document
        await updateDoc(availabilityDocRef, {
          workerId,
          workerName: `${worker.firstName} ${worker.lastName}`,
          dates: selectedDates,
        });
      } else {
        // Create a new document
        await setDoc(availabilityDocRef, {
          workerId,
          workerName: `${worker.firstName} ${worker.lastName}`,
          dates: selectedDates,
        });
      }
  
      Alert.alert('Success', 'Availability updated successfully!');
      
      // Trigger a refresh after saving availability
      setRefresh(true);
    } catch (error) {
      console.error('Error updating availability: ', error);
      Alert.alert('Error', 'Failed to update availability. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={selectedDates}
        markingType={'multi-dot'}
      />

      <Text style={styles.selectWorkerText}>Select Worker:</Text>
      <ModalDropdown
        options={availableWorkers.map(worker => `${worker.firstName} ${worker.lastName}`)}
        textStyle={styles.dropdownButtonText}
        style={styles.dropdownButton}
        dropdownStyle={styles.dropdown}
        onSelect={(index, value) => setWorkerId(availableWorkers[index].id)}
      />
      <Text style={styles.additionalInfo}>{/* Display other information or components as needed */}</Text>
      <Button title="Save Availability" onPress={handleSaveAvailability} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  selectWorkerText: {
    marginTop: 10,
    marginBottom: 8,  
    height: 25,
    backgroundColor: '#5D8AA8',
    width: 200,
    color: 'white',
    fontSize: 16,  
  },
  dropdownButton: {
    backgroundColor: '#5D8AA8',
    color: 'white',
    width: 200,
  },
  dropdownButtonText: {
    color: 'white',
    fontSize: 16,  
  },
  dropdown: {
    borderColor: 'gray',
    borderWidth: 1,
    maxHeight: 150,
    marginTop: 10,
    backgroundColor: 'white',
  },
  additionalInfo: {
    marginTop: 10,  // Add margin-top to the additional info Text component
  },
  // Add more styles as needed
});

export default ServiceScreen;
