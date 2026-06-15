import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';
import { AdminTabParamList } from '../types/navigation';
import AdminDashboard from '../screens/admin/AdminDashboard';
import UserManagement from '../screens/admin/UserManagement';
import DepartmentManagement from '../screens/admin/DepartmentManagement';
import PlacementTracking from '../screens/admin/PlacementTracking';
import EventManagement from '../screens/admin/EventManagement';
import Settings from '../screens/shared/Settings';
import { Home, Users, BookOpen, Briefcase, Calendar, Settings as SettingsIcon } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';

const Tab = createBottomTabNavigator<AdminTabParamList>();
const Stack = createStackNavigator();

const AdminTabs = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconSize = focused ? 22 : 20;
          switch (route.name) {
            case 'AdminDashboard':
              return <Home size={iconSize} color={color} />;
            case 'UserManagement':
              return <Users size={iconSize} color={color} />;
            case 'DepartmentManagement':
              return <BookOpen size={iconSize} color={color} />;
            case 'PlacementTracking':
              return <Briefcase size={iconSize} color={color} />;
            case 'EventManagement':
              return <Calendar size={iconSize} color={color} />;
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
        name="AdminDashboard" 
        component={AdminDashboard} 
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="UserManagement" 
        component={UserManagement} 
        options={{ title: 'Users' }}
      />
      <Tab.Screen 
        name="DepartmentManagement" 
        component={DepartmentManagement} 
        options={{ title: 'Depts' }}
      />
      <Tab.Screen 
        name="PlacementTracking" 
        component={PlacementTracking} 
        options={{ title: 'Placements' }}
      />
      <Tab.Screen 
        name="EventManagement" 
        component={EventManagement} 
        options={{ title: 'Events' }}
      />
    </Tab.Navigator>
  );
};

export const AdminNavigator = () => {
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
        name="AdminMain"
        component={AdminTabs}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Admin Command',
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

export default AdminNavigator;
