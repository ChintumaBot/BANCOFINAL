import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './screens/WelcomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import TransferScreen from './screens/TransferScreen';
import RecibirScreen from './screens/RecibirScreen';
import TransferConfirmationScreen from './screens/TransferConfirmationScreen';
import MovimientosScreen from './screens/MovimientosScreen';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="WelcomeScreen">
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="TransferScreen" component={TransferScreen} />
                <Stack.Screen name="RecibirScreen" component={RecibirScreen} />
                <Stack.Screen name="TransferConfirmationScreen" component={TransferConfirmationScreen} options={{ headerShown: false }} />
                <Stack.Screen name="MovimientosScreen" component={MovimientosScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}