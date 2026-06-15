import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, ActivityIndicator, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../context/ThemeContext';
import { AuthStackParamList } from '../../types/navigation';
import { GraduationCap } from 'lucide-react-native';
import { useAppDispatch } from '../../redux/hooks';
import { storage } from '../../utils/storage';
import { loginSuccess, logout } from '../../redux/slices/authSlice';
import api from '../../services/api';

type SplashScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Splash'>;

interface Props {
  navigation: SplashScreenNavigationProp;
}

export const Splash: React.FC<Props> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Logo entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Check auth and auto login
    const checkAuth = async () => {
      // Simulate splash display for a brief second
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      try {
        const token = await storage.getToken();
        const refreshToken = await storage.getRefreshToken();
        const savedUser = await storage.getUserProfile();

        if (token && refreshToken && savedUser) {
          // Verify with API or load from local storage cache for instant startup
          dispatch(
            loginSuccess({
              user: savedUser,
              token,
              refreshToken,
            })
          );
        } else {
          // Check if onboarding completed
          const onboardingCompleted = await storage.getItem<boolean>('@onboarding_completed');
          if (onboardingCompleted) {
            navigation.replace('Login');
          } else {
            navigation.replace('Onboarding');
          }
        }
      } catch (error) {
        console.error('Failed auto-login checking', error);
        navigation.replace('Login');
      }
    };

    checkAuth();
  }, []);

  return (
    <View
      style={{ backgroundColor: colors.background }}
      className="flex-1 items-center justify-center px-6"
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
        className="items-center justify-center"
      >
        <View 
          style={{ backgroundColor: colors.primaryLight }}
          className="p-6 rounded-3xl mb-4 items-center justify-center shadow-lg shadow-sky-500/20"
        >
          <GraduationCap size={72} color={colors.primary} />
        </View>
        <Text
          style={{ color: colors.text }}
          className="text-3xl font-extrabold tracking-tight text-center mb-1"
        >
          EduPulse
        </Text>
        <Text
          style={{ color: colors.textMuted }}
          className="text-base text-center mb-12 font-medium tracking-wide uppercase"
        >
          AI-Powered Campus Hub
        </Text>
      </Animated.View>

      <ActivityIndicator size="small" color={colors.primary} className="absolute bottom-16" />
    </View>
  );
};

export default Splash;
