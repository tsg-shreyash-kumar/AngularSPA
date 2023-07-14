import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CoreService } from '../core/core.service';
import { CommitmentType } from '../shared/interfaces/commitmentType.interface';
import { SecurityUserDetail } from '../shared/interfaces/securityUserDetail';

@Injectable()
export class AdminService {

    constructor(private http: HttpClient, private coreService: CoreService) {
    }

    getSecurityUsersDetails(): Observable<SecurityUserDetail[]> {
        return this.http.get<SecurityUserDetail[]>(`
        ${this.coreService.appSettings.ocelotApiGatewayBaseUrl}/api/staffingAggregator/getAllSecurityUsersDetails`);
    }

    upsertSecurityUser(data: any): Observable<SecurityUserDetail> {
        const lastUpdatedBy = this.coreService.loggedInUser.employeeCode;
        const requesParam = {
            'employeeCode': data.employeeCode,
            'roleCode': data.roleCode,
            'lastUpdatedBy': lastUpdatedBy,
            'isAdmin': data.isAdmin,
            'override': data.override,
            'notes': data.notes,
            'endDate': data.endDate,
            'userTypeCode': data.userTypeCode,
            'geoType' : data.geoType,
            'officeCodes' : data.officeCodes,
            'serviceLineCodes' : data.serviceLineCodes,
            'positionGroupCodes' : data.positionGroupCodes,
            'levelGrades' : data.levelGrades,
            'practiceAreaCodes' : data.practiceAreaCodes,
            'ringfenceCodes' : data.ringfenceCodes
        };
        return this.http.post<SecurityUserDetail>(`
        ${this.coreService.appSettings.ocelotApiGatewayBaseUrl}/api/securityUser/upsertSecurityUser`, requesParam);
    }

    deleteSecurityUser(employeeCode: string): any {
        const lastUpdatedBy = this.coreService.loggedInUser.employeeCode;
        const requesParam = new HttpParams({
            fromObject: {
                'employeeCode': employeeCode,
                'lastUpdatedBy': lastUpdatedBy
            }
        });
        return this.http.delete<any>(`
          ${this.coreService.appSettings.ocelotApiGatewayBaseUrl}/api/securityUser/deleteSecurityUser`, { params: requesParam });
    }
}
