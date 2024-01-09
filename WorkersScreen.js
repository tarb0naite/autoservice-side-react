//WorkerScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator, ScrollView  } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FIRESTORE_DB } from './FirebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const WorkersScreen = () => {
  const navigation = useNavigation();
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const workersCollection = collection(FIRESTORE_DB, 'employees');
        const querySnapshot = await getDocs(workersCollection);
        const fetchedWorkers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setWorkers(fetchedWorkers);
      } catch (error) {
        console.error('Error fetching workers: ', error);
      }
    };
    

    fetchWorkers();
  }, []);

  const handleNavigateToEmployees = () => {
    navigation.navigate('Employee');
  };

  const handleEditWorker = (worker) => {
    // Navigate to the edit screen with the worker data
    // Pass the worker data as a parameter to the Employee screen
    navigation.navigate('Employee', { editWorker: worker });
  };
  

  const handleDeleteWorker = async (workerId) => {
    try {
      // Delete the worker from Firebase
      await deleteDoc(doc(FIRESTORE_DB, 'employees', workerId));
      // Update the local state to reflect the changes
      setWorkers((prevWorkers) => prevWorkers.filter((worker) => worker.id !== workerId));
    } catch (error) {
      console.error('Error deleting worker: ', error);
      Alert.alert('Error', 'Failed to delete worker. Please try again.');
    }
  };
  
  

  return (
   
    <View style={styles.container}>

    
<TouchableOpacity onPress={handleNavigateToEmployees} style={[styles.button, { marginTop: 10 }]}>
        <Text style={styles.buttonText}>Add new employee</Text>
      </TouchableOpacity>
    

      <FlatList
  data={workers}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <View style={styles.workerContainer}>
      <View style={styles.workerInfo}>
        <Text style={styles.workerLabel}>First Name:</Text>
        <Text style={styles.workerText}>{item.firstName}</Text>

        <Text style={styles.workerLabel}>Last Name:</Text>
        <Text style={styles.workerText}>{item.lastName}</Text>

        <Text style={styles.workerLabel}>Phone:</Text>
        <Text style={styles.workerText}>{item.phone}</Text>

        <Text style={styles.workerLabel}>Position:</Text>
        <Text style={styles.workerText}>{item.position}</Text>
      </View>

      
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => handleEditWorker(item)} style={styles.editButton}>
          <Text>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteWorker(item.id)} style={styles.deleteButton}>
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>

    </View>
  )}
/>

    </View>
  );
};

const styles = StyleSheet.create({
  workerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderBottomWidth: 1, // Add a border at the bottom of each worker's container
    paddingBottom: 8, // Add some padding to separate the workers
  },
  workerInfo: {
    flex: 1,
    paddingRight: 8,
    marginLeft: 10,
  
  },
  workerLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  workerText: {
    marginBottom: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#D3D3D3',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 8,
  },
});



export default WorkersScreen;
