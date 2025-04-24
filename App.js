// App.js
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

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Welcome">
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="OTPVerifyScreen" component={OTPVerifyScreen} />
          <Stack.Screen name="RoleSelection" component={RoleSelectScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="Trainer" component={TrainerDetails} />
          <Stack.Screen name="Details" component={SessionDetailsScreen} />
          <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
          <Stack.Screen name="BookingScreen" component={BookingScreen} />
          <Stack.Screen name="Map" component={MapScreen} />
          <Stack.Screen name="MainApp" component={MainApp} />

          {/* Admin & Trainer access without restrictions */}
          <Stack.Screen name="TrainerDashboard" component={TrainerDashboard} />
          <Stack.Screen name="ScheduleAppointment" component={BookTrainerScreen} />
          <Stack.Screen name="SetAvailability" component={ TrainerAvailabilityScreen }/>

          <Stack.Screen name="AddSession" component={AddSessionScreen} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          <Stack.Screen name="EnrollTrainer" component={EnrollTrainerScreen} />
          <Stack.Screen name="ManageTrainers" component={TrainerManagementScreen} />
          <Stack.Screen name="ManageUsers" component={ManageUsers} />
          <Stack.Screen name="ManageSessions" component={ManageSessions} />
          <Stack.Screen name="AddUser" component={AddUser} />
          

        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
