import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { CheckCircle2, AlertTriangle, XCircle, Calendar, BookOpen } from 'lucide-react-native';

export const StudentAttendance: React.FC = () => {
  const { colors, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'subjects' | 'history'>('subjects');

  // Hardcoded student attendance metrics
  const overallAttendance = 83.5;
  const totalClasses = 240;
  const attendedClasses = 200;

  const subjectAttendance = [
    { id: '1', name: 'Software Engineering', code: 'CS601', attended: 42, total: 48, percentage: 87.5 },
    { id: '2', name: 'Compiler Design', code: 'CS602', attended: 38, total: 45, percentage: 84.4 },
    { id: '3', name: 'Artificial Intelligence', code: 'CS603', attended: 32, total: 45, percentage: 71.1 }, // Warning
    { id: '4', name: 'Computer Networks', code: 'CS604', attended: 48, total: 52, percentage: 92.3 },
    { id: '5', name: 'Data Warehousing', code: 'CS605', attended: 40, total: 50, percentage: 80.0 },
  ];

  const recentAbsences = [
    { id: '1', subject: 'Artificial Intelligence', date: 'June 12, 2026', slot: '10:30 AM - 11:30 AM', reason: 'Medical Leave' },
    { id: '2', subject: 'Compiler Design', date: 'June 08, 2026', slot: '09:00 AM - 10:00 AM', reason: 'Unexcused absence' },
  ];

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      <ScrollView className="px-6 py-4" showsVerticalScrollIndicator={false}>
        {/* Overall Progress Panel */}
        <View 
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          className="p-6 rounded-3xl border shadow-sm mb-6 items-center"
        >
          <Text style={{ color: colors.textMuted }} className="text-xs font-bold uppercase tracking-wider mb-2">
            Overall Attendance
          </Text>
          <Text style={{ color: colors.text }} className="text-4xl font-black mb-1">
            {overallAttendance}%
          </Text>
          <Text style={{ color: colors.textMuted }} className="text-sm text-center mb-4 font-medium">
            Attended {attendedClasses} out of {totalClasses} sessions
          </Text>

          {/* Quick status progress line */}
          <View style={{ backgroundColor: colors.border }} className="w-full h-3.5 rounded-full overflow-hidden mb-2">
            <View 
              style={{ 
                backgroundColor: overallAttendance >= 75 ? colors.success : colors.notification,
                width: `${overallAttendance}%` 
              }}
              className="h-full rounded-full"
            />
          </View>
          <View className="flex-row justify-between w-full mt-1.5">
            <Text style={{ color: colors.textMuted }} className="text-xs font-semibold">Min required: 75%</Text>
            <Text style={{ color: colors.success }} className="text-xs font-bold">Status: Safe</Text>
          </View>
        </View>

        {/* Tab Buttons */}
        <View className="flex-row bg-slate-200 dark:bg-slate-800 p-1.5 rounded-2xl mb-6">
          <TouchableOpacity
            onPress={() => setActiveTab('subjects')}
            style={{ backgroundColor: activeTab === 'subjects' ? colors.card : 'transparent' }}
            className="flex-1 py-3 rounded-xl items-center"
          >
            <Text 
              style={{ color: activeTab === 'subjects' ? colors.primary : colors.textMuted }}
              className="text-sm font-bold"
            >
              Course Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('history')}
            style={{ backgroundColor: activeTab === 'history' ? colors.card : 'transparent' }}
            className="flex-1 py-3 rounded-xl items-center"
          >
            <Text 
              style={{ color: activeTab === 'history' ? colors.primary : colors.textMuted }}
              className="text-sm font-bold"
            >
              Absence Log
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Tabs */}
        {activeTab === 'subjects' ? (
          <View className="mb-6">
            {subjectAttendance.map((sub) => {
              const isBelowCutoff = sub.percentage < 75;
              return (
                <View
                  key={sub.id}
                  style={{ backgroundColor: colors.card, borderColor: colors.border }}
                  className="p-5 rounded-3xl border shadow-sm mb-4"
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1 mr-2">
                      <Text style={{ color: colors.text }} className="text-base font-extrabold leading-5">
                        {sub.name}
                      </Text>
                      <Text style={{ color: colors.textMuted }} className="text-xs mt-0.5 font-bold uppercase">
                        {sub.code} • {sub.attended}/{sub.total} Classes
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text 
                        style={{ color: isBelowCutoff ? colors.notification : colors.text }}
                        className="text-xl font-black"
                      >
                        {sub.percentage}%
                      </Text>
                      {isBelowCutoff ? (
                        <View className="flex-row items-center mt-1 bg-red-500/10 px-2 py-0.5 rounded-md">
                          <AlertTriangle size={10} color={colors.notification} className="mr-1" />
                          <Text style={{ color: colors.notification }} className="text-[10px] font-bold">Warning</Text>
                        </View>
                      ) : (
                        <View className="flex-row items-center mt-1 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                          <CheckCircle2 size={10} color={colors.success} className="mr-1" />
                          <Text style={{ color: colors.success }} className="text-[10px] font-bold">Attending</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Micro Progress Bar */}
                  <View style={{ backgroundColor: colors.border }} className="w-full h-2 rounded-full overflow-hidden mt-3">
                    <View 
                      style={{ 
                        backgroundColor: isBelowCutoff ? colors.notification : colors.success,
                        width: `${sub.percentage}%` 
                      }}
                      className="h-full rounded-full"
                    />
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View className="mb-6">
            {recentAbsences.length > 0 ? (
              recentAbsences.map((abs) => (
                <View
                  key={abs.id}
                  style={{ backgroundColor: colors.card, borderColor: colors.border }}
                  className="p-5 rounded-3xl border shadow-sm mb-4 flex-row items-start"
                >
                  <View style={{ backgroundColor: colors.notification + '15' }} className="p-2.5 rounded-2xl mr-4 items-center justify-center">
                    <XCircle size={24} color={colors.notification} />
                  </View>
                  <View className="flex-1">
                    <Text style={{ color: colors.text }} className="text-base font-extrabold leading-5">
                      {abs.subject}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <Calendar size={12} color={colors.textMuted} className="mr-1.5" />
                      <Text style={{ color: colors.textMuted }} className="text-xs font-semibold">
                        {abs.date} • {abs.slot}
                      </Text>
                    </View>
                    <Text style={{ color: colors.textMuted }} className="text-xs italic mt-2">
                      Reason: {abs.reason}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View className="items-center justify-center py-12">
                <Text style={{ color: colors.textMuted }} className="text-sm font-semibold">No absences recorded. Great job!</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentAttendance;
