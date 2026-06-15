import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../context/ThemeContext';
import { AuthStackParamList } from '../../types/navigation';
import { GraduationCap, BrainCircuit, BellRing, ArrowRight } from 'lucide-react-native';
import { storage } from '../../utils/storage';

type OnboardingScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Onboarding'>;

interface Props {
  navigation: OnboardingScreenNavigationProp;
}

const { width } = Dimensions.get('window');

export const Onboarding: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Smart Campus Portal',
      description: 'Unified management for students, faculty, and administrators. Track attendance, assignments, and grades effortlessly.',
      icon: GraduationCap,
    },
    {
      title: 'AI Career Companion',
      description: 'Get AI Resume Analysis, practice with AI Mock Interviews, and get dynamic roadmaps customized for your dream tech jobs.',
      icon: BrainCircuit,
    },
    {
      title: 'Instant Notifications',
      description: 'Receive real-time push notifications for assignment deadlines, exam results, placement updates, and campus events.',
      icon: BellRing,
    },
  ];

  const handleNext = async () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      await storage.setItem('@onboarding_completed', true);
      navigation.replace('Login');
    }
  };

  const IconComponent = slides[currentSlide].icon;

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1 px-6">
      {/* Skip Button */}
      <View className="flex-row justify-end py-4">
        {currentSlide < slides.length - 1 && (
          <TouchableOpacity onPress={async () => {
            await storage.setItem('@onboarding_completed', true);
            navigation.replace('Login');
          }}>
            <Text style={{ color: colors.primary }} className="text-base font-semibold">
              Skip
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Slide Content */}
      <View className="flex-1 justify-center items-center py-8">
        <View 
          style={{ backgroundColor: colors.primaryLight }}
          className="p-8 rounded-full mb-8 shadow-md"
        >
          <IconComponent size={64} color={colors.primary} />
        </View>

        <Text 
          style={{ color: colors.text }}
          className="text-2xl font-extrabold text-center mb-4 tracking-tight px-4"
        >
          {slides[currentSlide].title}
        </Text>

        <Text 
          style={{ color: colors.textMuted }}
          className="text-base text-center leading-6 px-6 font-normal"
        >
          {slides[currentSlide].description}
        </Text>
      </View>

      {/* Indicators and Button */}
      <View className="pb-12">
        {/* Pagination Dots */}
        <View className="flex-row justify-center mb-8">
          {slides.map((_, index) => (
            <View
              key={index}
              style={{
                backgroundColor: index === currentSlide ? colors.primary : colors.border,
                width: index === currentSlide ? 24 : 8,
                height: 8,
              }}
              className="rounded-full mx-1 transition-all duration-300"
            />
          ))}
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          onPress={handleNext}
          style={{ backgroundColor: colors.primary }}
          className="flex-row items-center justify-center py-4 rounded-2xl shadow-lg shadow-sky-500/30"
        >
          <Text className="text-white text-base font-bold mr-2">
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <ArrowRight size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;
