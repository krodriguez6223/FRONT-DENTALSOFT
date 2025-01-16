import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from './slices/navigationSlice';

const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    // otros reducers si los tienes
  },
});

export default store;