import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch } from '../../redux/hooks';
import { showToast } from '../../redux/slices/uiSlice';
import { AlertCircle, Bell, ArrowRight, UserCheck, Search } from 'lucide-react-native';

export const StudentMonitoring: React.FC = () => {
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const [notifyingId, setNotifyingId] = useState<string | null>(null);

  const atRiskStudents = [
    { id: '1', name: 'Bruce Wayne', rollNo: 'CSE-003', attendance: '68.5%', gpa: '6.20', issue: 'Low Attendance & Midterm warning' },
    { id: '2', name: 'Peter Parker', rollNo: 'CSE-004', attendance: '72.0%', gpa: '7.80', issue: 'Attendance under mandatory limit' },
    { id: '3', name: 'Barry Allen', rollNo: 'CSE-008', attendance: '62.4%', gpa: '5.90', issue: 'Critical Attendance shortage' },
  ];

  const handleNotify = async (studentId: string, studentName: string) => {
    setNotifyingId(studentId);
    // Simulate push alert delivery
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setNotifyingId(null);
    dispatch(showToast({ message: `Push Alert notification sent to ${studentName}!`, type: 'success' }));
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      <View className="px-6 py-4 border-b" style={{ borderBottomColor: colors.border }}>
        <Text style={{ color: colors.text }} className="text-lg font-extrabold mb-1">
          Student Performance Monitoring
        </Text>
        <Text style={{ color: colors.textMuted }} className="text-xs">
          Identify and notify students falling below academic guidelines.
        </Text>
      </View>

      <ScrollView className="px-6 py-4 flex-1" showsVerticalScrollIndicator={false}>
        <Text style={{ color: colors.text }} className="text-base font-extrabold mb-4">
          At-Risk Students ({atRiskStudents.length})
        </Text>

        {atRiskStudents.map((stu) => (
          <View
            key={stu.id}
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="p-5 rounded-3xl border shadow-sm mb-4"
          >
            <View className="flex-row justify-between items-start mb-3">
              <View>
                <Text style={{ color: colors.text }} className="text-base font-extrabold">{stu.name}</Text>
                <Text style={{ color: colors.textMuted }} className="text-xs font-semibold mt-0.5">{stu.rollNo}</Text>
              </View>
              <View className="flex-row">
                <View className="bg-rose-500/10 px-2.5 py-1 rounded-lg mr-2">
                  <Text className="text-rose-500 text-xs font-bold">Att: {stu.attendance}</Text>
                </View>
                <View className="bg-amber-500/10 px-2.5 py-1 rounded-lg">
                  <Text className="text-amber-600 text-xs font-bold">GPA: {stu.gpa}</Text>
                </View>
              </View>
            </View>

            <View className="flex-row items-center bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl mb-4">
              <AlertCircle size={16} color="#ef4444" className="mr-2" />
              <Text style={{ color: colors.text }} className="text-xs font-medium flex-1">
                {stu.issue}
              </Text>
            </View>

            {/* Quick push notification action */}
            <TouchableOpacity
              onPress={() => handleNotify(stu.id, stu.name)}
              disabled={notifyingId === stu.id}
              style={{ backgroundColor: colors.primary }}
              className="w-full py-3 rounded-xl flex-row items-center justify-center shadow-sm"
            >
              {notifyingId === stu.id ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Bell size={16} color="#ffffff" className="mr-1.5" />
                  <Text className="text-white text-xs font-bold">Send Warning Alert</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentMonitoring;
