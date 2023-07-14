// Angular Modules
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// Third party Modules
import { AppBootstrapModule } from '../shared/app-bootstrap.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatDialogModule } from '@angular/material/dialog';
import { PopoverModule } from 'ngx-bootstrap/popover';

// Components
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';
import { HeaderComponent } from './header/header.component';
import { NotificationComponent } from './notification/notification.component';
import { OfficeClosureComponent } from './office-closure/office-closure.component';
import { RingfenceOverlayComponent } from './ringfence-overlay/ringfence-overlay.component';

// Services
import { CoreService } from './core.service';
import { Logger } from './logger.service';
import { SharedModule } from '../shared/shared.module';
import { SiteMaintainanceComponent } from './site-maintainance/site-maintainance.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FeatureAccessModule } from '../feature-access/feature-access.module';
import { HeaderSkeletonComponent } from './header-skeleton/header-skeleton.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ResourceAssignmentService } from '../overlay/behavioralSubjectService/resourceAssignment.service';
import { OverlayMessageService } from '../overlay/behavioralSubjectService/overlayMessage.service';
import { OverlayService } from '../overlay/overlay.service';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { SearchResourceComponent } from './searchbar/search-resource/search-resource.component';
import { SearchCaseComponent } from './searchbar/search-case/search-case.component';
import { SeachbarService } from './searchbar/searchbar.service';
import { LaunchDarklyService } from './services/launch-darkly.service';
import { UrlService } from './services/url.service';
import { MatTabsModule } from '@angular/material/tabs';
import { UserPreferencesMessageService } from './user-preferences-message.service';
import { UserPreferencesService } from './user-preferences.service';
import { CasePlanningWhiteboardService } from '../case-planning-whiteboard/case-planning-whiteboard.service';

@NgModule({
  declarations: [
    AccessDeniedComponent,
    SiteMaintainanceComponent,
    EmployeeProfileComponent,
    HeaderComponent,
    NotificationComponent,
    HeaderSkeletonComponent,
    RingfenceOverlayComponent,
    OfficeClosureComponent,
    SearchbarComponent,
    SearchResourceComponent,
    SearchCaseComponent
  ],
  imports: [
    AppBootstrapModule,
    CommonModule,
    FormsModule,
    RouterModule,
    PopoverModule.forRoot(),
    MatDialogModule,
    NgMultiSelectDropDownModule.forRoot(),
    SharedModule,
    ScrollingModule,
    FeatureAccessModule,
    MatProgressBarModule,
    MatTabsModule
  ],
  entryComponents: [
    NotificationComponent
  ],
  exports: [AccessDeniedComponent, HeaderComponent, HeaderSkeletonComponent],
  providers: [
    CoreService,
    Logger,
    ResourceAssignmentService,
    OverlayMessageService,
    OverlayService,
    SeachbarService,
    LaunchDarklyService,
    UrlService,
    UserPreferencesService,
    UserPreferencesMessageService,
    CasePlanningWhiteboardService
  ]
})
export class CoreModule { }
