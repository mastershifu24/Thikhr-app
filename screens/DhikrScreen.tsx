import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

type DhikrScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dhikr'>;

interface Props {
  navigation: DhikrScreenNavigationProp;
}

interface DhikrData {
  date: string;
  count: number;
  streak: number;
}

const DAILY_DHIKR_GOAL = 150;

export function DhikrScreen({ navigation }: Props) {
  const [todayCount, setTodayCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [dailyVerse, setDailyVerse] = useState('');

  // Islamic verses/dhikr for daily inspiration
  const dailyVerses = [
    "سبحان الله والحمد لله ولا إله إلا الله والله أكبر",
    "لا إله إلا أنت سبحانك إني كنت من الظالمين",
    "اللهم صل على محمد وعلى آل محمد",
    "الحمد لله رب العالمين",
    "سبحان الله وبحمده سبحان الله العظيم",
    "لا حول ولا قوة إلا بالله",
    "أستغفر الله العظيم الذي لا إله إلا هو الحي القيوم وأتوب إليه",
    "اللهم إنك عفو تحب العفو فاعف عني",
    "رب اغفر لي وتب علي إنك أنت التواب الرحيم",
    "اللهم صل على محمد وعلى آل محمد كما صليت على إبراهيم وعلى آل إبراهيم إنك حميد مجيد",
    "سبحان الله والحمد لله ولا إله إلا الله والله أكبر ولا حول ولا قوة إلا بالله العلي العظيم",
    "اللهم إني أسألك العفو والعافية في الدنيا والآخرة",
    "ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار",
    "اللهم يا مقلب القلوب ثبت قلبي على دينك",
    "اللهم إني أعوذ بك من زوال نعمتك وتحول عافيتك وفجاءة نقمتك"
  ];

  useEffect(() => {
    loadDhikrData();
    setRandomDailyVerse();
  }, []);

  const loadDhikrData = async () => {
    try {
      const today = new Date().toDateString();
      const storedData = await AsyncStorage.getItem('dhikrData');
      if (storedData) {
        const data: DhikrData[] = JSON.parse(storedData);
        const todayData = data.find(d => d.date === today);
        if (todayData) {
          setTodayCount(todayData.count);
          setCurrentStreak(todayData.streak);
        } else {
          // Check if yesterday had activity to maintain streak
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayData = data.find(d => d.date === yesterday.toDateString());
          const yesterdayStreak = yesterdayData ? yesterdayData.streak : 0;
          setCurrentStreak(yesterdayStreak);
        }
      }
    } catch (error) {
      console.error('Error loading dhikr data:', error);
    }
  };

  const setRandomDailyVerse = () => {
    const randomIndex = Math.floor(Math.random() * dailyVerses.length);
    setDailyVerse(dailyVerses[randomIndex]);
  };

  const incrementDhikr = async () => {
    const newCount = todayCount + 1;
    setTodayCount(newCount);

    // Update streak if goal reached
    if (newCount === DAILY_DHIKR_GOAL && currentStreak === 0) {
      setCurrentStreak(1);
    } else if (newCount === DAILY_DHIKR_GOAL) {
      setCurrentStreak(currentStreak + 1);
    }

    await saveDhikrData(newCount);
  };

  const saveDhikrData = async (count: number) => {
    try {
      const today = new Date().toDateString();
      const storedData = await AsyncStorage.getItem('dhikrData');
      let data: DhikrData[] = storedData ? JSON.parse(storedData) : [];

      const existingIndex = data.findIndex(d => d.date === today);
      if (existingIndex >= 0) {
        data[existingIndex] = { date: today, count, streak: currentStreak };
      } else {
        data.push({ date: today, count, streak: currentStreak });
      }

      await AsyncStorage.setItem('dhikrData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving dhikr data:', error);
    }
  };

  const resetToday = () => {
    Alert.alert(
      'Reset Today\'s Count',
      'Are you sure you want to reset today\'s dhikr count?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            setTodayCount(0);
            await saveDhikrData(0);
          }
        }
      ]
    );
  };

  const progressPercentage = Math.min((todayCount / DAILY_DHIKR_GOAL) * 100, 100);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Dhikr</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.settingsText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.streakContainer}>
        <Text style={styles.streakLabel}>Current Streak</Text>
        <Text style={styles.streakNumber}>{currentStreak}</Text>
        <Text style={styles.streakUnit}>days</Text>
      </View>

      <View style={styles.verseContainer}>
        <Text style={styles.verseLabel}>Daily Dhikr</Text>
        <Text style={styles.verseText}>{dailyVerse}</Text>
      </View>

      <View style={styles.counterContainer}>
        <Text style={styles.counterLabel}>Today's Count</Text>
        <Text style={styles.counterNumber}>{todayCount}</Text>
        <Text style={styles.goalText}>/ {DAILY_DHIKR_GOAL}</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${progressPercentage}%` }
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {progressPercentage.toFixed(0)}% Complete
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.dhikrButton}
          onPress={incrementDhikr}
        >
          <Text style={styles.buttonText}>سبحان الله</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={resetToday}
        >
          <Text style={styles.resetText}>Reset Today</Text>
        </TouchableOpacity>
      </View>

      {todayCount >= DAILY_DHIKR_GOAL && (
        <View style={styles.congratulations}>
          <Text style={styles.congratsText}>
            🎉 MashaAllah! You've completed today's dhikr goal!
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  settingsButton: {
    padding: 10,
  },
  settingsText: {
    fontSize: 24,
  },
  streakContainer: {
    backgroundColor: '#3498db',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  streakLabel: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  streakUnit: {
    fontSize: 16,
    color: 'white',
  },
  verseContainer: {
    backgroundColor: '#27ae60',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  verseLabel: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
  },
  verseText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  counterContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  counterLabel: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  counterNumber: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  goalText: {
    fontSize: 24,
    color: '#95a5a6',
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressBar: {
    height: 20,
    backgroundColor: '#ecf0f1',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#27ae60',
    borderRadius: 10,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#7f8c8d',
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  dhikrButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  resetButton: {
    padding: 10,
  },
  resetText: {
    fontSize: 16,
    color: '#e74c3c',
  },
  congratulations: {
    backgroundColor: '#f39c12',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  congratsText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
