import React from 'react';
import { View, Text, Switch, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { logout } from '../../redux/slices/authSlice';
import { storage } from '../../utils/storage';
import { LogOut, Moon, Sun, Shield, HelpCircle, Bell } from 'lucide-react-native';
import { showToast } from '../../redux/slices/uiSlice';

export const Settings: React.FC = () => {
  const { colors, theme, toggleTheme, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = async () => {
    try {
      await storage.clearAuthData();
      dispatch(logout());
      dispatch(showToast({ message: 'Logged out successfully', type: 'info' }));
    } catch (e) {
      console.error('Error logging out', e);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      <ScrollView className="px-6 py-4">
        {/* Profile Card */}
        {user && (
          <View 
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="p-5 rounded-3xl border flex-row items-center mb-6"
          >
            <View 
              style={{ backgroundColor: colors.primaryLight }}
              className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
            >
              <Text style={{ color: colors.primary }} className="text-xl font-bold">
                {user.name.charAt(0)}
              </Text>
            </View>
            <View className="flex-1">
              <Text style={{ color: colors.text }} className="text-lg font-extrabold">
                {user.name}
              </Text>
              <Text style={{ color: colors.textMuted }} className="text-sm">
                {user.email}
              </Text>
              <View 
                style={{ backgroundColor: colors.primary + '15' }}
                className="self-start px-2 py-0.5 rounded-md mt-1.5"
              >
                <Text style={{ color: colors.primary }} className="text-xs font-semibold capitalize">
                  {user.role}
                </Text>
              </View>
            </View>
          </View>
        )}

        <Text style={{ color: colors.textMuted }} className="text-xs font-bold uppercase tracking-wider mb-3 ml-1">
          Preferences
        </Text>

        {/* Theme Settings Panel */}
        <View 
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          className="rounded-3xl border overflow-hidden mb-6"
        >
          <View className="flex-row items-center justify-between px-5 py-4 border-b" style={{ borderBottomColor: colors.border }}>
            <View className="flex-row items-center">
              {isDark ? (
                <Moon size={22} color={colors.primary} className="mr-3" />
              ) : (
                <Sun size={22} color={colors.primary} className="mr-3" />
              )}
              <Text style={{ color: colors.text }} className="text-base font-semibold">
                Dark Mode
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={isDark ? '#ffffff' : '#f4f3f4'}
            />
          </View>

          {/* Notifications Settings Mock */}
          <TouchableOpacity className="flex-row items-center justify-between px-5 py-4 border-b" style={{ borderBottomColor: colors.border }}>
            <View className="flex-row items-center">
              <Bell size={22} color={colors.primary} className="mr-3" />
              <Text style={{ color: colors.text }} className="text-base font-semibold">
                Push Notifications
              </Text>
            </View>
            <Text style={{ color: colors.textMuted }} className="text-sm font-semibold">
              Enabled
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={{ color: colors.textMuted }} className="text-xs font-bold uppercase tracking-wider mb-3 ml-1">
          Support & Security
        </Text>

        <View 
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          className="rounded-3xl border overflow-hidden mb-8"
        >
          <TouchableOpacity className="flex-row items-center px-5 py-4 border-b" style={{ borderBottomColor: colors.border }}>
            <Shield size={22} color={colors.primary} className="mr-3" />
            <Text style={{ color: colors.text }} className="text-base font-semibold">
              Privacy & Security
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center px-5 py-4">
            <HelpCircle size={22} color={colors.primary} className="mr-3" />
            <Text style={{ color: colors.text }} className="text-base font-semibold">
              Help Support
            </Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center justify-center bg-rose-500/10 border border-rose-500/20 py-4 rounded-2xl mb-8"
        >
          <LogOut size={20} color="#f43f5e" className="mr-2" />
          <Text className="text-rose-500 text-base font-bold">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
