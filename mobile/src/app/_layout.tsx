import { BarlowCondensed_600SemiBold, BarlowCondensed_700Bold } from '@expo-google-fonts/barlow-condensed';
import { DMMono_400Regular, DMMono_500Medium } from '@expo-google-fonts/dm-mono';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppShell } from '@/components/AppShell';
import { colors } from '@/constants/theme';
import { MealsProvider } from '@/lib/meals-store';
import { ShoppingProvider } from '@/lib/shopping';
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

  // Vent på skriftene så siden ikke blinker med feil skrift. Feiler lastingen
  // viser vi siden likevel med systemskrift.
  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <AppProvider>
        <MealsProvider>
          <ShoppingProvider>
            <StatusBar style="dark" />
            <AppShell>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: colors.bg },
                }}
              />
            </AppShell>
          </ShoppingProvider>
        </MealsProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
