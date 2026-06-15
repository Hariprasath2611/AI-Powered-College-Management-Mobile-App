import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';
import { FacultyTabParamList } from '../types/navigation';
import FacultyDashboard from '../screens/faculty/FacultyDashboard';
import MarkAttendance from '../screens/faculty/MarkAttendance';
import ManageAssignments from '../screens/faculty/ManageAssignments';
import AddMarks from '../screens/faculty/AddMarks';
import StudentMonitoring from '../screens/faculty/StudentMonitoring';
import Settings from '../screens/shared/Settings';
import { Home, Users, ClipboardList, Award, AlertCircle, Settings as SettingsIcon } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';

const Tab = createBottomTabNavigator<FacultyTabParamList>();
const Stack = createStackNavigator();

const FacultyTabs = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconSize = focused ? 22 : 20;
          switch (route.name) {
            case 'FacultyDashboard':
              return <Home size={iconSize} color={color} />;
            case 'MarkAttendance':
              return <Users size={iconSize} color={color} />;
            case 'ManageAssignments':
              return <ClipboardList size={iconSize} color={color} />;
            case 'AddMarks':
              return <Award size={iconSize} color={color} />;
            case 'StudentMonitoring':
              return <AlertCircle size={iconSize} color={color} />;
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
        name="FacultyDashboard" 
        component={FacultyDashboard} 
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="MarkAttendance" 
        component={MarkAttendance} 
        options={{ title: 'Attendance' }}
      />
      <Tab.Screen 
        name="ManageAssignments" 
        component={ManageAssignments} 
        options={{ title: 'Assignments' }}
      />
      <Tab.Screen 
        name="AddMarks" 
        component={AddMarks} 
        options={{ title: 'Add Marks' }}
      />
      <Tab.Screen 
        name="StudentMonitoring" 
        component={StudentMonitoring} 
        options={{ title: 'Monitoring' }}
      />
    </Tab.Navigator>
  );
};

export const FacultyNavigator = () => {
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
        name="FacultyMain"
        component={FacultyTabs}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Faculty Portal',
          headerRight: () => (
            <View className="mr-4">
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
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
};

export default FacultyNavigator;
