import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAppSelector } from '../../redux/hooks';
import { BookOpen, Calendar, Clock, Clipboard, AlertCircle, Users, Award } from 'lucide-react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { FacultyTabParamList } from '../../types/navigation';

type FacultyDashboardNavigationProp = BottomTabNavigationProp<FacultyTabParamList, 'FacultyDashboard'>;

interface Props {
  navigation: FacultyDashboardNavigationProp;
}

export const FacultyDashboard: React.FC<Props> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const user = useAppSelector((state) => state.auth.user);

  const assignedClasses = [
    { id: '1', name: 'Software Engineering (CS601)', time: '09:00 AM - 10:00 AM', room: 'Room 304, Block A' },
    { id: '2', name: 'Compiler Design (CS602)', time: '11:30 AM - 12:30 PM', room: 'Lab 2, CSE Block' },
  ];

  const stats = {
    classesCount: 3,
    studentsCount: 120,
    pendingGrades: 18,
    lowAttendanceStudents: 4,
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      <ScrollView className="px-6 py-4" showsVerticalScrollIndicator={false}>
        {/* Welcome Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text style={{ color: colors.textMuted }} className="text-sm font-semibold tracking-wide uppercase">
              Welcome Back
            </Text>
            <Text style={{ color: colors.text }} className="text-2xl font-extrabold tracking-tight mt-0.5">
              {user?.name || 'Dr. Sarah Connor'}
            </Text>
            <Text style={{ color: colors.primary }} className="text-xs font-bold mt-1">
              Associate Professor • Computer Science
            </Text>
          </View>
          <View 
            style={{ backgroundColor: colors.primaryLight }}
            className="w-12 h-12 rounded-2xl items-center justify-center"
          >
            <Text style={{ color: colors.primary }} className="text-lg font-bold">
              {user?.name.charAt(0) || 'F'}
            </Text>
          </View>
        </View>

        {/* Dynamic Alerts Banner */}
        {stats.pendingGrades > 0 && (
          <TouchableOpacity
            onPress={() => navigation.navigate('ManageAssignments')}
            style={{ backgroundColor: colors.primary }}
            className="p-5 rounded-3xl mb-6 shadow-lg shadow-sky-500/20 flex-row justify-between items-center"
          >
            <View className="flex-1 mr-4">
              <View className="flex-row items-center bg-white/20 px-2.5 py-0.5 rounded-full self-start mb-2">
                <AlertCircle size={12} color="#ffffff" className="mr-1" />
                <Text className="text-white text-xs font-bold uppercase tracking-wider">Action Needed</Text>
              </View>
              <Text className="text-white text-xl font-extrabold tracking-tight">Pending Submissions</Text>
              <Text className="text-white/80 text-xs mt-1 font-medium leading-4">
                You have {stats.pendingGrades} student submissions waiting for grading across 2 assignments.
              </Text>
            </View>
            <View className="bg-white/20 p-3.5 rounded-2xl">
              <Clipboard size={28} color="#ffffff" />
            </View>
          </TouchableOpacity>
        )}

        {/* Metrics Grid */}
        <Text style={{ color: colors.text }} className="text-base font-extrabold mb-3">
          Overview
        </Text>
        <View className="flex-row flex-wrap justify-between mb-6">
          {/* Assigned Classes */}
          <View 
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="w-[48%] p-4 rounded-3xl border shadow-sm mb-4"
          >
            <View style={{ backgroundColor: colors.primary + '15' }} className="p-2.5 rounded-xl self-start mb-3">
              <BookOpen size={20} color={colors.primary} />
            </View>
            <Text style={{ color: colors.textMuted }} className="text-xs font-bold">Assigned Courses</Text>
            <Text style={{ color: colors.text }} className="text-2xl font-black mt-1">{stats.classesCount}</Text>
          </View>

          {/* Students Counter */}
          <View 
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="w-[48%] p-4 rounded-3xl border shadow-sm mb-4"
          >
            <View style={{ backgroundColor: colors.success + '15' }} className="p-2.5 rounded-xl self-start mb-3">
              <Users size={20} color={colors.success} />
            </View>
            <Text style={{ color: colors.textMuted }} className="text-xs font-bold">Total Students</Text>
            <Text style={{ color: colors.text }} className="text-2xl font-black mt-1">{stats.studentsCount}</Text>
          </View>

          {/* Attendance Alerts */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('StudentMonitoring')}
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="w-[48%] p-4 rounded-3xl border shadow-sm"
          >
            <View style={{ backgroundColor: colors.notification + '15' }} className="p-2.5 rounded-xl self-start mb-3">
              <AlertCircle size={20} color={colors.notification} />
            </View>
            <Text style={{ color: colors.textMuted }} className="text-xs font-bold">Low Attendance</Text>
            <Text style={{ color: colors.text }} className="text-2xl font-black mt-1">{stats.lowAttendanceStudents}</Text>
            <Text style={{ color: colors.notification }} className="text-xs font-semibold mt-1">Alerts triggered</Text>
          </TouchableOpacity>

          {/* Marks Analytics */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('AddMarks')}
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="w-[48%] p-4 rounded-3xl border shadow-sm"
          >
            <View style={{ backgroundColor: colors.warning + '15' }} className="p-2.5 rounded-xl self-start mb-3">
              <Award size={20} color={colors.warning} />
            </View>
            <Text style={{ color: colors.textMuted }} className="text-xs font-bold">Internal Marks</Text>
            <Text style={{ color: colors.text }} className="text-2xl font-black mt-1">Term 1</Text>
            <Text style={{ color: colors.warning }} className="text-xs font-semibold mt-1">Manage Marks</Text>
          </TouchableOpacity>
        </View>

        {/* Schedule */}
        <Text style={{ color: colors.text }} className="text-base font-extrabold mb-3">
          Today's Schedule
        </Text>
        <View 
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          className="border rounded-3xl p-5 mb-8 shadow-sm"
        >
          {assignedClasses.map((lecture, index) => (
            <View 
              key={lecture.id}
              className={`flex-row justify-between items-center ${index !== assignedClasses.length - 1 ? 'border-b pb-4 mb-4' : ''}`}
              style={{ borderBottomColor: colors.border }}
            >
              <View className="flex-1 mr-3">
                <Text style={{ color: colors.text }} className="text-sm font-extrabold leading-5">
                  {lecture.name}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Clock size={12} color={colors.textMuted} className="mr-1" />
                  <Text style={{ color: colors.textMuted }} className="text-xs font-semibold">
                    {lecture.time}
                  </Text>
                </View>
                <Text style={{ color: colors.textMuted }} className="text-xs mt-1">
                  Room: {lecture.room}
                </Text>
              </View>

              <TouchableOpacity 
                onPress={() => navigation.navigate('MarkAttendance')}
                style={{ backgroundColor: colors.primaryLight }}
                className="px-3.5 py-1.5 rounded-xl"
              >
                <Text style={{ color: colors.primary }} className="text-xs font-bold">Roll Call</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FacultyDashboard;
