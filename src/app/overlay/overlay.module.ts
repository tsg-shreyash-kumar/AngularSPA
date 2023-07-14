// ----------------------- Angular Package References ----------------------------------//
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// -----------------------Angular  Module References ----------------------------------//
import { OverlayRoutingModule } from './overlay-routing.module';
import { SharedModule } from '../shared/shared.module';

// -----------------------External  Module References ----------------------------------//
import { AgGridModule } from 'ag-grid-angular';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MaterialModule } from '../shared/material.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FeatureAccessModule } from '../feature-access/feature-access.module';

// ----------------------- Component References ----------------------------------//
import { AgGridNotesComponent } from './ag-grid-notes/ag-grid-notes.component';
import { AgGridSplitAllocationPopUpComponent } from './ag-grid-split-allocation-pop-up/ag-grid-split-allocation-pop-up.component';
import { BackfillFormComponent } from '../shared/backfill-form/backfill-form.component';
import { CaseRollFormComponent } from '../shared/case-roll-form/case-roll-form.component';
import { GanttCaseComponent } from './gantt/gantt-case/gantt-case.component';
import { GanttResourceComponent } from './gantt/gantt-resource/gantt-resource.component';
import { ResourceOverlayComponent } from './resource-overlay/resource-overlay.component';
import { OverlayComponent } from './overlay.component';
import { ProjectOverlayComponent } from './project-overlay/project-overlay.component';
import { ProjectHeaderComponent } from './project-overlay/project-header/project-header.component';
import { QuickAddFormComponent } from '../shared/quick-add-form/quick-add-form.component';
import { ResourceOverlayHeaderComponent } from './resource-overlay/resource-overlay-header/resource-overlay-header.component';
import { SkuTabListComponent } from './sku-tab-list/sku-tab-list.component';
import { SkuTabComponent } from './sku-tab/sku-tab.component';
import { SystemconfirmationFormComponent } from '../shared/systemconfirmation-form/systemconfirmation-form.component';
import { AboutComponent } from './about/about.component';
import { EmployeeCertificateComponent } from './about/employee-certificate/employee-certificate.component';
import { EmployeeLanguageComponent } from './about/employee-language/employee-language.component';
import { EmployeeLevelGradeChangesComponent } from './about/employee-level-grade-changes/employee-level-grade-changes.component';
import { EmployeeSchoolHistoryComponent } from './about/employee-school-history/employee-school-history.component';
import { EmployeeWorkHistoryComponent } from './about/employee-work-history/employee-work-history.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { PreferenceListComponent } from './preferences/preference-list/preference-list.component';
import { EmployeeStaffableAsListComponent } from './about/employee-staffable-as-list/employee-staffable-as-list.component';
import { EmployeeStaffableAsComponent } from './about/employee-staffable-as-list/employee-staffable-as/employee-staffable-as.component';
import { CaseEconomicsComponent } from './case-economics/case-economics.component';
import { ResourceRatingsComponent } from './resource-ratings/resource-ratings.component';

// ----------------------- Service References ----------------------------------//
import { AddTeamDialogService } from './dialogHelperService/addTeamDialog.service';
import { BackfillDialogService } from './dialogHelperService/backFillDialog.service';
import { CaseRollService } from './behavioralSubjectService/caseRoll.service';
import { CaseRollDialogService } from './dialogHelperService/caseRollDialog.service';
import { CommitmentsService } from './../shared/commitments.service';
import { NotesDialogService } from './dialogHelperService/notesDialog.service';
import { OpportunityService } from './behavioralSubjectService/opportunity.service';
import { OverlayMessageService } from './behavioralSubjectService/overlayMessage.service';
import { OverlayDialogService } from './dialogHelperService/overlayDialog.service';
import { OverlayService } from './overlay.service';
import { PlaceholderAssignmentService } from './behavioralSubjectService/placeholderAssignment.service';
import { QuickAddDialogService } from './dialogHelperService/quickAddDialog.service';
import { PlaceholderDialogService } from './dialogHelperService/placeholderDialog.service';
import { ResourceAssignmentService } from './behavioralSubjectService/resourceAssignment.service';
import { ResourceCommitmentService } from './behavioralSubjectService/resourceCommitment.service';
import { SkuCaseTermService } from './behavioralSubjectService/skuCaseTerm.service';
import { SplitAllocationDialogService } from './dialogHelperService/splitAllocationDialog.service';
import { UserPreferenceService } from './behavioralSubjectService/userPreference.service';
import { ResourcesCommitmentsDialogService } from './dialogHelperService/resourcesCommitmentsDialog.service';
import { ResourceStaffableAsService } from './behavioralSubjectService/resourceStaffableAs.service';
import { ShowQuickPeekDialogService } from './dialogHelperService/show-quick-peek-dialog.service';
import { OverlappedTeamDialogService } from './dialogHelperService/overlapped-team-dialog.service';
import { EmployeeTransferComponent } from './about/employee-transfer/employee-transfer.component';
import { PegOpportunityDialogService } from './dialogHelperService/peg-opportunity-dialog.service';
import { CasePlanningWhiteboardService } from '../case-planning-whiteboard/case-planning-whiteboard.service';

@NgModule({
  declarations: [
    ResourceOverlayComponent,
    ProjectOverlayComponent,
    GanttResourceComponent,
    GanttCaseComponent,
    ProjectHeaderComponent,
    SkuTabListComponent,
    SkuTabComponent,
    OverlayComponent,
    AgGridNotesComponent,
    AgGridSplitAllocationPopUpComponent,
    ResourceOverlayHeaderComponent,
    AboutComponent,
    EmployeeCertificateComponent,
    EmployeeLanguageComponent,
    EmployeeLevelGradeChangesComponent,
    EmployeeSchoolHistoryComponent,
    EmployeeWorkHistoryComponent,
    PreferencesComponent,
    PreferenceListComponent,
    EmployeeStaffableAsListComponent,
    EmployeeStaffableAsComponent,
    CaseEconomicsComponent,
    ResourceRatingsComponent,
    EmployeeTransferComponent
  ],
  entryComponents: [
    ResourceOverlayComponent,
    ProjectOverlayComponent,
    QuickAddFormComponent,
    BackfillFormComponent,
    SystemconfirmationFormComponent,
    CaseRollFormComponent,
    AgGridNotesComponent,
    AgGridSplitAllocationPopUpComponent],
  imports: [
    CommonModule,
    OverlayRoutingModule,
    MatSlideToggleModule,
    MaterialModule,
    SharedModule,
    InfiniteScrollModule,
    ScrollingModule,
    AgGridModule.withComponents([]),
    TabsModule.forRoot(),
    FeatureAccessModule
  ],
  exports: [
    ResourceOverlayComponent,
    ProjectOverlayComponent,
  ],
  providers: [
    OverlayService,
    ResourceAssignmentService,
    ResourceCommitmentService,
    SkuCaseTermService,
    UserPreferenceService,
    OverlayMessageService,
    OpportunityService,
    CaseRollService,
    CommitmentsService,
    OverlayDialogService,
    QuickAddDialogService,
    PlaceholderDialogService,
    NotesDialogService,
    CaseRollDialogService,
    BackfillDialogService,
    OverlappedTeamDialogService,
    SplitAllocationDialogService,
    AddTeamDialogService,
    PlaceholderAssignmentService,
    ResourcesCommitmentsDialogService,
    ResourceStaffableAsService,
    ShowQuickPeekDialogService,
    PegOpportunityDialogService,
    CasePlanningWhiteboardService
  ]
})
export class OverlayModule { }
