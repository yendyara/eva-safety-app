/**
 * Resolves the active color palette and owns app settings.
 *
 * Dark mode follows the system by default and is never forced on the user —
 * Settings only lets someone opt into "always light" or "always dark" on
 * top of that default. Settings (emergency region, coordinate format, theme
 * mode) live in one context alongside color resolution because they're read
 * from the same AsyncStorage record and change together; splitting them
 * into separate contexts would mean two async loads and two sources of
 * truth for one small settings object.
 */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { ColorScheme, Colors, ThemeTokens } from '@/constants/colors';
import { AppSettings, DEFAULT_SETTINGS, getSettings, saveSettings } from '@/utils/storage';

type AppThemeContextValue = {
  colors: ThemeTokens;
  scheme: ColorScheme;
  settings: AppSettings;
  isLoaded: boolean;
  updateSettings: (partial: Partial<AppSettings>) => Promise<void>;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getSettings().then((stored) => {
      setSettings(stored);
      setIsLoaded(true);
    });
  }, []);

  const updateSettings = async (partial: Partial<AppSettings>) => {
    const next = { ...settings, ...partial };
    setSettings(next);
    await saveSettings(next);
  };

  const scheme: ColorScheme =
    settings.themeMode === 'system'
      ? systemScheme === 'dark'
        ? 'dark'
        : 'light' // treat 'unspecified'/null the same as light, matching the "never forces dark" rule
      : settings.themeMode;

  const value = useMemo<AppThemeContextValue>(
    () => ({ colors: Colors[scheme], scheme, settings, isLoaded, updateSettings }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scheme, settings, isLoaded]
  );

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme(): AppThemeContextValue {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within an AppThemeProvider');
  }
  return context;
}
