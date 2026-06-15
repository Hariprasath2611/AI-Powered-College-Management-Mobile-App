import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, SafeAreaView } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import { useAppSelector, useAppDispatch } from './src/redux/hooks';
import { hideToast } from './src/redux/slices/uiSlice';
import { CheckCircle2, AlertTriangle, AlertCircle, XCircle } from 'lucide-react-native';

// Global Toast Banner Component
const GlobalToast = () => {
  const toast = useAppSelector((state) => state.ui.toast);
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toast?.visible) {
      // Slide/Fade In
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start();

      // Auto dismiss after 3 seconds
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          dispatch(hideToast());
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!toast?.visible) return null;

  let ToastIcon = CheckCircle2;
  let iconColor = '#10b981'; // Success Green
  let toastBg = 'bg-emerald-500/10 border-emerald-500/20';

  if (toast.type === 'error') {
    ToastIcon = XCircle;
    iconColor = '#ef4444';
    toastBg = 'bg-red-500/10 border-red-500/20';
  } else if (toast.type === 'warning') {
    ToastIcon = AlertTriangle;
    iconColor = '#fbbf24';
    toastBg = 'bg-amber-500/10 border-amber-500/20';
  } else if (toast.type === 'info') {
    ToastIcon = AlertCircle;
    iconColor = colors.primary;
    toastBg = 'bg-sky-500/10 border-sky-500/20';
  }

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        zIndex: 9999,
        opacity: fadeAnim,
        transform: [
          {
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0],
            }),
          },
        ],
      }}
      className={`flex-row items-center border p-4 rounded-2xl shadow-lg ${toastBg}`}
    >
      <ToastIcon size={20} color={iconColor} className="mr-3" />
      <Text style={{ color: colors.text }} className="text-sm font-bold flex-1">
        {toast.message}
      </Text>
    </Animated.View>
  );
};

// Main Entry wrapping Redux provider
export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <View style={{ flex: 1 }}>
          <GlobalToast />
          <AppNavigator />
        </View>
      </ThemeProvider>
    </Provider>
  );
}
