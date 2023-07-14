import { Action } from '@ngrx/store';

export enum AdminActionTypes {
    LoadStaffingUsers = '[Admin Page] Load Staffing Users',
    LoadStaffingUsersSuccess = '[Admin Page] Load Staffing Users Success',
    ShowHideStaffingUsersLoader = '[Admin Page] Show Hide Staffing Users Loader',
    DeleteSaffingUser = '[Admin Page] Delete Staffing User',
    DeleteSaffingUserSuccess = '[Admin Page] Delete Staffing User Success',
    UpsertSecurityUser = '[Admin Page] Upsert Staffing User',
    UpsertSecurityUserSuccess = '[Admin Page] Upsert Staffing User Success',
    LoadPracticeBasedRingfences = '[Admin Page] Load Pracice Based Ringfences',
    LoadPracticeBasedRingfencesSuccess = '[Admin Page] Load Pracice Based Ringfences Success',
    UpsertPracticeBasedRingfence = '[Admin Page] Upsert Practice Based Ringfence',
    UpsertPracticeBasedRingfenceSuccess = '[Admin Page] Upsert Practice Based Ringfence Success',
}

export class LoadStaffingUsers implements Action {
    readonly type = AdminActionTypes.LoadStaffingUsers;

    constructor() {}
}

export class LoadStaffingUsersSuccess implements Action {
    readonly type = AdminActionTypes.LoadStaffingUsersSuccess;

    constructor(public payload: any) {}
}

export class ShowHideStaffingUsersLoader implements Action {
    readonly type = AdminActionTypes.ShowHideStaffingUsersLoader;

    constructor(public payload: any) {}
}

export class DeleteSaffingUser implements Action {
    readonly type = AdminActionTypes.DeleteSaffingUser;

    constructor(public payload: any) {}
}

export class DeleteSaffingUserSuccess implements Action {
    readonly type = AdminActionTypes.DeleteSaffingUserSuccess;

    constructor(public payload: any) {}
}

export class UpsertSecurityUser implements Action {
    readonly type = AdminActionTypes.UpsertSecurityUser;

    constructor(public payload: any) {}
}

export class UpsertSecurityUserSuccess implements Action {
    readonly type = AdminActionTypes.UpsertSecurityUserSuccess;

    constructor(public payload: any) {}
}

export class LoadPracticeBasedRingfences implements Action {
    readonly type = AdminActionTypes.LoadPracticeBasedRingfences;

    constructor(public payload: boolean) {}
}

export class LoadPracticeBasedRingfencesSuccess implements Action {
    readonly type = AdminActionTypes.LoadPracticeBasedRingfencesSuccess;

    constructor(public payload: any) {}
}

export class UpsertPracticeBasedRingfence implements Action {
    readonly type = AdminActionTypes.UpsertPracticeBasedRingfence;

    constructor(public payload: any) {}
}

export class UpsertPracticeBasedRingfenceSuccess implements Action {
    readonly type = AdminActionTypes.UpsertPracticeBasedRingfenceSuccess;

    constructor(public payload: any) {}
}

export type AdminActions =
    LoadStaffingUsers
    | LoadStaffingUsersSuccess
    | ShowHideStaffingUsersLoader
    | DeleteSaffingUser
    | DeleteSaffingUserSuccess
    | UpsertSecurityUser
    | UpsertSecurityUserSuccess
    | LoadPracticeBasedRingfences
    | LoadPracticeBasedRingfencesSuccess
    | UpsertPracticeBasedRingfence
    | UpsertPracticeBasedRingfenceSuccess
    ;
