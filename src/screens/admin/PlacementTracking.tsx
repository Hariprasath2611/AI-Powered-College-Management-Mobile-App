import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch } from '../../redux/hooks';
import { showToast } from '../../redux/slices/uiSlice';
import { Briefcase, Plus, Building2, MapPin, Calendar, Users, BarChart3 } from 'lucide-react-native';

export const PlacementTracking: React.FC = () => {
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<'overview' | 'create'>('overview');

  // Form State
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [pkg, setPkg] = useState('');
  const [location, setLocation] = useState('Bengaluru');
  const [creating, setCreating] = useState(false);

  const [drives, setDrives] = useState([
    { id: '1', company: 'Google', role: 'Associate Software Engineer', package: '28.5 LPA', applicants: 120, location: 'Bengaluru' },
    { id: '2', company: 'Amazon', role: 'Software Engineer Intern', package: '18.0 LPA', applicants: 85, location: 'Chennai' },
    { id: '3', company: 'Microsoft', role: 'Data Scientist', package: '24.0 LPA', applicants: 64, location: 'Hyderabad' },
  ]);

  const handleCreateDrive = async () => {
    if (!company.trim() || !role.trim() || !pkg.trim()) {
      dispatch(showToast({ message: 'All fields are required', type: 'warning' }));
      return;
    }
    setCreating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setCreating(false);

    const newDrive = {
      id: Date.now().toString(),
      company,
      role,
      package: pkg.includes('LPA') ? pkg : `${pkg} LPA`,
      applicants: 0,
      location,
    };

    setDrives([newDrive, ...drives]);
    dispatch(showToast({ message: `Placement drive for ${company} published!`, type: 'success' }));
    setCompany('');
    setRole('');
    setPkg('');
    setActiveTab('overview');
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      {/* Tabs */}
      <View className="flex-row bg-slate-200 dark:bg-slate-800 p-1.5 rounded-2xl mx-6 mt-4 mb-6">
        <TouchableOpacity
          onPress={() => setActiveTab('overview')}
          style={{ backgroundColor: activeTab === 'overview' ? colors.card : 'transparent' }}
          className="flex-1 py-3 rounded-xl items-center"
        >
          <Text style={{ color: activeTab === 'overview' ? colors.primary : colors.textMuted }} className="text-sm font-bold">
            Job Drives
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('create')}
          style={{ backgroundColor: activeTab === 'create' ? colors.card : 'transparent' }}
          className="flex-1 py-3 rounded-xl items-center"
        >
          <Text style={{ color: activeTab === 'create' ? colors.primary : colors.textMuted }} className="text-sm font-bold">
            New Drive
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="px-6 pb-6" showsVerticalScrollIndicator={false}>
        {/* OVERVIEW PANEL */}
        {activeTab === 'overview' ? (
          drives.map((drive) => (
            <View
              key={drive.id}
              style={{ backgroundColor: colors.card, borderColor: colors.border }}
              className="p-5 rounded-3xl border shadow-sm mb-4"
            >
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-row items-center flex-1">
                  <View style={{ backgroundColor: colors.primaryLight }} className="p-2.5 rounded-2xl mr-3.5">
                    <Building2 size={24} color={colors.primary} />
                  </View>
                  <View className="flex-1">
                    <Text style={{ color: colors.text }} className="text-base font-extrabold leading-5">
                      {drive.company}
                    </Text>
                    <Text style={{ color: colors.textMuted }} className="text-xs font-semibold mt-0.5">
                      {drive.role}
                    </Text>
                  </View>
                </View>
                <View style={{ backgroundColor: colors.success + '15' }} className="px-2.5 py-1 rounded-lg">
                  <Text style={{ color: colors.success }} className="text-xs font-bold">{drive.package}</Text>
                </View>
              </View>

              {/* Extra parameters */}
              <View className="flex-row justify-between items-center mt-3 pt-3 border-t" style={{ borderTopColor: colors.border }}>
                <View className="flex-row items-center">
                  <MapPin size={12} color={colors.textMuted} className="mr-1" />
                  <Text style={{ color: colors.textMuted }} className="text-xs font-medium">{drive.location}</Text>
                </View>

                <View className="flex-row items-center">
                  <Users size={12} color={colors.primary} className="mr-1" />
                  <Text style={{ color: colors.primary }} className="text-xs font-bold">{drive.applicants} Applied</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          /* CREATE DRIVE FORM */
          <View 
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="p-5 rounded-3xl border shadow-sm"
          >
            <Text style={{ color: colors.text }} className="text-sm font-bold mb-2 ml-1">Company Name</Text>
            <TextInput
              placeholder="e.g. Google India"
              placeholderTextColor={colors.textMuted}
              value={company}
              onChangeText={setCompany}
              style={{ color: colors.text, backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }}
              className="rounded-2xl px-4 py-3 mb-4 text-base font-semibold"
            />

            <Text style={{ color: colors.text }} className="text-sm font-bold mb-2 ml-1">Job Role</Text>
            <TextInput
              placeholder="e.g. Associate Software Engineer"
              placeholderTextColor={colors.textMuted}
              value={role}
              onChangeText={setRole}
              style={{ color: colors.text, backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }}
              className="rounded-2xl px-4 py-3 mb-4 text-base font-semibold"
            />

            <View className="flex-row justify-between mb-6">
              <View className="w-[48%]">
                <Text style={{ color: colors.text }} className="text-sm font-bold mb-2 ml-1">CTC Package (LPA)</Text>
                <TextInput
                  placeholder="e.g. 18.5"
                  placeholderTextColor={colors.textMuted}
                  value={pkg}
                  onChangeText={setPkg}
                  style={{ color: colors.text, backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }}
                  className="rounded-2xl px-4 py-3 text-base font-semibold"
                />
              </View>
              <View className="w-[48%]">
                <Text style={{ color: colors.text }} className="text-sm font-bold mb-2 ml-1">Job Location</Text>
                <TextInput
                  placeholder="e.g. Bengaluru"
                  placeholderTextColor={colors.textMuted}
                  value={location}
                  onChangeText={setLocation}
                  style={{ color: colors.text, backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }}
                  className="rounded-2xl px-4 py-3 text-base font-semibold"
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleCreateDrive}
              disabled={creating}
              style={{ backgroundColor: colors.primary }}
              className="w-full py-4 rounded-2xl items-center justify-center flex-row shadow-md"
            >
              {creating ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Plus size={18} color="#ffffff" className="mr-1.5" />
                  <Text className="text-white text-base font-bold">Publish Placement Drive</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PlacementTracking;
