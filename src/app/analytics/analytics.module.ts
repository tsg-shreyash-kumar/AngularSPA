import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalyticsComponent } from './analytics.component';
import { AnalyticsRoutingModule } from './analytics-routing.module';
import { StaffingReportComponent } from './staffing-report/staffing-report.component';
import { ResourceAvailabilityComponent } from './resource-availability/resource-availability.component';
import { IndividualResourceDetailsComponent } from './individual-resource-details/individual-resource-details.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { WeeklyDeploymentSummaryComponent } from './weekly-deployment-summary/weekly-deployment-summary.component';
import { RingfenceStaffingComponent } from './ringfence-staffing/ringfence-staffing.component';
import { OverAllocatedAuditComponent } from './over-allocated-audit/over-allocated-audit.component';
import { AllocatedOnLoaAuditComponent } from './allocated-on-loa-audit/allocated-on-loa-audit.component';
import { CapacityBreakdownComponent } from './capacity-breakdown/capacity-breakdown.component';
import { PriceRealizationComponent } from './price-realization/price-realization.component';
import { CaseUpdatesAuditComponent } from './case-updates-audit/case-updates-audit.component';
import { StaffingAllocationsMonthlyComponent } from './staffing-allocations-monthly/staffing-allocations-monthly.component';
import { MonthlyDeploymentComponent } from './monthly-deployment/monthly-deployment.component';
import { MonthlyPracticeAreaStaffingComponent } from './monthly-practice-area-staffing/monthly-practice-area-staffing.component';
import { PracticeStaffingCaseServedComponent } from './practice-staffing-case-served/practice-staffing-case-served.component';
import { CommitmentDetailsComponent } from './commitment-details/commitment-details.component';
import { CaseEconomicsComponent } from './case-economics/case-economics.component';
import { TimeInLaneComponent } from './time-in-lane/time-in-lane.component';
import { MaterialModule } from '../shared/material.module';
import { ShareUrlComponent } from './common/share-url/share-url.component';
import { FeatureAccessModule } from '../feature-access/feature-access.module';
import { HistoricalAllocationsForPromotionsComponent } from './historical-allocations-for-promotions/historical-allocations-for-promotions.component';
import { WhoWorkedWithWhomComponent } from './who-worked-with-whom/who-worked-with-whom.component';
import { AffiliateTimeInPracticeComponent } from './affiliate-time-in-practice/affiliate-time-in-practice.component';
import { SmapAllocationsComponent } from './smap-allocations/smap-allocations.component';
import { MonthlyFteUtilizationComponent } from './monthly-fte-utilization-container/monthly-fte-utilization/monthly-fte-utilization.component';
import { MonthlyFteUtilizationIndividualComponent } from './monthly-fte-utilization-container/monthly-fte-utilization-individual/monthly-fte-utilization-individual.component';
import { CaseExperienceComponent } from './case-experience/case-experience.component';
// import { TestResponsiveReportComponent } from './test-responsive-report/test-responsive-report.component';

@NgModule({
  declarations: [
    AnalyticsComponent,
    StaffingReportComponent,
    ResourceAvailabilityComponent,
    IndividualResourceDetailsComponent,
    WeeklyDeploymentSummaryComponent,
    RingfenceStaffingComponent,
    OverAllocatedAuditComponent,
    AllocatedOnLoaAuditComponent,
    CapacityBreakdownComponent,
    PriceRealizationComponent,
    CaseUpdatesAuditComponent,
    StaffingAllocationsMonthlyComponent,
    MonthlyDeploymentComponent,
    MonthlyPracticeAreaStaffingComponent,
    PracticeStaffingCaseServedComponent,
    CommitmentDetailsComponent,
    CaseEconomicsComponent,
    TimeInLaneComponent,
    ShareUrlComponent,
    HistoricalAllocationsForPromotionsComponent,
    WhoWorkedWithWhomComponent,
    AffiliateTimeInPracticeComponent,
    SmapAllocationsComponent,
    MonthlyFteUtilizationComponent,
    MonthlyFteUtilizationIndividualComponent,
    CaseExperienceComponent,
    // TestResponsiveReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AnalyticsRoutingModule,
    PopoverModule.forRoot(),
    MaterialModule,
    FeatureAccessModule
  ]
})
export class AnalyticsModule { }
