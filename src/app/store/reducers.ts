import { combineReducers } from '@reduxjs/toolkit';
import { appDataSlice } from './slices/app-data.slice';
import { userSlice } from './slices/user.slice';

export const rootReducer = combineReducers({
        user: userSlice.reducer,
        appData: appDataSlice.reducer,
    }
)
