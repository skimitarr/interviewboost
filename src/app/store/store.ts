import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducers';

const store = configureStore({
  reducer: rootReducer,
})

export default store;

// лучший способ, чтобы не писать свой тип для селектора
export type RootState = ReturnType<typeof store.getState>;
// дока советует сделать так
export type AppDispatch = typeof store.dispatch;
