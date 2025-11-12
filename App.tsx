import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { DhikrScreen } from './screens/DhikrScreen';
import { SettingsScreen } from './screens/SettingsScreen';

export type RootStackParamList = {
  Dhikr: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dhikr">
        <Stack.Screen
          name="Dhikr"
          component={DhikrScreen}
          options={{ title: 'Daily Dhikr' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
