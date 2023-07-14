import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { CommonService } from 'src/app/shared/commonService';
import { ConstantsMaster } from 'src/app/shared/constants/constantsMaster';
import { CoreService } from '../core.service';

@Injectable({
    providedIn: 'root'
})
export class ReportAuthGuardService implements CanActivate {

    constructor(private router: Router, private coreService: CoreService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        var accessibleReports = this.coreService.loggedInUserClaims.FeatureAccess.map(x => x.FeatureName).filter(x => x.startsWith('analytics'));
        var haveAccessToReport = this.getReportAccess(state.url, accessibleReports);
        if (haveAccessToReport) {
            return true;
        } else {
            return this.unauthorizedAccess(accessibleReports);
        }
    }

    getReportAccess(url, accessibleReports) {
        switch (true) {
            case ConstantsMaster.regexUrl.weeklyDeploymentSummary.test(url):
                return accessibleReports.includes(ConstantsMaster.appScreens.report.weeklyDeploymentSummaryView)
            case ConstantsMaster.regexUrl.resourceAvailability.test(url):
                return accessibleReports.includes(ConstantsMaster.appScreens.report.availability);
            case ConstantsMaster.regexUrl.staffingAllocation.test(url):
                return accessibleReports.includes(ConstantsMaster.appScreens.report.staffingAllocation);
            case ConstantsMaster.regexUrl.staffingAllocationsMonthly.test(url):
                return accessibleReports.includes(ConstantsMaster.appScreens.report.staffingAllocationsMonthly);
            case ConstantsMaster.regexUrl.commitmentDetails.test(url):
                return accessibleReports.includes(ConstantsMaster.appScreens.report.commitmentDetails);
            case ConstantsMaster.regexUrl.historicalAllocationsForPromotions.test(url):
                return accessibleReports.includes(ConstantsMaster.appScreens.report.historicalAllocationsForPromotions);
            case ConstantsMaster.regexUrl.ringfenceStaffing.test(url):
                return accessibleReports.includes(ConstantsMaster.appScreens.report.ringfenceStaffing);
            case ConstantsMaster.regexUrl.monthlyDeployment.test(url):
                return accessibleReports.includes(ConstantsMaster.appScreens.report.monthlyDeployment);
            case ConstantsMaster.regexUrl.monthlyFTEUtilization.test(url):
                return accessibleReports.includes(ConstantsMaster.appScreens.report.monthlyFTEUtilization);
            case ConstantsMaster.regexUrl.monthlyFTEUtilizationIndividual.test(url):
                return accessibleReports.includes(ConstantsMaster.appScreens.report.monthlyFTEUtilizationIndividual);
            case ConstantsMaster.regexUrl.monthlyPracticeAreaStaffing.test(url):
                return accessibleReports.includes(ConstantsMaster.appScreens.report.practiceStaffing);
            case ConstantsMaster.regexUrl.timeInLane.test(url):
                return accessibleReports.includes(ConstantsMaster.appScreens.report.timeInLane);
            case ConstantsMaster.regexUrl.practiceStaffingCaseServed.test(url):
                return accessibleReports.includes(ConstantsMaster.appScreens.report.practiceStaffingCaseServed);
            case ConstantsMaster.regexUrl.affiliateTimeInPractice.test(url):
                return accessibleReports.includes(ConstantsMaster.appScreens.report.affiliateTimeInPractice);
            case ConstantsMaster.regexUrl.individualResourceDetails.test(url):
                return accessibleReports.includes(ConstantsMaster.appScreens.report.weeklyDeploymentIndividualResourceDetails);
            case ConstantsMaster.regexUrl.overAllocationAudit.test(url):
                return accessibleReports.includes(ConstantsMaster.appScreens.report.overAllocationAudit);
            case ConstantsMaster.regexUrl.allocatedWhileOnLOAAudit.test(url):
                return accessibleReports.includes(ConstantsMaster.appScreens.report.allocatedWhileOnLOAAudit);
            case ConstantsMaster.regexUrl.caseUpdatesAudit.test(url):
                return accessibleReports.includes(ConstantsMaster.appScreens.report.caseUpdatesAudit);
            case ConstantsMaster.regexUrl.capacitybreakdown.test(url):
                return accessibleReports.includes(ConstantsMaster.appScreens.report.capacityBreakdown);
            case ConstantsMaster.regexUrl.priceRealization.test(url):
                return accessibleReports.includes(ConstantsMaster.appScreens.report.priceRealization);
            case ConstantsMaster.regexUrl.caseEconomics.test(url):
                return accessibleReports.includes(ConstantsMaster.appScreens.report.caseEconomics);
            case ConstantsMaster.regexUrl.whoWorkedWithWhom.test(url):
                return accessibleReports.includes(ConstantsMaster.appScreens.report.whoWorkedWithWhom);
            case ConstantsMaster.regexUrl.smapAllocations.test(url):
                return accessibleReports.includes(ConstantsMaster.appScreens.report.smapAllocations);
            case ConstantsMaster.regexUrl.caseExperience.test(url):
                return accessibleReports.includes(ConstantsMaster.appScreens.report.caseExperience);
            default:
                return false;
        }

    }

    unauthorizedAccess(accessibleReports) {
        if (accessibleReports.some(x => x.includes(ConstantsMaster.appScreens.page.analytics))) {
            var reports = accessibleReports.filter(x => x.includes(ConstantsMaster.appScreens.page.analytics));
            var redirectTo = reports.filter(x => x !== (ConstantsMaster.appScreens.page.analytics))[0];
            this.router.navigate([`/${redirectTo}`]);
            return false;
        }
    }
}

