import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';

// Screens
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import TrainerDashboard from './screens/trainer/TrainerDahboard';
import AdminDashboard from './screens/Admin/AdminDashboard';
import EnrollTrainerScreen from './screens/Admin/EnrollTrainerScreen';
import TrainerManagementScreen from './screens/Admin/ManageTrainers';
import SessionDetailsScreen from './screens/DetailsScreen';
import AddSessionScreen from './screens/trainer/AddSessionScreen';
import MapScreen from './screens/MapScreen';
import BookingScreen from './screens/Client/BookingScreen';
import OTPVerifyScreen from './screens/OTPVerifyScreen';
import UserDetailsScreen from './screens/UserDetailsScreen';
import RoleSelectScreen from './screens/RoleSelectionScreen';
import ManageSessions from './screens/Admin/ManagerSession';
import ManageUsers from './screens/Admin/ManageUser';
import AddUser from './screens/Admin/AddUser';
import TrainerDetails from './screens/trainer/TrainerDetails';
import MainApp from './screens/MainApp';
import BookTrainerScreen from './screens/Client/BookTrainerScreen';
import TrainerAvailabilityScreen from './screens/trainer/TrainerAvailability';
import BookAppointmentScreen from './screens/Client/BookAppointmentScreen';
import MyBookingsScreen from './screens/Client/MyBookingsScreen';
import ClientDetails from './screens/Client/ClientDetails';
import EditClient from './screens/Client/EditClient';
import BookingConfirmationScreen from './screens/Client/BookingConfirmationScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false,
            animationEnabled: false 
          }} 
          initialRouteName="Welcome"
        >
          {/* Authentication Screens */}
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="OTPVerifyScreen" component={OTPVerifyScreen} />
          <Stack.Screen name="RoleSelection" component={RoleSelectScreen} />
          
          {/* Main App Screens */}
          <Stack.Screen name="MainApp" component={MainApp} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          
          {/* Trainer Screens */}
          <Stack.Screen name="Trainer" component={TrainerDetails} />
          <Stack.Screen name="TrainerDashboard" component={TrainerDashboard} />
          <Stack.Screen name="AddSession" component={AddSessionScreen} />
          <Stack.Screen name="SetAvailability" component={TrainerAvailabilityScreen} />
          
          {/* Booking Screens */}
          <Stack.Screen name="BookTrainer" component={BookTrainerScreen} />
          <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} />
          <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
          <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
          
          {/* Other Screens */}
          <Stack.Screen name="Details" component={SessionDetailsScreen} />
          <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
          <Stack.Screen name="BookingScreen" component={BookingScreen} />
          <Stack.Screen name="Map" component={MapScreen} />
          
          {/* Admin Screens */}
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          <Stack.Screen name="EnrollTrainer" component={EnrollTrainerScreen} />
          <Stack.Screen name="ManageTrainers" component={TrainerManagementScreen} />
          <Stack.Screen name="ManageUsers" component={ManageUsers} />
          <Stack.Screen name="ManageSessions" component={ManageSessions} />
          <Stack.Screen name="AddUser" component={AddUser} />
          <Stack.Screen name="ClientDetails" component={ClientDetails} />
          <Stack.Screen name="EditClient" component={EditClient} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}