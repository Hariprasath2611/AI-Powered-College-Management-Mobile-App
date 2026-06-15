import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'jwt_auth_token';
const REFRESH_TOKEN_KEY = 'jwt_refresh_token';
const USER_KEY = 'saved_user_profile';
const THEME_KEY = '@app_theme';

export const storage = {
  // Secure Store for Auth Tokens
  async setToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving secure token:', error);
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting secure token:', error);
      return null;
    }
  },

  async removeToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error removing secure token:', error);
    }
  },

  async setRefreshToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving secure refresh token:', error);
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting secure refresh token:', error);
      return null;
    }
  },

  async removeRefreshToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error removing secure refresh token:', error);
    }
  },

  // AsyncStorage for Offline Caching & Non-sensitive settings
  async setItem(key: string, value: any): Promise<void> {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, stringValue);
    } catch (error) {
      console.error(`Error setting item [${key}] in AsyncStorage:`, error);
    }
  },

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) return null;
      try {
        return JSON.parse(value) as T;
      } catch {
        return value as unknown as T;
      }
    } catch (error) {
      console.error(`Error getting item [${key}] from AsyncStorage:`, error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item [${key}] from AsyncStorage:`, error);
    }
  },

  // Helper for user profiles
  async saveUserProfile(user: any): Promise<void> {
    await this.setItem(USER_KEY, user);
  },

  async getUserProfile(): Promise<any | null> {
    return await this.getItem(USER_KEY);
  },

  async removeUserProfile(): Promise<void> {
    await this.removeItem(USER_KEY);
  },

  // Clear all auth storage on logout
  async clearAuthData(): Promise<void> {
    await this.removeToken();
    await this.removeRefreshToken();
    await this.removeUserProfile();
  }
};
