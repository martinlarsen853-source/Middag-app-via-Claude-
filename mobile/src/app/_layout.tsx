import { BarlowCondensed_600SemiBold, BarlowCondensed_700Bold } from '@expo-google-fonts/barlow-condensed';
import { DMMono_400Regular, DMMono_500Medium } from '@expo-google-fonts/dm-mono';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppShell } from '@/components/AppShell';
import { colors } from '@/constants/theme';
import { MealsProvider } from '@/lib/meals-store';
import { HistoryProvider } from '@/lib/history';
import { ShoppingProvider } from '@/lib/shopping';
import { SyncProvider } from '@/lib/sync';
import { AppProvider } from '@/lib/store';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    BarlowCondensed_600SemiBold,
    BarlowCondensed_700Bold,
    DMMono_400Regular,
    DMMono_500Medium,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  // Vent kort på skriftene så siden ikke blinker med feil skrift. På dårlig nett
  // (i butikken) viser vi appen likevel etter litt, med systemskrift til de er lastet.
  const [gaveUp, setGaveUp] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setGaveUp(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!fontsLoaded && !fontError && !gaveUp) return null;

  return (
    <SafeAreaProvider>
      <AppProvider>
        <MealsProvider>
          <ShoppingProvider>
            <SyncProvider>
              <HistoryProvider>
                <StatusBar style="dark" />
                <AppShell>
                  <Stack
                    screenOptions={{
                      headerShown: false,
                      contentStyle: { backgroundColor: colors.bg },
                    }}
                  />
                </AppShell>
              </HistoryProvider>
            </SyncProvider>
          </ShoppingProvider>
        </MealsProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
