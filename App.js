// App.js
import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import ServiceScreen from './ServiceScreen';
import TimetableScreen from './TimeTableScreen';
import WorkersScreen from './WorkersScreen'
import Employee from './Employee'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


function EmployeeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
      <Stack.Screen name="Workers" component={WorkersScreen} />
      <Stack.Screen name="Employee" component={Employee} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: {
            backgroundColor: '#5D8AA8', //jei nori pakeisk spalva
          },
          headerTintColor: '#FFFFFF',
          tabBarStyle: {
            backgroundColor: '#5D8AA8', //jei nori pakeisk spalva
          },
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: '#A0A0A0',
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Timetable') {
              iconName = require('./images/schedule.png');
            } else if (route.name === 'Service') {
              iconName = require('./images/car-service.png');
            } else if (route.name === 'Workers') {
              iconName = require('./images/worker.png');
            } 

            return <Image source={iconName} style={{ width: size, height: size, tintColor: color }} />;
          },
        })}
      >
        <Tab.Screen name="Timetable" component={TimetableScreen} />
        <Tab.Screen name="Service" component={ServiceScreen} />
        <Tab.Screen name="Worker" component={EmployeeStack} />
       
      </Tab.Navigator>
    </NavigationContainer>
  );
}
