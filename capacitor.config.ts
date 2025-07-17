import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.efootball.teammanager',
  appName: 'eFootball Team Manager',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    bounce: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1976d2',
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1976d2'
    }
  }
};

export default config;
