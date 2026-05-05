import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId:   'com.tracklynk.app',
  appName: 'TrackLynk',
  webDir:  'dist',
  server:  { androidScheme: 'https' },
  plugins: {
    SplashScreen: { launchShowDuration: 0 },
  },
}

export default config
