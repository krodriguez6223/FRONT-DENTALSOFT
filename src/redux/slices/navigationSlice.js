import { createSlice } from '@reduxjs/toolkit';

const navigationSlice = createSlice({
  name: 'navigation',
  initialState: {
    activeModule: null,
    sidebarShow: true,
    sidebarUnfoldable: false
  },
  reducers: {
    setActiveModule: (state, action) => {
      state.activeModule = action.payload;
    },
    set: (state, action) => {
      return { ...state, ...action.payload }
    }
  },
});

export const { setActiveModule, set } = navigationSlice.actions;
export default navigationSlice.reducer;