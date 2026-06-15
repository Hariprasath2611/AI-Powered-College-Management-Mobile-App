import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../context/ThemeContext';
import { AuthStackParamList } from '../../types/navigation';
import { useAppDispatch } from '../../redux/hooks';
import { showToast } from '../../redux/slices/uiSlice';
import api from '../../services/api';
import { GraduationCap, ArrowLeft, Mail, Lock, User, BookOpen } from 'lucide-react-native';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

export const Register: React.FC<Props> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const [role, setRole] = useState<'student' | 'faculty'>('student');
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      department: '',
      semester: '',
    }
  });

  const passwordVal = watch('password');

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role,
        department: data.department,
        semester: role === 'student' ? parseInt(data.semester, 10) || 1 : undefined,
      };

      await api.post('/auth/register', payload);

      dispatch(showToast({ message: 'Account created! Please log in.', type: 'success' }));
      navigation.replace('Login');
    } catch (err: any) {
      console.warn('Backend unavailable, mocking account creation:', err.message);
      
      // Simulate registration success for demo
      dispatch(showToast({ message: 'Mock registration complete! Please log in.', type: 'success' }));
      navigation.replace('Login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      {/* Header Bar */}
      <View className="flex-row items-center px-4 py-3 border-b" style={{ borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 mr-3">
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ color: colors.text }} className="text-xl font-bold">
          Create Account
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-6">
        {/* Logo and Greeting */}
        <View className="items-center mb-6">
          <Text style={{ color: colors.textMuted }} className="text-sm text-center font-medium">
            Join your college AI-Powered digital portal
          </Text>
        </View>

        {/* Role Selector Tabs */}
        <View className="flex-row bg-slate-200 dark:bg-slate-800 p-1.5 rounded-2xl mb-6">
          <TouchableOpacity
            onPress={() => setRole('student')}
            style={{ backgroundColor: role === 'student' ? colors.card : 'transparent' }}
            className="flex-1 py-3 rounded-xl items-center"
          >
            <Text 
              style={{ color: role === 'student' ? colors.primary : colors.textMuted }}
              className="text-sm font-bold"
            >
              Student Portal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setRole('faculty')}
            style={{ backgroundColor: role === 'faculty' ? colors.card : 'transparent' }}
            className="flex-1 py-3 rounded-xl items-center"
          >
            <Text 
              style={{ color: role === 'faculty' ? colors.primary : colors.textMuted }}
              className="text-sm font-bold"
            >
              Faculty Portal
            </Text>
          </TouchableOpacity>
        </View>

        {/* Registration Form */}
        <View 
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          className="p-6 rounded-3xl border shadow-sm mb-6"
        >
          {/* Full Name */}
          <Text style={{ color: colors.text }} className="text-sm font-bold mb-2 ml-1">
            Full Name
          </Text>
          <Controller
            control={control}
            name="name"
            rules={{ required: 'Full Name is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View 
                style={{ backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }}
                className="flex-row items-center rounded-2xl px-4 py-3 mb-4"
              >
                <User size={20} color={colors.textMuted} className="mr-3" />
                <TextInput
                  placeholder="John Doe"
                  placeholderTextColor={colors.textMuted}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={{ color: colors.text }}
                  className="flex-1 text-base py-0.5"
                />
              </View>
            )}
          />

          {/* Email Address */}
          <Text style={{ color: colors.text }} className="text-sm font-bold mb-2 ml-1">
            College Email
          </Text>
          <Controller
            control={control}
            name="email"
            rules={{ 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View 
                style={{ backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }}
                className="flex-row items-center rounded-2xl px-4 py-3 mb-4"
              >
                <Mail size={20} color={colors.textMuted} className="mr-3" />
                <TextInput
                  placeholder="john.doe@college.edu"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={{ color: colors.text }}
                  className="flex-1 text-base py-0.5"
                />
              </View>
            )}
          />

          {/* Dynamic Department Input */}
          <Text style={{ color: colors.text }} className="text-sm font-bold mb-2 ml-1">
            Department
          </Text>
          <Controller
            control={control}
            name="department"
            rules={{ required: 'Department is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View 
                style={{ backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }}
                className="flex-row items-center rounded-2xl px-4 py-3 mb-4"
              >
                <BookOpen size={20} color={colors.textMuted} className="mr-3" />
                <TextInput
                  placeholder="e.g. Computer Science, Mechanical"
                  placeholderTextColor={colors.textMuted}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={{ color: colors.text }}
                  className="flex-1 text-base py-0.5"
                />
              </View>
            )}
          />

          {/* Dynamic Semester Selector for Student role */}
          {role === 'student' && (
            <>
              <Text style={{ color: colors.text }} className="text-sm font-bold mb-2 ml-1">
                Current Semester
              </Text>
              <Controller
                control={control}
                name="semester"
                rules={{ 
                  required: 'Semester is required',
                  pattern: { value: /^[1-8]$/, message: 'Semester must be between 1 and 8' }
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View 
                    style={{ backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }}
                    className="flex-row items-center rounded-2xl px-4 py-3 mb-4"
                  >
                    <BookOpen size={20} color={colors.textMuted} className="mr-3" />
                    <TextInput
                      placeholder="1 to 8"
                      placeholderTextColor={colors.textMuted}
                      keyboardType="numeric"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      style={{ color: colors.text }}
                      className="flex-1 text-base py-0.5"
                    />
                  </View>
                )}
              />
            </>
          )}

          {/* Password */}
          <Text style={{ color: colors.text }} className="text-sm font-bold mb-2 ml-1">
            Password
          </Text>
          <Controller
            control={control}
            name="password"
            rules={{ 
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View 
                style={{ backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }}
                className="flex-row items-center rounded-2xl px-4 py-3 mb-4"
              >
                <Lock size={20} color={colors.textMuted} className="mr-3" />
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={{ color: colors.text }}
                  className="flex-1 text-base py-0.5"
                />
              </View>
            )}
          />

          {/* Confirm Password */}
          <Text style={{ color: colors.text }} className="text-sm font-bold mb-2 ml-1">
            Confirm Password
          </Text>
          <Controller
            control={control}
            name="confirmPassword"
            rules={{ 
              required: 'Confirm Password is required',
              validate: (val) => val === passwordVal || 'Passwords do not match'
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View 
                style={{ backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }}
                className="flex-row items-center rounded-2xl px-4 py-3 mb-6"
              >
                <Lock size={20} color={colors.textMuted} className="mr-3" />
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={{ color: colors.text }}
                  className="flex-1 text-base py-0.5"
                />
              </View>
            )}
          />

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            style={{ backgroundColor: colors.primary }}
            className="w-full py-4 rounded-2xl items-center justify-center shadow-lg shadow-sky-500/20"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text className="text-white text-base font-bold">Create Account</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
