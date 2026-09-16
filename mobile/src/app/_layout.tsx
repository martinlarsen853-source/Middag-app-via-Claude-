import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';
import { AppProvider } from '@/lib/store';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.bg },
            headerTintColor: colors.accent,
            headerTitleStyle: { color: colors.text, fontWeight: '700' },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: colors.bg },
          }}>
          <Stack.Screen name="index" options={{ title: 'Handleklar' }} />
          <Stack.Screen name="rett/[id]/index" options={{ title: 'Oppskrift' }} />
          <Stack.Screen name="rett/[id]/butikk" options={{ title: 'Velg butikk' }} />
          <Stack.Screen name="rett/[id]/handleliste/[butikk]" options={{ title: 'Handleliste' }} />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}
