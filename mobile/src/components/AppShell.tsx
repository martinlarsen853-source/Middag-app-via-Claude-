import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter, type Href } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, MAX_WIDTH, radius, spacing } from '@/constants/theme';
import { MEALS } from '@/data/meals';
import { useLayout } from '@/lib/layout';
import { useApp } from '@/lib/store';

type Tab = {
  key: 'middager' | 'handleliste' | 'butikker';
  label: string;
  href: Href;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
};

const TABS: Tab[] = [
  { key: 'middager', label: 'Middager', href: '/', icon: 'restaurant-outline', iconActive: 'restaurant' },
  { key: 'handleliste', label: 'Handleliste', href: '/handleliste', icon: 'basket-outline', iconActive: 'basket' },
  { key: 'butikker', label: 'Butikker', href: '/butikker', icon: 'storefront-outline', iconActive: 'storefront' },
];

function activeTab(pathname: string): Tab['key'] {
  if (pathname.startsWith('/handleliste')) return 'handleliste';
  if (pathname.startsWith('/butikker')) return 'butikker';
  return 'middager';
}

// Hvor mange varer som gjenstår på den aktive lista, vist som et lite merke på fanen.
function useRemaining(): number {
  const { activeList, checked } = useApp();
  if (!activeList) return 0;
  const meal = MEALS.find(m => m.id === activeList.mealId);
  if (!meal) return 0;
  return meal.ingredients.filter((_, index) => !checked[`${meal.id}:${index}`]).length;
}

export function AppShell({ children }: { children: ReactNode }) {
  const { wide } = useLayout();
  return (
    <View style={styles.shell}>
      <TopBar />
      <View style={styles.content}>{children}</View>
      {!wide && <BottomBar />}
    </View>
  );
}

function Logo() {
  const router = useRouter();
  return (
    <Pressable accessibilityRole="link" accessibilityLabel="Handleklar, til forsiden" onPress={() => router.navigate('/')} style={styles.logo}>
      <View style={styles.logoMark}>
        <Text style={styles.logoMarkText}>H</Text>
      </View>
      <Text style={styles.logoText}>Handleklar</Text>
    </Pressable>
  );
}

function TopBar() {
  const { wide, gutter } = useLayout();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const router = useRouter();
  const current = activeTab(pathname);
  const remaining = useRemaining();

  return (
    <View style={[styles.topBar, { paddingTop: insets.top }]}>
      <View style={[styles.topBarInner, { paddingHorizontal: gutter, maxWidth: MAX_WIDTH + gutter * 2 }]}>
        <Logo />
        {wide && (
          <View style={styles.topNav} accessibilityRole="menubar">
            {TABS.map(tab => {
              const active = tab.key === current;
              return (
                <Pressable
                  key={tab.key}
                  accessibilityRole="link"
                  accessibilityState={{ selected: active }}
                  onPress={() => router.navigate(tab.href)}
                  style={({ hovered }: { pressed: boolean; hovered?: boolean }) => [
                    styles.topNavItem,
                    active && styles.topNavItemActive,
                    hovered && !active && { backgroundColor: colors.beige },
                  ]}>
                  <Ionicons name={active ? tab.iconActive : tab.icon} size={18} color={colors.ink} />
                  <Text style={styles.topNavText}>{tab.label}</Text>
                  {tab.key === 'handleliste' && remaining > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{remaining}</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}

function BottomBar() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const router = useRouter();
  const current = activeTab(pathname);
  const remaining = useRemaining();

  return (
    <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]} accessibilityRole="tablist">
      {TABS.map(tab => {
        const active = tab.key === current;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={tab.label}
            onPress={() => router.navigate(tab.href)}
            style={styles.bottomItem}>
            <View style={[styles.bottomIcon, active && styles.bottomIconActive]}>
              <Ionicons name={active ? tab.iconActive : tab.icon} size={22} color={colors.ink} />
              {tab.key === 'handleliste' && remaining > 0 && (
                <View style={[styles.badge, styles.badgeFloating]}>
                  <Text style={styles.badgeText}>{remaining}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.bottomLabel, active && styles.bottomLabelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
  },
  topBar: {
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    alignItems: 'center',
  },
  topBarInner: {
    width: '100%',
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxl,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoMark: {
    width: 38,
    height: 38,
    borderRadius: radius.round,
    backgroundColor: colors.limeStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMarkText: {
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 28,
    color: colors.ink,
  },
  logoText: {
    fontFamily: fonts.display,
    fontSize: 30,
    lineHeight: 34,
    color: colors.ink,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  topNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
  },
  topNavItemActive: {
    backgroundColor: colors.lime,
  },
  topNavText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    color: colors.ink,
  },
  badge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: radius.round,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeFloating: {
    position: 'absolute',
    top: -2,
    right: 4,
  },
  badgeText: {
    fontFamily: fonts.monoMedium,
    fontSize: 11,
    color: colors.bg,
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  bottomItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    minHeight: 52,
  },
  bottomIcon: {
    width: 64,
    height: 32,
    borderRadius: radius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomIconActive: {
    backgroundColor: colors.limeStrong,
  },
  bottomLabel: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.inkSoft,
  },
  bottomLabelActive: {
    fontFamily: fonts.monoMedium,
    color: colors.ink,
  },
});
