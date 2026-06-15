import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  globalLoading: boolean;
  toast: {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    visible: boolean;
  } | null;
  networkConnected: boolean;
}

const initialState: UIState = {
  globalLoading: false,
  toast: null,
  networkConnected: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setGlobalLoading(state, action: PayloadAction<boolean>) {
      state.globalLoading = action.payload;
    },
    showToast(state, action: PayloadAction<{ message: string; type: 'success' | 'error' | 'info' | 'warning' }>) {
      state.toast = {
        message: action.payload.message,
        type: action.payload.type,
        visible: true,
      };
    },
    hideToast(state) {
      if (state.toast) {
        state.toast.visible = false;
      }
    },
    setNetworkStatus(state, action: PayloadAction<boolean>) {
      state.networkConnected = action.payload;
    },
  },
});

export const {
  setGlobalLoading,
  showToast,
  hideToast,
  setNetworkStatus,
} = uiSlice.actions;

export default uiSlice.reducer;
