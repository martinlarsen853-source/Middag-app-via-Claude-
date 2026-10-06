import { Link, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
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
          <Stack.Screen
            name="index"
            options={{
              title: 'Handleklar',
              headerRight: () => (
                <Link href="/butikker" style={{ color: colors.accent, fontSize: 16, fontWeight: '600' }}>
                  <Text>Butikker</Text>
                </Link>
              ),
            }}
          />
          <Stack.Screen name="rett/[id]/index" options={{ title: 'Oppskrift' }} />
          <Stack.Screen name="rett/[id]/butikk" options={{ title: 'Velg butikk' }} />
          <Stack.Screen name="rett/[id]/handleliste/[butikk]" options={{ title: 'Handleliste' }} />
          <Stack.Screen name="butikker/index" options={{ title: 'Butikker' }} />
          <Stack.Screen name="butikker/[id]" options={{ title: 'Rekkefølge' }} />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}
