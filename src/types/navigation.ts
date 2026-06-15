import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: { email?: string } | undefined;
};

// --- Student App Navigation Params ---
export type StudentTabParamList = {
  StudentDashboard: undefined;
  StudentAttendance: undefined;
  StudentAssignments: undefined;
  StudentPlacement: undefined;
  StudentAITools: undefined;
  StudentProfile: undefined;
};

export type StudentDrawerParamList = {
  MainTabs: NavigatorScreenParams<StudentTabParamList>;
  Settings: undefined;
  NotificationsList: undefined;
};

// --- Faculty App Navigation Params ---
export type FacultyTabParamList = {
  FacultyDashboard: undefined;
  MarkAttendance: undefined;
  ManageAssignments: undefined;
  AddMarks: undefined;
  StudentMonitoring: undefined;
};

export type FacultyDrawerParamList = {
  MainTabs: NavigatorScreenParams<FacultyTabParamList>;
  Settings: undefined;
};

// --- Admin App Navigation Params ---
export type AdminTabParamList = {
  AdminDashboard: undefined;
  UserManagement: undefined;
  DepartmentManagement: undefined;
  PlacementTracking: undefined;
  EventManagement: undefined;
};

export type AdminDrawerParamList = {
  MainTabs: NavigatorScreenParams<AdminTabParamList>;
  Settings: undefined;
};

// Combined App Parameters Root
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  StudentApp: NavigatorScreenParams<StudentDrawerParamList>;
  FacultyApp: NavigatorScreenParams<FacultyDrawerParamList>;
  AdminApp: NavigatorScreenParams<AdminDrawerParamList>;
};
