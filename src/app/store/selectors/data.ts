import pathOr from 'ramda/es/pathOr';

import { AppDataState } from '../types';
import { appDataSlice } from '../slices/app-data.slice';

export const selectFromAppData = <Key extends keyof AppDataState>(
    field: keyof AppDataState,
    defaultValue: AppDataState[Key],
) => pathOr<AppDataState[Key]>(defaultValue, [appDataSlice.name, field]);
