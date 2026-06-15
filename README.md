# EduPulse: AI-Powered College Management Mobile Application

EduPulse is a production-ready, highly scalable React Native / Expo mobile application built with TypeScript, Redux Toolkit, and NativeWind. It serves three distinct campus roles (Students, Faculty, and Administrators) and features deep integrations for AI Resume Analysis, AI Mock Interviews, learning roadmaps, campus events registration, and automated push notifications.

---

## Table of Contents
1. [Project Setup Guide](#1-project-setup-guide)
2. [Folder Structure Guide](#2-folder-structure-guide)
3. [API Integration Guide](#3-api-integration-guide)
4. [Build Guide](#4-build-guide)
5. [Deployment Guide](#5-deployment-guide)

---

## 1. Project Setup Guide

### Prerequisites
Ensure you have the following installed on your local machine:
- **Node.js**: v18 or later
- **Package Manager**: npm (included with Node) or yarn
- **Expo Go App**: Installed on your physical iOS/Android device for testing, or set up Xcode Simulators (iOS) / Android Studio Emulators (Android).

### Step-by-Step Installation
1. **Clone & Navigate to the Project Directory**:
   ```bash
   cd "AI-Powered College Management Mobile App"
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```
   *This downloads and configures all React Native, Expo, Navigation, Redux, Tailwind, and icon libraries.*

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_API_URL=http://<your-local-ip-address>:5000/api
   ```
   *Note: In local development, avoid `localhost` if testing on an emulator or physical device. Use your computer's local network IP address (e.g., `http://192.168.1.5:5000/api`). On the Android Emulator, `http://10.0.2.2:5000/api` acts as the host loopback.*

4. **Verify TypeScript Compilation**:
   ```bash
   npm run ts:check
   ```
   *This compiles the project to ensure no type errors exist.*

5. **Start the Developer Server**:
   ```bash
   npx expo start
   ```
   - Press **`a`** to open in Android Emulator.
   - Press **`i`** to open in iOS Simulator.
   - Scan the terminal QR code using the **Expo Go** application on a physical device.

---

## 2. Folder Structure Guide

The project utilizes a scalable **Feature-Based & Layered Architecture** categorized inside the `src/` directory:

```
src/
├── assets/         # App icons, static images, and splash graphics.
├── components/     # Global reusable UI widgets (buttons, input fields, cards, custom indicators).
├── context/        # React Context providers (e.g., ThemeContext for light/dark mode persistence).
├── navigation/     # App Navigation Containers, stacking role-based routers:
│   ├── AppNavigator.tsx       # Root router switching Auth/Student/Faculty/Admin stacks
│   ├── AuthNavigator.tsx      # public login, registration, and onboarding stack
│   ├── StudentNavigator.tsx   # Student tabs (Dashboard, Attendance, AI Tools, Profile)
│   ├── FacultyNavigator.tsx   # Faculty tabs (Attendance Mark, Assignments, Grades)
│   └── AdminNavigator.tsx     # Admin tabs (User CRUD, Depts, placement drives, events)
├── screens/        # Screen controllers categorized by roles and modules:
│   ├── auth/       # Splash, Onboarding, Login, Register, Forgot Password
│   ├── student/    # Student Dashboard, Attendance tracking, PDF upload assignments, AI tools
│   ├── faculty/    # Class listings, Attendance grids, Marks tables, Risk monitoring
│   ├── admin/      # User management search, Department structures, Drives editor, Event publisher
│   └── shared/     # Settings (theme triggers, notification switches, logout buttons)
├── services/       # Network API layers:
│   └── api.ts      # Centralized Axios client with token auth headers and refresh interceptors
├── redux/          # Redux Toolkit global state managers:
│   ├── store.ts               # Core Redux Store configuration
│   ├── hooks.ts               # Type-safe selectors (useAppSelector, useAppDispatch)
│   └── slices/                # Auth, UI, and feature-related reducers
├── types/          # Global TypeScript typings and navigation parameters
└── utils/          # Helpers (storage.ts wrapping SecureStore & AsyncStorage)
```

---

## 3. API Integration Guide

Network operations are coordinated through the centralized Axios instance defined in [api.ts](file:///d:/work/AI-Powered%20College%20Management%20Mobile%20App/src/services/api.ts).

### Secure Authentication Header Injection
Every outgoing API request is intercepted. If a JWT token is saved inside the device's secure keychain, it is automatically appended to the request headers:
```typescript
config.headers.Authorization = `Bearer ${token}`;
```

### Auto-Retry transient network failures
On network timeout or connection failures, the request interceptor attempts to retry the request up to **3 times** with a dynamic backoff delay (1s, 2s, 3s) before throwing an error.

### Silent Token Refresh Flow
If the API returns a `401 Unauthorized` response (expired JWT access token), the custom response interceptor:
1. Pauses the network chain.
2. Extracts the secure refresh token from `SecureStore`.
3. Issues a background request to the `/auth/refresh` endpoint to acquire a fresh JWT.
4. If successful, updates the local secure storage and Redux state, updates the Authorization header, and retries the original request seamlessly.
5. If the refresh token has also expired, the interceptor clears all secure data, triggers a Redux `logout` action, displays a session timeout toast banner, and redirects the user to the Login screen.

---

## 4. Build Guide

To distribute the application, compile the binaries using **Expo Application Services (EAS)** or compile locally.

### A. Cloud Builds with EAS (Recommended)
1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```
2. **Login to Expo**:
   ```bash
   eas login
   ```
3. **Configure EAS Project**:
   ```bash
   eas project:init
   ```
4. **Configure Build targets**:
   Create an `eas.json` configuration file at the root:
   ```json
   {
     "build": {
       "development": {
         "developmentClient": true,
         "distribution": "internal"
       },
       "preview": {
         "distribution": "internal"
       },
       "production": {}
     }
   }
   ```
5. **Run Build Commands**:
   - **For Android (APK / AAB)**:
     ```bash
     eas build --platform android --profile preview
     ```
   - **For iOS (Simulator / IPA)**:
     ```bash
     eas build --platform ios --profile preview
     ```

### B. Local Native Compilation (Requires Android SDK & Xcode)
If you prefer not to use the Expo Cloud builds, compile locally by generating native projects:
```bash
npx expo prebuild
npx react-native run-android --mode=release
```

---

## 5. Deployment Guide

### Play Store (Android) Submission
1. Generate an Android App Bundle (**AAB**) using production configuration:
   ```bash
   eas build --platform android --profile production
   ```
2. Download the resulting `.aab` file from your Expo Dashboard.
3. Open the [Google Play Console](https://play.google.com/console/) and select your application.
4. Navigate to **Release > Production** and create a new release.
5. Upload the `.aab` bundle.
6. Complete the Content Rating questionnaires, Store Listings details (Screenshots, descriptions), and submit the release for review.

### App Store (iOS) Submission
1. Register an Apple Developer Account and configure certificates.
2. Compile the production `.ipa` package:
   ```bash
   eas build --platform ios --profile production
   ```
3. Submit the build directly to TestFlight using EAS:
   ```bash
   eas submit --platform ios
   ```
4. Log into [App Store Connect](https://appstoreconnect.apple.com/), select your app, choose the uploaded build version, complete store metadata (privacy policy, pricing, screenshots), and submit for App Review.
