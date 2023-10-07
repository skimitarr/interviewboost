import { configureStore } from '@reduxjs/toolkit';
import dataSlice from './DataSlice';

const store = configureStore({
  reducer: dataSlice,
})

export default store;

// лучший способ, чтобы не писать свой тип для селектора
export type RootState = ReturnType<typeof store.getState>;
// дока советует сделать так
export type AppDispatch = typeof store.dispatch;
