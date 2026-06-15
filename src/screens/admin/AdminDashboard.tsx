import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAppSelector } from '../../redux/hooks';
import { Users, BookOpen, Briefcase, Calendar, ChevronRight, Settings, Plus, Sparkles } from 'lucide-react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AdminTabParamList } from '../../types/navigation';

type AdminDashboardNavigationProp = BottomTabNavigationProp<AdminTabParamList, 'AdminDashboard'>;

interface Props {
  navigation: AdminDashboardNavigationProp;
}

export const AdminDashboard: React.FC<Props> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const user = useAppSelector((state) => state.auth.user);

  const stats = {
    students: 2450,
    faculty: 184,
    departments: 6,
    activeDrives: 8,
  };

  const activityLog = [
    { id: '1', action: 'New Faculty registered', time: '10 mins ago', desc: 'Dr. John Watson joined CSE dept' },
    { id: '2', action: 'Event published', time: '1 hour ago', desc: 'AI Symposium 2026 registration open' },
  ];

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      <ScrollView className="px-6 py-4" showsVerticalScrollIndicator={false}>
        {/* Welcome Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text style={{ color: colors.textMuted }} className="text-sm font-semibold tracking-wide uppercase">
              Management Portal
            </Text>
            <Text style={{ color: colors.text }} className="text-2xl font-extrabold tracking-tight mt-0.5">
              {user?.name || 'Administrator'}
            </Text>
            <Text style={{ color: colors.primary }} className="text-xs font-bold mt-1">
              Super Admin Access • Campus Controller
            </Text>
          </View>
          <View 
            style={{ backgroundColor: colors.primaryLight }}
            className="w-12 h-12 rounded-2xl items-center justify-center"
          >
            <Text style={{ color: colors.primary }} className="text-lg font-bold">
              {user?.name.charAt(0) || 'A'}
            </Text>
          </View>
        </View>

        {/* Dynamic Admin Actions shortcuts */}
        <Text style={{ color: colors.text }} className="text-base font-extrabold mb-3">
          Quick Controls
        </Text>
        <View className="flex-row flex-wrap justify-between mb-6">
          {/* User management */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('UserManagement')}
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="w-[48%] p-4 rounded-3xl border shadow-sm mb-4"
          >
            <View style={{ backgroundColor: colors.primary + '15' }} className="p-2.5 rounded-xl self-start mb-3">
              <Users size={20} color={colors.primary} />
            </View>
            <Text style={{ color: colors.text }} className="text-sm font-extrabold">Manage Users</Text>
            <Text style={{ color: colors.textMuted }} className="text-xs mt-1">Add/Edit roles</Text>
          </TouchableOpacity>

          {/* Department Management */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('DepartmentManagement')}
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="w-[48%] p-4 rounded-3xl border shadow-sm mb-4"
          >
            <View style={{ backgroundColor: colors.success + '15' }} className="p-2.5 rounded-xl self-start mb-3">
              <BookOpen size={20} color={colors.success} />
            </View>
            <Text style={{ color: colors.text }} className="text-sm font-extrabold">Departments</Text>
            <Text style={{ color: colors.textMuted }} className="text-xs mt-1">Curriculums & classes</Text>
          </TouchableOpacity>

          {/* Placement drives */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('PlacementTracking')}
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="w-[48%] p-4 rounded-3xl border shadow-sm"
          >
            <View style={{ backgroundColor: colors.warning + '15' }} className="p-2.5 rounded-xl self-start mb-3">
              <Briefcase size={20} color={colors.warning} />
            </View>
            <Text style={{ color: colors.text }} className="text-sm font-extrabold">Placements</Text>
            <Text style={{ color: colors.textMuted }} className="text-xs mt-1">Corporate relations</Text>
          </TouchableOpacity>

          {/* Event publishing */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('EventManagement')}
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="w-[48%] p-4 rounded-3xl border shadow-sm"
          >
            <View style={{ backgroundColor: colors.info + '15' }} className="p-2.5 rounded-xl self-start mb-3">
              <Calendar size={20} color={colors.info} />
            </View>
            <Text style={{ color: colors.text }} className="text-sm font-extrabold">Campus Events</Text>
            <Text style={{ color: colors.textMuted }} className="text-xs mt-1">Publish news & passes</Text>
          </TouchableOpacity>
        </View>

        {/* Global Analytics Counts */}
        <Text style={{ color: colors.text }} className="text-base font-extrabold mb-3">
          University Statistics
        </Text>
        <View 
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          className="border rounded-3xl p-5 mb-6 shadow-sm flex-row justify-between items-center"
        >
          <View className="items-center flex-1 border-r" style={{ borderRightColor: colors.border }}>
            <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold uppercase">Students</Text>
            <Text style={{ color: colors.text }} className="text-lg font-black mt-0.5">{stats.students}</Text>
          </View>
          <View className="items-center flex-1 border-r" style={{ borderRightColor: colors.border }}>
            <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold uppercase">Faculty</Text>
            <Text style={{ color: colors.text }} className="text-lg font-black mt-0.5">{stats.faculty}</Text>
          </View>
          <View className="items-center flex-1">
            <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold uppercase">Drives</Text>
            <Text style={{ color: colors.text }} className="text-lg font-black mt-0.5">{stats.activeDrives}</Text>
          </View>
        </View>

        {/* Recent System Activity log */}
        <Text style={{ color: colors.text }} className="text-base font-extrabold mb-3">
          System Activity Log
        </Text>
        <View 
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          className="border rounded-3xl p-5 mb-8 shadow-sm"
        >
          {activityLog.map((log, index) => (
            <View 
              key={log.id}
              className={`flex-row justify-between items-start ${index !== activityLog.length - 1 ? 'border-b pb-4 mb-4' : ''}`}
              style={{ borderBottomColor: colors.border }}
            >
              <View className="flex-1 mr-3">
                <Text style={{ color: colors.text }} className="text-sm font-extrabold leading-5">
                  {log.action}
                </Text>
                <Text style={{ color: colors.textMuted }} className="text-xs mt-0.5 font-medium leading-4">
                  {log.desc}
                </Text>
              </View>
              <Text style={{ color: colors.primary }} className="text-[10px] font-bold mt-0.5">
                {log.time}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminDashboard;
