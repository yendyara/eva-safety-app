/**
 * Root layout: theme setup, font loading, and screen transitions.
 *
 * Every screen shares one Stack with headerShown off — each screen builds
 * its own minimal header (a back arrow, or nothing at all) so the app never
 * shows default navigation chrome that would clutter the "steady hand"
 * feel the product is going for. Transitions are set to a plain fade:
 * spring/bounce motion reads as playful, which is the wrong register for
 * an app someone may be opening mid-crisis.
 *
 * Inter (600/800) loads here because it's only used for headlines and
 * alert titles (see Typography) — everything else stays on the system font
 * for fast first paint. The splash screen holds until both the theme and
 * these fonts are ready, so no screen ever flashes system-font headlines
 * before Inter swaps in.
 */
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_600SemiBold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { AppThemeProvider, useAppTheme } from '@/utils/colorSystem';

SplashScreen.preventAutoHideAsync();

/**
 * On web the window can be far wider than any phone, and a full-bleed layout
 * leaves the panic button and copy stranded in a sea of whitespace. Cap the
 * app at roughly a 10" iPad's portrait width and centre it, with a muted
 * backdrop framing the column on anything wider. Native is untouched — the
 * cap is inert there since no device is this wide.
 */
const MAX_CONTENT_WIDTH = 820;

function RootNavigator() {
  const { colors, scheme, isLoaded } = useAppTheme();
  const [fontsLoaded] = useFonts({ Inter_600SemiBold, Inter_800ExtraBold });
  const ready = isLoaded && fontsLoaded;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  const stack = (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      {Platform.OS === 'web' ? (
        <View
          style={[
            styles.webBackdrop,
            { backgroundColor: scheme === 'dark' ? '#000000' : '#EFEAE4' },
          ]}
        >
          <View style={[styles.webFrame, { backgroundColor: colors.background }]}>{stack}</View>
        </View>
      ) : (
        stack
      )}
    </>
  );
}

const styles = StyleSheet.create({
  webBackdrop: {
    flex: 1,
    alignItems: 'center',
  },
  webFrame: {
    flex: 1,
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
  },
});

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <RootNavigator />
    </AppThemeProvider>
  );
}
