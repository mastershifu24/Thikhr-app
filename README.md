# Thikhr App - Daily Dhikr Tracker

A beautiful and simple Islamic app for tracking daily dhikr with streak counting and reminders.

## Features

- 🕌 Daily dhikr counter with goal tracking (100 dhikr per day)
- 🔥 Streak counter to maintain consistency
- 📖 Daily Islamic verses for inspiration
- 🔔 Customizable daily reminders
- 💾 Local data persistence
- 🎨 Beautiful Islamic-friendly design

## Getting Started

### Prerequisites

- Node.js (v20.10.0 or higher recommended)
- npm or yarn
- Expo CLI (will be installed automatically)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your device:
   - **iOS**: Press `i` in the terminal or scan QR code with Camera app
   - **Android**: Press `a` in the terminal or scan QR code with Expo Go app
   - **Web**: Press `w` in the terminal

### Building for Production

#### iOS (requires macOS)
```bash
npx expo build:ios
```

#### Android
```bash
npx expo build:android
```

## App Structure

```
thikhr-app/
├── App.tsx                 # Main app component with navigation
├── screens/
│   ├── DhikrScreen.tsx     # Main dhikr tracking screen
│   └── SettingsScreen.tsx  # Settings and notifications
├── assets/                 # App icons and images
├── expo/
│   └── AppEntry.js         # Expo entry point
├── app.json                # Expo configuration
├── tsconfig.json           # TypeScript configuration
├── babel.config.js         # Babel configuration
└── package.json            # Dependencies and scripts
```

## Features Overview

### Daily Dhikr Tracking
- Tap the main button to increment your daily dhikr count
- Goal: 100 dhikr per day (customizable in future updates)
- Progress bar shows completion percentage

### Streak Counter
- Maintains consecutive days of completing your dhikr goal
- Resets if you miss a day
- Displayed prominently on the main screen

### Daily Verses
- Random Islamic dhikr/verse displayed each day
- Changes automatically every 24 hours

### Notifications
- Set daily reminders at your preferred time
- Requires notification permissions
- Works in background when app is closed

### Data Persistence
- All data saved locally using AsyncStorage
- Survives app restarts and device reboots
- Easy reset option in settings

## Customization

### Changing Daily Goal
Currently set to 100 dhikr per day. To change:
1. Open `screens/DhikrScreen.tsx`
2. Find `const DAILY_DHIKR_GOAL = 100;`
3. Change the number to your desired goal

### Adding More Verses
To add more daily verses:
1. Open `screens/DhikrScreen.tsx`
2. Find the `dailyVerses` array
3. Add your Arabic verses (copy/paste from reliable Islamic sources)

### Styling
The app uses a green and blue Islamic-friendly color scheme. Colors can be customized in the `StyleSheet` objects in each component.

## Contributing

This app is built with the intention of helping Muslims maintain their daily dhikr. If you'd like to contribute:

1. Ensure all Islamic content is sourced from authentic references
2. Test on both iOS and Android devices
3. Follow the existing code style
4. Add proper Arabic text support

## License

This project is open source and available under the MIT License.

## Disclaimer

This app is intended as a tool to help Muslims remember Allah through dhikr. While we strive for accuracy, please verify Islamic content with qualified scholars. May Allah accept our dhikr and make it a means of forgiveness.

---

**May Allah bless you and accept your dhikr!** 🤲
