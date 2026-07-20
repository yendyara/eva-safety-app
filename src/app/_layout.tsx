/**
 * Root layout: theme setup and screen transitions.
 *
 * Every screen shares one Stack with headerShown off — each screen builds
 * its own minimal header (a back arrow, or nothing at all) so the app never
 * shows default navigation chrome that would clutter the "steady hand"
 * feel the product is going for. Transitions are set to a plain fade:
 * spring/bounce motion reads as playful, which is the wrong register for
 * an app someone may be opening mid-crisis.
 */
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { AppThemeProvider, useAppTheme } from '@/utils/colorSystem';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { colors, scheme, isLoaded } = useAppTheme();

  useEffect(() => {
    if (isLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <RootNavigator />
    </AppThemeProvider>
  );
}
