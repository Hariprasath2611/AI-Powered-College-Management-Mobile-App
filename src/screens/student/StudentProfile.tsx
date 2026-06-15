import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '../../context/ThemeContext';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { updateUser } from '../../redux/slices/authSlice';
import { showToast } from '../../redux/slices/uiSlice';
import { User, Phone, Book, GraduationCap, Edit3, Save, FileText, UploadCloud } from 'lucide-react-native';

export const StudentProfile: React.FC = () => {
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState('9876543210');
  const [bio, setBio] = useState('Computer Science sophomore passionate about web development, open-source and machine learning pipelines.');
  const [resumeName, setResumeName] = useState<string | null>('alex_mercer_resume.pdf');
  const [uploadingResume, setUploadingResume] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    dispatch(showToast({ message: 'Profile updated successfully!', type: 'success' }));
  };

  const handleResumePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (result.canceled) return;
      const file = result.assets[0];
      setUploadingResume(true);

      // Simulate API upload
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setResumeName(file.name);
      dispatch(showToast({ message: 'Resume uploaded successfully!', type: 'success' }));
    } catch (e) {
      dispatch(showToast({ message: 'Failed to select resume', type: 'error' }));
    } finally {
      setUploadingResume(false);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      <ScrollView className="px-6 py-4" showsVerticalScrollIndicator={false}>
        {/* Profile Card Header */}
        <View className="items-center my-6">
          <View 
            style={{ backgroundColor: colors.primaryLight }}
            className="w-24 h-24 rounded-full items-center justify-center mb-4 border-2 shadow-sm"
          >
            <Text style={{ color: colors.primary }} className="text-3xl font-bold">
              {user?.name.charAt(0) || 'S'}
            </Text>
          </View>
          <Text style={{ color: colors.text }} className="text-xl font-extrabold">{user?.name}</Text>
          <Text style={{ color: colors.textMuted }} className="text-sm">{user?.email}</Text>
        </View>

        {/* Academic Card */}
        <View 
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          className="p-5 rounded-3xl border shadow-sm mb-6"
        >
          <Text style={{ color: colors.text }} className="text-sm font-extrabold mb-4">University Details</Text>
          
          <View className="flex-row items-center mb-4">
            <Book size={18} color={colors.textMuted} className="mr-3" />
            <View className="flex-1">
              <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold uppercase">Department</Text>
              <Text style={{ color: colors.text }} className="text-sm font-semibold">{user?.department || 'Computer Science'}</Text>
            </View>
          </View>

          <View className="flex-row items-center mb-4">
            <GraduationCap size={18} color={colors.textMuted} className="mr-3" />
            <View className="flex-1">
              <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold uppercase">Enrollment No.</Text>
              <Text style={{ color: colors.text }} className="text-sm font-semibold">CS2023-90812</Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <User size={18} color={colors.textMuted} className="mr-3" />
            <View className="flex-1">
              <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold uppercase">Semester</Text>
              <Text style={{ color: colors.text }} className="text-sm font-semibold">Semester {user?.semester || 6}</Text>
            </View>
          </View>
        </View>

        {/* Contact Details Card */}
        <View 
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          className="p-5 rounded-3xl border shadow-sm mb-6"
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text style={{ color: colors.text }} className="text-sm font-extrabold">Contact Info</Text>
            <TouchableOpacity onPress={() => isEditing ? handleSave() : setIsEditing(true)}>
              {isEditing ? (
                <View className="flex-row items-center">
                  <Save size={16} color={colors.primary} className="mr-1" />
                  <Text style={{ color: colors.primary }} className="text-xs font-bold">Save</Text>
                </View>
              ) : (
                <View className="flex-row items-center">
                  <Edit3 size={16} color={colors.primary} className="mr-1" />
                  <Text style={{ color: colors.primary }} className="text-xs font-bold">Edit</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Phone Field */}
          <View className="flex-row items-center mb-4">
            <Phone size={18} color={colors.textMuted} className="mr-3" />
            <View className="flex-1">
              <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold uppercase">Phone Number</Text>
              {isEditing ? (
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  style={{ color: colors.text, borderBottomColor: colors.primary }}
                  className="text-sm font-semibold border-b py-0.5"
                />
              ) : (
                <Text style={{ color: colors.text }} className="text-sm font-semibold">{phone}</Text>
              )}
            </View>
          </View>

          {/* Bio Field */}
          <View className="flex-row items-start">
            <User size={18} color={colors.textMuted} className="mr-3 mt-1" />
            <View className="flex-1">
              <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold uppercase">Biography</Text>
              {isEditing ? (
                <TextInput
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  numberOfLines={3}
                  style={{ color: colors.text, borderBottomColor: colors.primary, textAlignVertical: 'top' }}
                  className="text-sm font-semibold border-b py-1 mt-1 leading-5"
                />
              ) : (
                <Text style={{ color: colors.text }} className="text-sm font-medium leading-5 mt-1">{bio}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Resume Card */}
        <View 
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          className="p-5 rounded-3xl border shadow-sm mb-8"
        >
          <Text style={{ color: colors.text }} className="text-sm font-extrabold mb-4">Uploaded Resume</Text>
          
          {resumeName ? (
            <View className="flex-row items-center bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl mb-4">
              <FileText size={20} color={colors.primary} className="mr-3" />
              <Text style={{ color: colors.text }} className="text-sm font-semibold flex-1" numberOfLines={1}>
                {resumeName}
              </Text>
            </View>
          ) : (
            <Text style={{ color: colors.textMuted }} className="text-xs mb-4">No resume uploaded yet. Add one to start AI evaluations.</Text>
          )}

          <TouchableOpacity 
            onPress={handleResumePick}
            disabled={uploadingResume}
            style={{ backgroundColor: colors.primary }}
            className="w-full py-3.5 rounded-2xl items-center justify-center flex-row shadow-sm"
          >
            {uploadingResume ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <UploadCloud size={18} color="#ffffff" className="mr-2" />
                <Text className="text-white text-sm font-bold">Replace Resume PDF</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentProfile;
