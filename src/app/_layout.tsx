import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { colors } from '@/theme/colors';

import { SplashScreenView } from '@/components/common/SplashScreenView';

// Prevent splash screen from auto hiding until resources are loaded
SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore error in dev or reload */
});

const CustomLightTheme = {
  ...DarkTheme,
  dark: false,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primaryPurple,
    background: colors.background,
    card: colors.surfaceCard,
    text: colors.textPrimary,
    border: colors.borderSubtle,
    notification: colors.secondaryPink,
  },
};

export default function RootLayout() {
  const [showSplash, setShowSplash] = React.useState(true);

  useEffect(() => {
    // Hide native splash once layout is ready to show animated splash
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <ThemeProvider value={CustomLightTheme}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      {showSplash && (
        <SplashScreenView onFinish={() => setShowSplash(false)} />
      )}
    </ThemeProvider>
  );
}

