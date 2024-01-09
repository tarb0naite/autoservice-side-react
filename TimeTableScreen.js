//TimeTableScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Modal, TextInput,TouchableOpacity  } from 'react-native';
import moment from 'moment';
import { FIRESTORE_DB } from './FirebaseConfig';
import { addDoc, deleteDoc, doc,getDoc ,getDocs, collection, query, where, updateDoc } from 'firebase/firestore';
import { Calendar } from 'react-native-calendars';
import { Checkbox } from 'react-native-paper';


import CustomDropdown from './Custom';

const TimetableScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [selectedWorkers, setSelectedWorkers] = useState({});
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [comments, setComments] = useState('');
  const [checkboxes, setCheckboxes] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);

const handleAppointmentPress = async (appointment) => {
  try {
    setSelectedAppointment(appointment);

    const appointmentRef = doc(FIRESTORE_DB, 'appointments', appointment.id);
    const appointmentDoc = await getDoc(appointmentRef);

    if (appointmentDoc.exists()) {
      const appointmentData = appointmentDoc.data();
      const statusArray = appointmentData.status ? appointmentData.status.split(', ') : [];
      
      const updatedCheckboxes = {
        inspection: statusArray.includes('inspection'),
        working: statusArray.includes('working'),
        finished: statusArray.includes('finished'),
      };

      setCheckboxes(updatedCheckboxes);
    }

    setModalVisible(true);
  } catch (error) {
    console.error('Error fetching appointment status:', error.message);
  }
};


  const closeModal = () => {
    setModalVisible(false);
    setSelectedAppointment(null);
    setCheckboxes({});
  };

  const handleCheckboxChange = (type) => {
    setCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [type]: !prevCheckboxes[type],
    }));
  };

  const handleCommentChange = (text) => {
    setComments(text);
  };

  const handleUpdateAppointment = async () => {
    try {
      const status = Object.entries(checkboxes)
        .filter(([key, value]) => value)
        .map(([key]) => key);

      const updatedAppointment = {
        status: status.join(', '),
        comments: comments,
      };

      if (selectedAppointment) {
        const appointmentRef = doc(FIRESTORE_DB, 'appointments', selectedAppointment.id);

        await updateDoc(appointmentRef, updatedAppointment);

        Alert.alert('Appointment Updated', 'Appointment has been successfully updated.');

      }

      closeModal();
    } catch (error) {
      console.error('Error updating appointment:', error.message);
      Alert.alert('Error', 'An error occurred while updating the appointment.');
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        console.log('Fetching appointments...');
        const appointmentsCollection = collection(FIRESTORE_DB, 'appointments');
        const appointmentsSnapshot = await getDocs(appointmentsCollection);
  
        const fetchedAppointments = [];
        appointmentsSnapshot.forEach((doc) => {
          const data = doc.data();
          const date = data.date && data.date.toDate ? moment(data.date.toDate()).format('YYYY-MM-DD') : data.date;
  
          fetchedAppointments.push({
            id: doc.id, 
            date: date,
            time: data.time,
            model: data.model,
            username: Array.isArray(data.username) ? data.username[0] : data.username,
            subService: data.subService,
            firstName: data.firstName,
            lastName: data.lastName,
          });
        });
  
        fetchedAppointments.sort((a, b) => moment(a.date) - moment(b.date));
  
        console.log('Fetched appointments:', fetchedAppointments);
        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error.message);
      }
    };

    const fetchWorkers = async () => {
      try {
        console.log('Fetching workers...');
        const workersCollection = collection(FIRESTORE_DB, 'employees');
        const workersSnapshot = await getDocs(workersCollection);

        const fetchedWorkers = [];
        workersSnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedWorkers.push({
            id: doc.id,
            firstName: data.firstName,
            lastName: data.lastName,
          });
        });

        console.log('Fetched workers:', fetchedWorkers);
        setWorkers(fetchedWorkers);
      } catch (error) {
        console.error('Error fetching workers:', error.message);
      }
    };

    fetchAppointments();
    fetchWorkers();
  }, []);

  const markedDates = {};
  appointments.forEach((appointment) => {
    markedDates[appointment.date] = { marked: true, dotColor: 'blue' };
  });

 

  const handleWorkerSelection = async (value, appointment) => {
    if (appointment.workerId) {
      Alert.alert('Appointment Already Assigned', 'This appointment already has a worker assigned.');
      return;
    }

    const selectedWorker = workers.find((w) => `${w.firstName} ${w.lastName}` === value);

    const existingAppointmentQuery = query(
      collection(FIRESTORE_DB, 'appointments'),
      where('date', '==', appointment.date)
    );
    const existingAppointmentsSnapshot = await getDocs(existingAppointmentQuery);

    existingAppointmentsSnapshot.forEach(async (existingDoc) => {
      await deleteDoc(doc(FIRESTORE_DB, 'appointments', existingDoc.id));
    });

    const newAppointment = {
      date: appointment.date,
      time: appointment.time,
      model: appointment.model,
      subService: appointment.subService,
      username: appointment.username,
      workerId: selectedWorker.id,
      firstName: selectedWorker.firstName,
      lastName: selectedWorker.lastName,
    };

    await addDoc(collection(FIRESTORE_DB, 'appointments'), newAppointment);

    setSelectedWorkers({
      ...selectedWorkers,
      [appointment.date]: selectedWorker,
    });

    Alert.alert('Worker Selected', `${selectedWorker.firstName} ${selectedWorker.lastName} has been assigned to the appointment.`);
  };

  return (
    <ScrollView style={styles.container}>
      <Calendar markingType="dot" markedDates={markedDates} onDayPress={(day) => console.log('Selected day', day)} />
      {appointments.map((appointment, index) => {
  const worker = workers.find((w) => w.id === appointment.workerId) || {};
  const selectedWorker = selectedWorkers[appointment.date] || {};

  const appointmentContainerStyle = [styles.appointmentContainer];

  if (checkboxes.finished) {
    appointmentContainerStyle.push(styles.finishedAppointment);
  }

        return (
          <View key={index} style={styles.appointmentContainer} onTouchStart={() => handleAppointmentPress(appointment)}>
            <Text style={styles.day}>{moment(appointment.date).format('dddd, MMMM Do')}</Text>
            <Text style={styles.time}>{appointment.time}</Text>
            <Text style={styles.name}>{appointment.model}</Text>
            <Text style={styles.details}>{appointment.subService}</Text>

            <Text style={styles.details}>Username or phone number:</Text>
            <Text style={styles.details}>{appointment.username?.username}</Text>

            <Text style={styles.details}>Responsible worker:</Text>
            <Text style={styles.name}>{`${appointment.firstName} ${appointment.lastName}`}</Text>

            {appointment.workerId ? (
              <>
                <Text style={styles.details}>Responsible worker:</Text>
                <Text style={styles.name}>{`${appointment.firstName} ${appointment.lastName}`}</Text>
              </>
            ) : (
              <CustomDropdown
                options={workers.map((w) => `${w.firstName} ${w.lastName}`)}
                selectedValue={`${selectedWorker.firstName || ''} ${selectedWorker.lastName || ''}`}
                onSelect={(value) => handleWorkerSelection(value, appointment)}
              />
            )}
          </View>
        );
      })}

      <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Appointment Details</Text>
            {selectedAppointment && (
              <>
                <Text>Date: {moment(selectedAppointment.date).format('dddd, MMMM Do')}</Text>
                <Text>Time: {selectedAppointment.time}</Text>
                <Text>Model: {selectedAppointment.model}</Text>
                <Text>SubService: {selectedAppointment.subService}</Text>
                {selectedAppointment.workerId && (
                  <>
                    <Text style={styles.details}>Responsible worker:</Text>
                    <Text style={styles.name}>{`${selectedAppointment.firstName} ${selectedAppointment.lastName}`}</Text>
                  </>
                )}
                {Object.entries(checkboxes).map(([key, isChecked]) => (
                  <View key={key} style={styles.checkboxContainer}>
                    <Checkbox
                      status={isChecked ? 'checked' : 'unchecked'}
                      onPress={() => handleCheckboxChange(key)}
                      color="black"
                      uncheckedColor="black"
                    />
                    <Text>{key}</Text>
                  </View>
                ))}

                {/* Text field for comments */}
                <TextInput
                  style={styles.commentInput}
                  placeholder="Enter comments..."
                  value={comments}
                  onChangeText={handleCommentChange}
                  multiline
                />

                {/* Button to update appointment */}
                <TouchableOpacity style={styles.updateButton} onPress={handleUpdateAppointment}>
                  <Text style={styles.updateButtonText}>Update Appointment</Text>
                </TouchableOpacity>

                {/* Close button */}
                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  appointmentContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 16,
    marginBottom: 16,
  },
  day: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  time: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentInput: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  updateButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  finishedAppointment: {
    backgroundColor: 'green',
  },
});
export default TimetableScreen;
