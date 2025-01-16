import { createSlice } from '@reduxjs/toolkit';

const navigationSlice = createSlice({
  name: 'navigation',
  initialState: {
    activeModule: null,
    sidebarShow: true,
    sidebarUnfoldable: false,
    isDropdownOpen: false
  },
  reducers: {
    setActiveModule: (state, action) => {
      if (state.activeModule === action.payload) {
        state.isDropdownOpen = !state.isDropdownOpen;
      } else {
        state.activeModule = action.payload;
        state.isDropdownOpen = true;
      }
    },
    clearActiveModule: (state) => {
      state.activeModule = null;
    },
    set: (state, action) => {
      return { ...state, ...action.payload }
    }
  },
});

export const { setActiveModule, clearActiveModule, set } = navigationSlice.actions;
export default navigationSlice.reducer;