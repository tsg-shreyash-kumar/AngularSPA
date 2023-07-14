export interface ResourceFilter {
    id: string;
    title: string;
    description?: string;
    employeeCode: string;
    isDefault: boolean;
    officeCodes: string;
    staffingTags: string;
    levelGrades: string;
    positionCodes: string;
    employeeStatuses: string;
    commitmentTypeCodes: string;
    certificates: string;
    languages: string;
    practiceAreaCodes: string;
    sortBy: string;
    lastUpdatedBy: string;
    staffableAsTypeCodes: string;
    affiliationRoleCodes:string;
}
