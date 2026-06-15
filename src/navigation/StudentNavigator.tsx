import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';
import { StudentTabParamList } from '../types/navigation';
import StudentDashboard from '../screens/student/StudentDashboard';
import StudentAttendance from '../screens/student/StudentAttendance';
import StudentAssignments from '../screens/student/StudentAssignments';
import StudentPlacement from '../screens/student/StudentPlacement';
import StudentAITools from '../screens/student/StudentAITools';
import StudentProfile from '../screens/student/StudentProfile';
import Settings from '../screens/shared/Settings';
import { Home, CheckSquare, BookOpen, Briefcase, Sparkles, User, Settings as SettingsIcon, Bell } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';

const Tab = createBottomTabNavigator<StudentTabParamList>();
const Stack = createStackNavigator();

const StudentTabs = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconSize = focused ? 22 : 20;
          switch (route.name) {
            case 'StudentDashboard':
              return <Home size={iconSize} color={color} />;
            case 'StudentAttendance':
              return <CheckSquare size={iconSize} color={color} />;
            case 'StudentAssignments':
              return <BookOpen size={iconSize} color={color} />;
            case 'StudentPlacement':
              return <Briefcase size={iconSize} color={color} />;
            case 'StudentAITools':
              return <Sparkles size={iconSize} color={color} />;
            case 'StudentProfile':
              return <User size={iconSize} color={color} />;
            default:
              return null;
          }
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
        headerStyle: {
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          color: colors.text,
          fontWeight: '800',
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen 
        name="StudentDashboard" 
        component={StudentDashboard} 
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="StudentAttendance" 
        component={StudentAttendance} 
        options={{ title: 'Attendance' }}
      />
      <Tab.Screen 
        name="StudentAssignments" 
        component={StudentAssignments} 
        options={{ title: 'Assignments' }}
      />
      <Tab.Screen 
        name="StudentPlacement" 
        component={StudentPlacement} 
        options={{ title: 'Placements' }}
      />
      <Tab.Screen 
        name="StudentAITools" 
        component={StudentAITools} 
        options={{ title: 'AI Assistant' }}
      />
      <Tab.Screen 
        name="StudentProfile" 
        component={StudentProfile} 
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export const StudentNavigator = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          color: colors.text,
          fontWeight: '800',
          fontSize: 18,
        },
        headerTintColor: colors.primary,
      }}
    >
      <Stack.Screen
        name="StudentMain"
        component={StudentTabs}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'EduPulse Hub',
          headerRight: () => (
            <View className="flex-row mr-4 items-center">
              <TouchableOpacity className="p-2 mr-2">
                <Bell size={20} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Settings')} 
                className="p-2"
              >
                <SettingsIcon size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      <Stack.Screen 
        name="Settings" 
        component={Settings} 
        options={{ title: 'System Settings' }}
      />
    </Stack.Navigator>
  );
};

export default StudentNavigator;
