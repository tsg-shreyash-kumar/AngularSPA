export interface EmployeeStaffingPreferences {
    employeeCode: string;
    preferenceType: string;
    staffingPreferences: staffingPreference[];
    lastUpdatedBy: string;
    interest: boolean;
    noInterest: boolean;
}

export interface staffingPreference {
    code: string;
    name: string;
}