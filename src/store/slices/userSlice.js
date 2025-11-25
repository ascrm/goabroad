import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: {
    id: null,
    nickname: '',
    phone: '',
    email: '',
    avatarUrl: null,
  },
  preferences: {
    onboarding: {
      completed: false,
      targetCountries: [],
      purpose: null,
      departureTime: null,
      currentStatus: null,
    },
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateProfileLocal: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    updatePreferencesLocal: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    resetUser: () => initialState,
  },
});

export const {
  updateProfileLocal,
  updatePreferencesLocal,
  resetUser,
} = userSlice.actions;

export default userSlice.reducer;
