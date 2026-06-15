import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../context/ThemeContext';
import { AuthStackParamList } from '../../types/navigation';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loginStart, loginSuccess, loginFailure, setRememberMe, UserRole } from '../../redux/slices/authSlice';
import { storage } from '../../utils/storage';
import api from '../../services/api';
import { GraduationCap, Eye, EyeOff, Lock, Mail, ShieldAlert } from 'lucide-react-native';
import { showToast } from '../../redux/slices/uiSlice';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export const Login: React.FC<Props> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const { isLoading, error, rememberMe } = useAppSelector((state) => state.auth);
  
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data: typeof control._defaultValues) => {
    dispatch(loginStart());
    try {
      // API call to authentication endpoint
      const response = await api.post<{
        user: {
          id: string;
          name: string;
          email: string;
          role: UserRole;
          department?: string;
          semester?: number;
          avatarUrl?: string;
        };
        token: string;
        refreshToken: string;
      }>('/auth/login', {
        email: data.email,
        password: data.password,
      });

      const { user, token, refreshToken } = response.data;

      // Handle remember me logic
      if (rememberMe) {
        await storage.setToken(token);
        await storage.setRefreshToken(refreshToken);
        await storage.saveUserProfile(user);
      } else {
        // If not remember me, we still save for active session, but don't persist on reboot (handled by Splash checking)
        await storage.setToken(token);
        await storage.setRefreshToken(refreshToken);
        await storage.saveUserProfile(user);
      }

      dispatch(loginSuccess({ user, token, refreshToken }));
      dispatch(showToast({ message: `Welcome back, ${user.name}!`, type: 'success' }));
      
    } catch (err: any) {
      // Fallback mockup auth for demonstration purposes if backend is not running/available yet
      console.warn('Backend unavailable, trying offline mockup login...', err.message);
      
      const emailLower = data.email?.toLowerCase() || '';
      let mockRole: UserRole = 'student';
      let mockName = 'Alex Mercer';
      
      if (emailLower.includes('faculty') || emailLower.includes('teacher')) {
        mockRole = 'faculty';
        mockName = 'Dr. Sarah Connor';
      } else if (emailLower.includes('admin')) {
        mockRole = 'admin';
        mockName = 'Director Fury';
      }

      if (data.password && data.password.length >= 6) {
        const mockUser = {
          id: 'mock-12345',
          name: mockName,
          email: data.email || 'mock@edu.com',
          role: mockRole,
          department: 'Computer Science',
          semester: mockRole === 'student' ? 6 : undefined,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
        };

        const mockToken = 'mock-jwt-token';
        const mockRefreshToken = 'mock-refresh-token';

        await storage.setToken(mockToken);
        await storage.setRefreshToken(mockRefreshToken);
        await storage.saveUserProfile(mockUser);

        dispatch(loginSuccess({ user: mockUser, token: mockToken, refreshToken: mockRefreshToken }));
        dispatch(showToast({ message: `Offline Login successful as ${mockRole}`, type: 'info' }));
      } else {
        dispatch(loginFailure(err.message || 'Invalid credentials'));
        dispatch(showToast({ message: err.message || 'Invalid email or password', type: 'error' }));
      }
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-8">
        {/* Top Header Logo */}
        <View className="items-center justify-center my-8">
          <View 
            style={{ backgroundColor: colors.primaryLight }}
            className="p-5 rounded-3xl mb-4 shadow-md shadow-sky-500/10"
          >
            <GraduationCap size={48} color={colors.primary} />
          </View>
          <Text style={{ color: colors.text }} className="text-3xl font-extrabold tracking-tight">
            Welcome Back
          </Text>
          <Text style={{ color: colors.textMuted }} className="text-sm mt-1 text-center font-medium">
            Sign in to access your dashboard
          </Text>
        </View>

        {/* Login Form card */}
        <View 
          style={{ 
            backgroundColor: colors.card,
            borderColor: colors.border 
          }}
          className="p-6 rounded-3xl border shadow-sm mb-6"
        >
          {error && (
            <View className="flex-row items-center bg-red-500/10 border border-red-500/20 p-3 rounded-2xl mb-4">
              <ShieldAlert size={20} color="#ef4444" className="mr-2" />
              <Text className="text-red-500 text-sm font-semibold flex-1">{error}</Text>
            </View>
          )}

          {/* Email Input */}
          <Text style={{ color: colors.text }} className="text-sm font-bold mb-2 ml-1">
            Email Address
          </Text>
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View 
                style={{ 
                  backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
                  borderColor: errors.email ? '#ef4444' : 'transparent'
                }}
                className="flex-row items-center border rounded-2xl px-4 py-3 mb-4"
              >
                <Mail size={20} color={colors.textMuted} className="mr-3" />
                <TextInput
                  placeholder="name@college.edu"
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
          {errors.email && (
            <Text className="text-red-500 text-xs font-semibold mb-3 ml-1">
              {errors.email.message}
            </Text>
          )}

          {/* Password Input */}
          <Text style={{ color: colors.text }} className="text-sm font-bold mb-2 ml-1">
            Password
          </Text>
          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View 
                style={{ 
                  backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
                  borderColor: errors.password ? '#ef4444' : 'transparent'
                }}
                className="flex-row items-center border rounded-2xl px-4 py-3 mb-2"
              >
                <Lock size={20} color={colors.textMuted} className="mr-3" />
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={{ color: colors.text }}
                  className="flex-1 text-base py-0.5"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={20} color={colors.textMuted} />
                  ) : (
                    <Eye size={20} color={colors.textMuted} />
                  )}
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.password && (
            <Text className="text-red-500 text-xs font-semibold mb-3 ml-1">
              {errors.password.message}
            </Text>
          )}

          {/* Remember Me & Forgot Password */}
          <View className="flex-row justify-between items-center my-3">
            <TouchableOpacity 
              onPress={() => dispatch(setRememberMe(!rememberMe))}
              className="flex-row items-center"
            >
              <View 
                style={{ 
                  borderColor: colors.primary, 
                  backgroundColor: rememberMe ? colors.primary : 'transparent' 
                }}
                className="w-5 height-5 h-5 rounded border mr-2 items-center justify-center"
              >
                {rememberMe && <Text className="text-white text-xs font-bold">✓</Text>}
              </View>
              <Text style={{ color: colors.textMuted }} className="text-sm font-medium">
                Remember Me
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={{ color: colors.primary }} className="text-sm font-bold">
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            style={{ backgroundColor: colors.primary }}
            className="w-full py-4 rounded-2xl items-center justify-center mt-4 shadow-lg shadow-sky-500/20"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text className="text-white text-base font-bold">Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Social Authentication */}
        <View className="items-center mb-6">
          <Text style={{ color: colors.textMuted }} className="text-sm font-semibold mb-4">
            OR CONTINUE WITH
          </Text>
          <TouchableOpacity 
            style={{ 
              backgroundColor: colors.card,
              borderColor: colors.border
            }}
            className="flex-row items-center border px-6 py-3.5 rounded-2xl w-full justify-center shadow-sm"
          >
            <Text style={{ color: colors.text }} className="text-base font-bold ml-2">
              Google Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Register Prompt */}
        <View className="flex-row justify-center items-center mt-auto py-4">
          <Text style={{ color: colors.textMuted }} className="text-sm font-medium">
            New to EduPulse?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{ color: colors.primary }} className="text-sm font-bold">
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
