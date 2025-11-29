import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: {
    id: null,
    nickname: '',
    phone: '',
    email: '',
    avatarUrl: null,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateProfileLocal: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    resetUser: () => initialState,
  },
});

export const {
  updateProfileLocal,
  resetUser,
} = userSlice.actions;

export default userSlice.reducer;
