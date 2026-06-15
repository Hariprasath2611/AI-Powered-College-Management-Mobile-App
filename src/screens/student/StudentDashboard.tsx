import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAppSelector } from '../../redux/hooks';
import { Calendar, CheckSquare, Award, Briefcase, ChevronRight, Sparkles, BookOpen } from 'lucide-react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StudentTabParamList } from '../../types/navigation';

type StudentDashboardNavigationProp = BottomTabNavigationProp<StudentTabParamList, 'StudentDashboard'>;

interface Props {
  navigation: StudentDashboardNavigationProp;
}

export const StudentDashboard: React.FC<Props> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const user = useAppSelector((state) => state.auth.user);

  // Hardcoded dashboard details representing current semester stats
  const academicStats = {
    attendance: '84.2%',
    pendingAssignments: 3,
    gpa: '8.82',
    appliedJobs: 4
  };

  const upcomingEvents = [
    { id: '1', title: 'AI Hackathon 2026', date: 'June 20, 10:00 AM', venue: 'Auditorium 2' },
    { id: '2', title: 'Placement Drive: Google', date: 'June 25, 09:00 AM', venue: 'Placement Cell' },
  ];

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
              {user?.name || 'Student User'}
            </Text>
            <Text style={{ color: colors.primary }} className="text-xs font-bold mt-1">
              CSE Department • Semester {user?.semester || 6}
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => navigation.navigate('StudentProfile')}
            style={{ backgroundColor: colors.primaryLight }}
            className="w-12 h-12 rounded-2xl items-center justify-center"
          >
            <Text style={{ color: colors.primary }} className="text-lg font-bold">
              {user?.name.charAt(0) || 'S'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* AI Career Guide Banner */}
        <TouchableOpacity
          onPress={() => navigation.navigate('StudentAITools')}
          style={{ backgroundColor: colors.primary }}
          className="p-5 rounded-3xl mb-6 shadow-lg shadow-sky-500/20 flex-row justify-between items-center overflow-hidden"
        >
          <View className="flex-1 mr-4">
            <View className="flex-row items-center bg-white/20 px-2.5 py-0.5 rounded-full self-start mb-2">
              <Sparkles size={12} color="#ffffff" className="mr-1" />
              <Text className="text-white text-xs font-bold uppercase tracking-wider">AI Feature</Text>
            </View>
            <Text className="text-white text-xl font-extrabold tracking-tight">Resume ATS Analyzer</Text>
            <Text className="text-white/80 text-xs mt-1 font-medium leading-4">
              Upload your resume and get immediate feedback, score analytics, and interview practice questions.
            </Text>
          </View>
          <View className="bg-white/20 p-3.5 rounded-2xl">
            <Sparkles size={28} color="#ffffff" />
          </View>
        </TouchableOpacity>

        {/* Academic Analytics Grid */}
        <Text style={{ color: colors.text }} className="text-base font-extrabold mb-3">
          At a Glance
        </Text>
        <View className="flex-row flex-wrap justify-between mb-6">
          {/* Attendance Card */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('StudentAttendance')}
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="w-[48%] p-4 rounded-3xl border shadow-sm mb-4"
          >
            <View style={{ backgroundColor: colors.success + '15' }} className="p-2.5 rounded-xl self-start mb-3">
              <CheckSquare size={20} color={colors.success} />
            </View>
            <Text style={{ color: colors.textMuted }} className="text-xs font-bold">Attendance</Text>
            <Text style={{ color: colors.text }} className="text-2xl font-black mt-1">{academicStats.attendance}</Text>
            <Text style={{ color: colors.success }} className="text-xs font-semibold mt-1">Above Limit (75%)</Text>
          </TouchableOpacity>

          {/* GPA Card */}
          <View 
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="w-[48%] p-4 rounded-3xl border shadow-sm mb-4"
          >
            <View style={{ backgroundColor: colors.warning + '15' }} className="p-2.5 rounded-xl self-start mb-3">
              <Award size={20} color={colors.warning} />
            </View>
            <Text style={{ color: colors.textMuted }} className="text-xs font-bold">Current CGPA</Text>
            <Text style={{ color: colors.text }} className="text-2xl font-black mt-1">{academicStats.gpa}</Text>
            <Text style={{ color: colors.textMuted }} className="text-xs font-medium mt-1">Class Rank: 4th</Text>
          </View>

          {/* Assignments Card */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('StudentAssignments')}
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="w-[48%] p-4 rounded-3xl border shadow-sm"
          >
            <View style={{ backgroundColor: colors.info + '15' }} className="p-2.5 rounded-xl self-start mb-3">
              <BookOpen size={20} color={colors.info} />
            </View>
            <Text style={{ color: colors.textMuted }} className="text-xs font-bold">Pending Tasks</Text>
            <Text style={{ color: colors.text }} className="text-2xl font-black mt-1">{academicStats.pendingAssignments}</Text>
            <Text style={{ color: colors.info }} className="text-xs font-semibold mt-1">Due this week</Text>
          </TouchableOpacity>

          {/* Placements Card */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('StudentPlacement')}
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="w-[48%] p-4 rounded-3xl border shadow-sm"
          >
            <View style={{ backgroundColor: colors.primary + '15' }} className="p-2.5 rounded-xl self-start mb-3">
              <Briefcase size={20} color={colors.primary} />
            </View>
            <Text style={{ color: colors.textMuted }} className="text-xs font-bold">Applied Drives</Text>
            <Text style={{ color: colors.text }} className="text-2xl font-black mt-1">{academicStats.appliedJobs}</Text>
            <Text style={{ color: colors.primary }} className="text-xs font-semibold mt-1">2 Interviews scheduled</Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Events */}
        <View className="flex-row justify-between items-center mb-3">
          <Text style={{ color: colors.text }} className="text-base font-extrabold">
            Campus Events
          </Text>
        </View>
        <View 
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          className="border rounded-3xl p-5 mb-8 shadow-sm"
        >
          {upcomingEvents.map((event, index) => (
            <View 
              key={event.id}
              className={`flex-row justify-between items-center ${index !== upcomingEvents.length - 1 ? 'border-b pb-4 mb-4' : ''}`}
              style={{ borderBottomColor: colors.border }}
            >
              <View className="flex-1 mr-3">
                <Text style={{ color: colors.text }} className="text-sm font-extrabold leading-5">
                  {event.title}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Calendar size={12} color={colors.textMuted} className="mr-1" />
                  <Text style={{ color: colors.textMuted }} className="text-xs">
                    {event.date} • {event.venue}
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={{ backgroundColor: colors.primaryLight }}
                className="px-3.5 py-1.5 rounded-xl"
              >
                <Text style={{ color: colors.primary }} className="text-xs font-bold">Pass</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentDashboard;
