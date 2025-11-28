import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

interface Props {
  navigation: SettingsScreenNavigationProp;
}

export function SettingsScreen({ navigation }: Props) {
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('18:00'); // Default 6 PM
  const [notificationPermission, setNotificationPermission] = useState(false);

  useEffect(() => {
    loadSettings();
    checkNotificationPermissions();
  }, []);

  const loadSettings = async () => {
    try {
      const storedReminders = await AsyncStorage.getItem('remindersEnabled');
      const storedTime = await AsyncStorage.getItem('reminderTime');

      if (storedReminders !== null) {
        const parsed = JSON.parse(storedReminders);
        // Ensure it's a boolean, not a string
        setRemindersEnabled(parsed === true || parsed === 'true');
      }
      if (storedTime) {
        setReminderTime(storedTime);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const checkNotificationPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setNotificationPermission(status === 'granted');
  };

  const requestNotificationPermissions = async () => {
    if (!Device.isDevice) {
      Alert.alert('Error', 'Notifications only work on physical devices');
      return;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    setNotificationPermission(status === 'granted');

    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please enable notifications in your device settings to receive dhikr reminders.',
        [{ text: 'OK' }]
      );
    }
  };

  const toggleReminders = async (enabled: boolean) => {
    setRemindersEnabled(enabled);
    await AsyncStorage.setItem('remindersEnabled', JSON.stringify(enabled));

    if (enabled) {
      if (!notificationPermission) {
        await requestNotificationPermissions();
      }
      scheduleNotification();
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  };

  const scheduleNotification = async () => {
    try {
      // Ensure we have valid boolean values
      if (remindersEnabled !== true || !notificationPermission) return;

      // Cancel existing notifications
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Parse time
      const [hours, minutes] = reminderTime.split(':').map(Number);

      // Validate time values
      if (isNaN(hours) || isNaN(minutes)) {
        console.error('Invalid time format');
        return;
      }

      // Schedule daily notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Dhikr Reminder',
          body: 'Time for your daily dhikr! سبحان الله',
          sound: true,
        },
        trigger: {
          hour: hours,
          minute: minutes,
          repeats: true,
        },
      });

      Alert.alert('Success', `Daily dhikr reminder set for ${reminderTime}`);
    } catch (error) {
      console.error('Error scheduling notification:', error);
      Alert.alert('Error', 'Failed to schedule notification. Please try again.');
    }
  };

  const updateReminderTime = async (time: string) => {
    setReminderTime(time);
    await AsyncStorage.setItem('reminderTime', time);

    if (remindersEnabled) {
      scheduleNotification();
    }
  };

  const timeOptions = [
    '05:00', '06:00', '07:00', '08:00', '12:00',
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  const resetAllData = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all your dhikr data and streak. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('dhikrData');
              await AsyncStorage.removeItem('remindersEnabled');
              await AsyncStorage.removeItem('reminderTime');
              await Notifications.cancelAllScheduledNotificationsAsync();
              Alert.alert('Success', 'All data has been reset');
            } catch (error) {
              console.error('Error resetting data:', error);
              Alert.alert('Error', 'Failed to reset data');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>

        {!notificationPermission && (
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestNotificationPermissions}
          >
            <Text style={styles.permissionText}>
              Enable Notifications for Dhikr Reminders
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Daily Reminders</Text>
            <Text style={styles.settingDescription}>
              Get reminded to do your daily dhikr
            </Text>
          </View>
          <Switch
            value={remindersEnabled}
            onValueChange={toggleReminders}
            disabled={!notificationPermission}
          />
        </View>

        {remindersEnabled && (
          <View style={styles.timePicker}>
            <Text style={styles.timeLabel}>Reminder Time</Text>
            <View style={styles.timeOptions}>
              {timeOptions.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeOption,
                    reminderTime === time && styles.timeOptionSelected
                  ]}
                  onPress={() => updateReminderTime(time)}
                >
                  <Text style={[
                    styles.timeOptionText,
                    reminderTime === time && styles.timeOptionTextSelected
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>
          Daily Dhikr App v1.0.0{'\n\n'}
          Track your daily dhikr with streak counting and reminders.{'\n\n'}
          May Allah accept our dhikr and make it a means of forgiveness.
        </Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.dangerButton}
          onPress={resetAllData}
        >
          <Text style={styles.dangerText}>Reset All Data</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 30,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  permissionButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  permissionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  timePicker: {
    marginTop: 15,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f9fa',
  },
  timeOptionSelected: {
    backgroundColor: '#27ae60',
    borderColor: '#27ae60',
  },
  timeOptionText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  timeOptionTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  aboutText: {
    fontSize: 16,
    color: '#7f8c8d',
    lineHeight: 24,
  },
  dangerButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  dangerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
