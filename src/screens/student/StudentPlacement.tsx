import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch } from '../../redux/hooks';
import { showToast } from '../../redux/slices/uiSlice';
import { Briefcase, Calendar, Award, Building2, MapPin, CheckCircle, ArrowRight } from 'lucide-react-native';

export const StudentPlacement: React.FC = () => {
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<'drives' | 'interviews'>('drives');

  const placementStats = {
    highestPackage: '45.0 LPA',
    averagePackage: '8.4 LPA',
    placementRate: '94.2%',
  };

  const jobDrives = [
    { id: '1', company: 'Google', role: 'Associate Software Engineer', location: 'Bengaluru / Hybrid', package: '28.5 LPA', deadline: 'June 25, 2026', status: 'open' },
    { id: '2', company: 'Amazon', role: 'Software Development Engineer Intern', location: 'Chennai / Onsite', package: '18.0 LPA', deadline: 'June 20, 2026', status: 'applied' },
    { id: '3', company: 'Salesforce', role: 'System Engineer', location: 'Hyderabad', package: '14.2 LPA', deadline: 'June 19, 2026', status: 'open' },
  ];

  const interviews = [
    { id: '101', company: 'Amazon', round: 'Technical Round 1 (Coding)', date: 'June 18, 2026', time: '11:00 AM - 12:00 PM', link: 'https://meet.google.com/abc-def-ghi' },
  ];

  const handleApply = (company: string) => {
    dispatch(showToast({ message: `Application submitted to ${company}!`, type: 'success' }));
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      <ScrollView className="px-6 py-4" showsVerticalScrollIndicator={false}>
        {/* Placement Metrics Banner */}
        <View 
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          className="p-5 rounded-3xl border shadow-sm mb-6 flex-row justify-between items-center"
        >
          <View className="items-center flex-1 border-r" style={{ borderRightColor: colors.border }}>
            <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold uppercase">Highest</Text>
            <Text style={{ color: colors.text }} className="text-lg font-black mt-1">{placementStats.highestPackage}</Text>
          </View>
          <View className="items-center flex-1 border-r" style={{ borderRightColor: colors.border }}>
            <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold uppercase">Average</Text>
            <Text style={{ color: colors.text }} className="text-lg font-black mt-1">{placementStats.averagePackage}</Text>
          </View>
          <View className="items-center flex-1">
            <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold uppercase">Placed Rate</Text>
            <Text style={{ color: colors.text }} className="text-lg font-black mt-1">{placementStats.placementRate}</Text>
          </View>
        </View>

        {/* Tab Selection */}
        <View className="flex-row bg-slate-200 dark:bg-slate-800 p-1.5 rounded-2xl mb-6">
          <TouchableOpacity
            onPress={() => setActiveTab('drives')}
            style={{ backgroundColor: activeTab === 'drives' ? colors.card : 'transparent' }}
            className="flex-1 py-3 rounded-xl items-center"
          >
            <Text 
              style={{ color: activeTab === 'drives' ? colors.primary : colors.textMuted }}
              className="text-sm font-bold"
            >
              Active Drives
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('interviews')}
            style={{ backgroundColor: activeTab === 'interviews' ? colors.card : 'transparent' }}
            className="flex-1 py-3 rounded-xl items-center"
          >
            <Text 
              style={{ color: activeTab === 'interviews' ? colors.primary : colors.textMuted }}
              className="text-sm font-bold"
            >
              Interviews ({interviews.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Lists */}
        {activeTab === 'drives' ? (
          jobDrives.map((drive) => (
            <View
              key={drive.id}
              style={{ backgroundColor: colors.card, borderColor: colors.border }}
              className="p-5 rounded-3xl border shadow-sm mb-4"
            >
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-row items-center flex-1">
                  <View style={{ backgroundColor: colors.primaryLight }} className="p-2.5 rounded-2xl mr-3.5">
                    <Building2 size={24} color={colors.primary} />
                  </View>
                  <View className="flex-1">
                    <Text style={{ color: colors.text }} className="text-base font-extrabold leading-5">
                      {drive.company}
                    </Text>
                    <Text style={{ color: colors.textMuted }} className="text-xs font-semibold">
                      {drive.role}
                    </Text>
                  </View>
                </View>
                <View style={{ backgroundColor: colors.primary + '15' }} className="px-2.5 py-1 rounded-lg">
                  <Text style={{ color: colors.primary }} className="text-xs font-bold">{drive.package}</Text>
                </View>
              </View>

              {/* Extra Details */}
              <View className="mt-3 flex-row items-center">
                <MapPin size={12} color={colors.textMuted} className="mr-1" />
                <Text style={{ color: colors.textMuted }} className="text-xs font-medium mr-4">{drive.location}</Text>

                <Calendar size={12} color={colors.textMuted} className="mr-1" />
                <Text style={{ color: colors.textMuted }} className="text-xs font-medium">Apply by: {drive.deadline}</Text>
              </View>

              {/* Submit Buttons */}
              <View className="border-t mt-4 pt-4" style={{ borderTopColor: colors.border }}>
                {drive.status === 'applied' ? (
                  <View className="flex-row items-center justify-center py-2.5 bg-emerald-500/10 rounded-xl">
                    <CheckCircle size={16} color={colors.success} className="mr-1.5" />
                    <Text style={{ color: colors.success }} className="text-xs font-bold">Applied Successfully</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleApply(drive.company)}
                    style={{ backgroundColor: colors.primary }}
                    className="flex-row items-center justify-center py-2.5 rounded-xl"
                  >
                    <Text className="text-white text-xs font-bold mr-1">Apply Now</Text>
                    <ArrowRight size={14} color="#ffffff" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        ) : (
          interviews.length > 0 ? (
            interviews.map((int) => (
              <View
                key={int.id}
                style={{ backgroundColor: colors.card, borderColor: colors.border }}
                className="p-5 rounded-3xl border shadow-sm mb-4"
              >
                <View className="flex-row items-start mb-2">
                  <View className="p-2.5 bg-amber-500/10 rounded-2xl mr-3.5">
                    <Calendar size={24} color="#f59e0b" />
                  </View>
                  <View className="flex-1">
                    <Text style={{ color: colors.text }} className="text-base font-extrabold">
                      {int.company} Recruitment
                    </Text>
                    <Text style={{ color: colors.primary }} className="text-xs font-bold mt-0.5">
                      {int.round}
                    </Text>
                  </View>
                </View>

                <View className="bg-slate-100 dark:bg-slate-800/80 p-3 rounded-2xl mt-2 mb-4">
                  <Text style={{ color: colors.text }} className="text-xs font-bold">
                    Schedule: {int.date}
                  </Text>
                  <Text style={{ color: colors.textMuted }} className="text-xs font-medium mt-1">
                    Time: {int.time}
                  </Text>
                </View>

                <TouchableOpacity 
                  style={{ backgroundColor: colors.primary }}
                  className="w-full py-2.5 rounded-xl items-center justify-center"
                >
                  <Text className="text-white text-xs font-bold">Join Interview Room</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View className="items-center justify-center py-12">
              <Text style={{ color: colors.textMuted }} className="text-sm font-semibold">No interviews scheduled at this moment.</Text>
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentPlacement;
