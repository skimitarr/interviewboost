import pathOr from 'ramda/es/pathOr';

import { UserState } from '../types';
import { userSlice } from '../slices/user.slice';

export const selectFromUser = <Key extends keyof UserState>(
    field: keyof UserState,
    defaultValue: UserState[Key],
) => pathOr<UserState[Key]>(defaultValue, [userSlice.name, field]);
