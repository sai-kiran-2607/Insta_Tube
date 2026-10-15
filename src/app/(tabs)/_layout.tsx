import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Download, Home, Settings } from 'lucide-react-native';
import { colors } from '@/theme/colors';

interface TabIconWithIndicatorProps {
  focused: boolean;
  color?: string;
  icon: React.ReactNode;
}

const TabIconWithIndicator: React.FC<TabIconWithIndicatorProps> = ({
  focused,
  icon,
}) => {
  return (
    <View style={styles.iconContainer}>
      {focused && <View style={styles.topIndicator} />}
      {icon}
    </View>
  );
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 6);
  const tabHeight = 60 + (Platform.OS === 'ios' ? insets.bottom : bottomInset);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primaryPurple,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: [
          styles.tabBar,
          {
            height: tabHeight,
            paddingBottom: bottomInset,
          },
        ],
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIconWithIndicator
              focused={focused}
              color={String(color)}
              icon={<Home size={22} color={String(color)} strokeWidth={focused ? 2.5 : 2} />}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="downloads"
        options={{
          title: 'Downloads',
          tabBarIcon: ({ color, focused }) => (
            <TabIconWithIndicator
              focused={focused}
              color={String(color)}
              icon={<Download size={22} color={String(color)} strokeWidth={focused ? 2.5 : 2} />}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabIconWithIndicator
              focused={focused}
              color={String(color)}
              icon={<Settings size={22} color={String(color)} strokeWidth={focused ? 2.5 : 2} />}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#EDEBF8',
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 32,
    width: 48,
  },
  topIndicator: {
    position: 'absolute',
    top: -8,
    width: 32,
    height: 3,
    backgroundColor: '#7138F5',
    borderRadius: 2,
  },
});
