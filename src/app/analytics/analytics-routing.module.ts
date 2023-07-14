import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StaffingReportComponent } from './staffing-report/staffing-report.component';
import { AnalyticsComponent } from './analytics.component';
import { ResourceAvailabilityComponent } from './resource-availability/resource-availability.component';
import { IndividualResourceDetailsComponent } from './individual-resource-details/individual-resource-details.component';
import { WeeklyDeploymentSummaryComponent } from './weekly-deployment-summary/weekly-deployment-summary.component';
import { RingfenceStaffingComponent } from './ringfence-staffing/ringfence-staffing.component';
import { OverAllocatedAuditComponent } from './over-allocated-audit/over-allocated-audit.component';
import { AllocatedOnLoaAuditComponent } from './allocated-on-loa-audit/allocated-on-loa-audit.component';
import { CapacityBreakdownComponent } from './capacity-breakdown/capacity-breakdown.component';
import { PriceRealizationComponent } from './price-realization/price-realization.component';
import { CaseUpdatesAuditComponent } from './case-updates-audit/case-updates-audit.component';
import { ReportAuthGuardService as AuthGuard } from '../core/authentication/report-auth-guard.service';
import { StaffingAllocationsMonthlyComponent } from './staffing-allocations-monthly/staffing-allocations-monthly.component';
import { MonthlyDeploymentComponent } from './monthly-deployment/monthly-deployment.component';
import { MonthlyPracticeAreaStaffingComponent } from './monthly-practice-area-staffing/monthly-practice-area-staffing.component';
import { TimeInLaneComponent } from './time-in-lane/time-in-lane.component';
import { PracticeStaffingCaseServedComponent } from './practice-staffing-case-served/practice-staffing-case-served.component';
import { CommitmentDetailsComponent } from './commitment-details/commitment-details.component';
import { CaseEconomicsComponent } from './case-economics/case-economics.component';
import { TestResponsiveReportComponent } from './test-responsive-report/test-responsive-report.component';
import { HistoricalAllocationsForPromotionsComponent } from './historical-allocations-for-promotions/historical-allocations-for-promotions.component';
import { WhoWorkedWithWhomComponent } from './who-worked-with-whom/who-worked-with-whom.component';
import { AffiliateTimeInPracticeComponent } from './affiliate-time-in-practice/affiliate-time-in-practice.component';
import { SmapAllocationsComponent } from './smap-allocations/smap-allocations.component';
import { MonthlyFteUtilizationComponent } from './monthly-fte-utilization-container/monthly-fte-utilization/monthly-fte-utilization.component';
import { MonthlyFteUtilizationIndividualComponent } from './monthly-fte-utilization-container/monthly-fte-utilization-individual/monthly-fte-utilization-individual.component';
import { CaseExperienceComponent } from './case-experience/case-experience.component';

const routes: Routes = [
  { path: '', component: AnalyticsComponent, children: [
    {path: '',  redirectTo: 'weeklyDeploymentSummaryView', pathMatch: 'full'},
    {path: 'staffingAllocation', component: StaffingReportComponent, canActivate: [AuthGuard] },
    {path: 'staffingAllocationsMonthly', component: StaffingAllocationsMonthlyComponent, canActivate: [AuthGuard] },
    {path: 'historicalAllocationsForPromotions', component: HistoricalAllocationsForPromotionsComponent, canActivate: [AuthGuard] },
    {path: 'availability', component: ResourceAvailabilityComponent, canActivate: [AuthGuard] },
    {path: 'weeklyDeploymentIndividualResourceDetails', component: IndividualResourceDetailsComponent, canActivate: [AuthGuard] },
    {path: 'weeklyDeploymentSummaryView', component: WeeklyDeploymentSummaryComponent, canActivate: [AuthGuard] },
    {path: 'monthlyDeployment', component: MonthlyDeploymentComponent, canActivate: [AuthGuard] },
    {path: 'monthlyFTEUtilization', component: MonthlyFteUtilizationComponent, canActivate: [AuthGuard] },
    {path: 'monthlyFTEUtilizationIndividual', component: MonthlyFteUtilizationIndividualComponent, canActivate: [AuthGuard] },
    {path: 'practiceStaffing', component: MonthlyPracticeAreaStaffingComponent, canActivate: [AuthGuard] },
    {path: 'commitmentDetails', component: CommitmentDetailsComponent, canActivate: [AuthGuard] },
    {path: 'timeInLane', component: TimeInLaneComponent, canActivate: [AuthGuard] },
    {path: 'practiceStaffingCaseServed', component: PracticeStaffingCaseServedComponent, canActivate: [AuthGuard] },
    {path: 'ringfenceStaffing', component: RingfenceStaffingComponent, canActivate: [AuthGuard] },
    {path: 'overAllocatedAudit', component: OverAllocatedAuditComponent, canActivate: [AuthGuard] },
    {path: 'allocatedWhileOnLOAAudit', component: AllocatedOnLoaAuditComponent, canActivate: [AuthGuard] },
    {path: 'caseUpdatesAudit', component: CaseUpdatesAuditComponent, canActivate: [AuthGuard] },
    {path: 'capacityBreakdown', component: CapacityBreakdownComponent, canActivate: [AuthGuard] },
    {path: 'priceRealization', component: PriceRealizationComponent, canActivate: [AuthGuard] },
    {path: 'caseEconomics', component: CaseEconomicsComponent, canActivate: [AuthGuard] },
    {path: 'testResponsiveReport', component: TestResponsiveReportComponent, canActivate: [AuthGuard] },
    {path: 'whoWorkedWithWhom', component: WhoWorkedWithWhomComponent, canActivate: [AuthGuard]},
    {path: 'affiliateTimeInPractice', component: AffiliateTimeInPracticeComponent, canActivate: [AuthGuard]},
    {path: 'smapAllocations', component: SmapAllocationsComponent, canActivate: [AuthGuard]},
    {path: 'caseExperience', component: CaseExperienceComponent, canActivate: [AuthGuard]}
  ] }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AnalyticsRoutingModule { }
