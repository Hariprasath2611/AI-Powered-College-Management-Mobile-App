import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppSelector } from '../redux/hooks';
import AuthNavigator from './AuthNavigator';
import StudentNavigator from './StudentNavigator';
import FacultyNavigator from './FacultyNavigator';
import AdminNavigator from './AdminNavigator';
import { useTheme } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

export const AppNavigator = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { theme } = useTheme();

  return (
    <NavigationContainer>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : user?.role === 'student' ? (
        <StudentNavigator />
      ) : user?.role === 'faculty' ? (
        <FacultyNavigator />
      ) : user?.role === 'admin' ? (
        <AdminNavigator />
      ) : (
        <AuthNavigator /> // Fallback safety
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
