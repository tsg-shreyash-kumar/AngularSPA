import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminState } from './admin.state';


const getAdminFeatureState = createFeatureSelector<AdminState>(
    'admin'
);

export const getStaffingUsers = createSelector(
    getAdminFeatureState,
    (state) => state.staffingUsers
);

export const staffingUsersLoader = createSelector(
    getAdminFeatureState,
    (state) => state.staffingUsersLoader
);

export const getPracticeBasedRingfences = createSelector(
    getAdminFeatureState,
    (state) => state.practiceBasedRingfences
);
