import { Component, OnInit, OnDestroy } from '@angular/core';
import { Employee } from '../../shared/interfaces/employee.interface';
import { CoreService } from '../core.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { NotificationComponent } from '../notification/notification.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NotificationService } from 'src/app/shared/notification.service';
import { UserNotification } from 'src/app/shared/interfaces/userNotification.interface';
import { Subject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ConstantsMaster } from 'src/app/shared/constants/constantsMaster';
import { RingfenceOverlayComponent } from '../ringfence-overlay/ringfence-overlay.component';
import { OfficeClosureComponent } from '../office-closure/office-closure.component';
import { UserPreferenceSupplyGroup } from 'src/app/shared/interfaces/userPreferenceSupplyGroup';
import { UserPreferencesService } from '../user-preferences.service';
import { UserPreferencesMessageService } from '../user-preferences-message.service';
import { UserPreferenceSupplyGroupSharedInfo } from 'src/app/shared/interfaces/UserPreferenceSupplyGroupSharedInfo';
import { LocalStorageService } from 'src/app/shared/local-storage.service';
import { CasePlanningPlaygroundService } from '../services/case-planning-playground.service';
import { StaffingSettingsComponent } from 'src/app/shared/staffing-settings/staffing-settings.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  // -----------------------Local Variables--------------------------------------------//
  destroy$: Subject<boolean> = new Subject<boolean>();
  employee: Employee;
  // showNotifications = false;
  notificationDialogRef: MatDialogRef<NotificationComponent, any>;
  bsModalRef: BsModalRef;
  userNotifications: UserNotification[];
  unreadNotificationsCount;
  activeTab = ConstantsMaster.appScreens.page.home;
  routerSub;
  environmentName = '';
  prevRoute: string;
  disableNotification = false;
  appScreens: any;
  supplyGroupSharedInfoToUpsert: UserPreferenceSupplyGroupSharedInfo;
  playgroundId: string = null;

  constructor(private coreService: CoreService,
    public dialog: MatDialog,
    private modalService: BsModalService,
    private notificationService: NotificationService,
    private router: Router,
    private userPreferencesService: UserPreferencesService,
    private userpreferencesMessageService: UserPreferencesMessageService,
    private localStorageService: LocalStorageService,
    private casePlanningPlaygroundService: CasePlanningPlaygroundService,
    private notifyService: NotificationService
  ) {

    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeTab = this.getTabSelected(event.url.toLowerCase());
        if (this.prevRoute !== event.url) {
          this.tabChangeHandler();
        }
        this.prevRoute = event.url;
        this.disableNotification = this.activeTab === 'analytics' || this.activeTab === 'admin' || this.activeTab === 'commitments' || false;
      }
    });
  }

  // -----------------------Component LifeCycle Events and Functions--------------------------------------------//
  ngOnInit() {
    this.employee = this.coreService.loggedInUser;
    this.environmentName = environment.name.toLowerCase();
    this.appScreens = ConstantsMaster.appScreens;

    if (!this.coreService.loggedInUser?.token)
      return;

    this.subscribeServices();

    if (!this.playgroundId)
      this.setPlaygroundIdFromLocalStorage();
  }

  // -------------------Component Event Handlers-------------------------------------//

  subscribeServices() {
    this.coreService.userNotifications.subscribe(notifications => {
      this.unreadNotificationsCount = notifications.filter(n => n.notificationStatus === 'U').length;
    });
    this.coreService.userPreferences.subscribe(next => {
      this.getUserNotification();
    });

    this.casePlanningPlaygroundService.selectedPlaygroundId$.subscribe((value) => {
      this.playgroundId = value;
    });
  }

  getUserNotification() {
    this.coreService.getUserNotifications().subscribe(notifications => {
      this.coreService.userNotifications.next(notifications);
      this.userNotifications = notifications;
      this.unreadNotificationsCount = notifications.filter(n => n.notificationStatus === 'U').length;
    });
  }

  toggleNotificationPopup() {
    if (this.notificationDialogRef == null) {
      this.openNotificationPopup();
      // this.showNotifications = true;
    } else {
      this.notificationDialogRef.componentInstance.closeDialog();
      // this.showNotifications = false;
    }
  }

  openRingFenceOverlay() {
    const config = {
      animated: true,
      ignoreBackdropClick: true,
      class: 'rf-screen-modal'
    };

    this.bsModalRef = this.modalService.show(RingfenceOverlayComponent, config);
  };

  openNotificationPopup() {
    if (this.notificationDialogRef == null) {
      this.notificationDialogRef = this.dialog.open(NotificationComponent, {
        closeOnNavigation: true,
        data: {
          showDialog: true,
          userNotifications: this.userNotifications
        }
      });
    }

    this.notificationDialogRef.beforeClosed().subscribe(result => {
      this.notificationDialogRef = null;
    });
  }

  openSupplySettingsPopoverHandler() {
    // class is required to center align the modal on large screens
    const config = {
      ignoreBackdropClick: true,
      class: 'modal-dialog-centered'
    };
    this.bsModalRef = this.modalService.show(StaffingSettingsComponent, config);

    this.bsModalRef.content.saveUserPreferences.subscribe(userPreferences => {
      if (userPreferences.employeeCode) {
        this.updateUserPreferences(userPreferences);
      } else {
        this.insertUserPreferences(userPreferences);
      }
    });

    this.bsModalRef.content.upsertUserPreferenceSupplyGroups.subscribe(userPreferencesSupplyGroups => {
      if (userPreferencesSupplyGroups.length) {
        this.upsertUserPreferenceSupplyGroups(userPreferencesSupplyGroups);
      }
    });

    this.bsModalRef.content.upsertUserPreferenceSupplyGroupSharedInfo.subscribe(userPreferenceSupplyGroupSharedInfo => {
      if (userPreferenceSupplyGroupSharedInfo.length) {
        this.upsertUserPreferenceSupplyGroupSharedInfo(userPreferenceSupplyGroupSharedInfo);
      }
    })

    this.bsModalRef.content.deleteUserPreferenceSupplyGroupByIds.subscribe(deletedGroupIds => {
      if (deletedGroupIds) {
        this.deleteUserPreferenceSupplyGroupByIds(deletedGroupIds);
      }
    });

    this.bsModalRef.content.saveAllUserPreferences.subscribe(allUserPreferencesToSave => {
      if (allUserPreferencesToSave) {
        this.saveAllUserPreferences(allUserPreferencesToSave);
      }
    });

  }

  saveAllUserPreferences(allUserPreferencesToSave) {
    this.userPreferencesService.saveAllUserPreferences(allUserPreferencesToSave)
      .subscribe(
        (data) => {
          this.coreService.setAllUserPreferences(allUserPreferencesToSave.userPreferences, allUserPreferencesToSave.userPreferencesSupplyGroups);
          this.notificationService.showSuccess('Staffing Settings saved Successfully');
        },
        (error) => {
          this.notificationService.showError('Error while saving Staffing Settings');
        }
      );
  }

  insertUserPreferences(userPreferences) {
    this.coreService.insertUserPreferences(userPreferences).subscribe(
      (data) => {
        this.coreService.setUserPreferences(data);
        this.notificationService.showSuccess('Staffing Settings saved');
      },
      (error) => {
        this.notificationService.showError('Error while saving Staffing Settings');
      }
    );
  }

  updateUserPreferences(userPreferences) {
    this.coreService.updateUserPreferences(userPreferences).subscribe(
      (data) => {
        this.coreService.setUserPreferences(data);
        this.notificationService.showSuccess('Staffing Settings saved');
      },
      (error) => {
        this.notificationService.showError('Error while saving Staffing Settings');
      }
    );
  }

  upsertUserPreferenceSupplyGroups(userPreferencesSupplyGroups: UserPreferenceSupplyGroup[]) {
    this.userPreferencesService.upsertUserPreferencesSupplyGroups(userPreferencesSupplyGroups)
      .subscribe(upsertedData => {
        // userPreferencesSupplyGroups.id = upsertedData[0].id;
        this.userpreferencesMessageService.triggerUserPreferencesSupplyGroupsRefresh(upsertedData);
        this.notificationService.showSuccess('Supply Group Saved successfully');

        // const supplyGroupSharedInfoToUpsert : UserPreferenceSupplyGroupSharedInfo[] = [{
        //   sharedWith: upsertedData[0].lastUpdatedBy,
        //   isDefault: userPreferencesSupplyGroups[0].isDefault,
        //   userPreferenceSupplyGroupId: upsertedData[0].id,
        //   lastUpdatedBy: upsertedData[0].lastUpdatedBy
        // }]
        // this.userPreferencesService.updateUserPreferenceSupplyGroupSharedInfo(supplyGroupSharedInfoToUpsert)
        // .subscribe( upsertedSharedInfo => {
        //   //this.notificationService.showSuccess('Supply Group Shared successfully');
        // });
      });
  }

  upsertUserPreferenceSupplyGroupSharedInfo(userPrefenceSupplyGroupSharedInfo: UserPreferenceSupplyGroupSharedInfo[]) {
    this.userPreferencesService.upsertUserPreferencesSupplyGroupSharedInfo(userPrefenceSupplyGroupSharedInfo)
      .subscribe(upsertedData => {
        this.notificationService.showSuccess('Supply Group Shared successfully');
      });
  }

  deleteUserPreferenceSupplyGroupByIds(deletedGroupIds) {
    this.userPreferencesService.deleteUserPreferenceSupplyGroupByIds(deletedGroupIds)
      .subscribe((deletedData => {
        this.notificationService.showSuccess('Supply Group Deleted successfully');
      }));
  }

  getTabSelected(url) {
    switch (true) {
      case ConstantsMaster.regexUrl.overlay.test(url) && url.includes('reporttype'):
        return this.appScreens.page.analytics;
      case ConstantsMaster.regexUrl.overlay.test(url):
        return this.appScreens.page.home;
      case ConstantsMaster.regexUrl.analytics.test(url):
        return this.appScreens.page.analytics;
      case ConstantsMaster.regexUrl.admin.test(url):
        return this.appScreens.page.admin;
      case ConstantsMaster.regexUrl.casePlanning.test(url):
        return this.appScreens.page.casePlanning;
      case ConstantsMaster.regexUrl.resources.test(url):
        return this.appScreens.page.resources;
      default:
        return url;
    }
  }

  tabChangeHandler() {
    this.coreService.resetOldCaseCodeFromNotes();
    if (!!this.notificationDialogRef) {
      this.notificationDialogRef.componentInstance.closeDialog();
      // this.showNotifications = false;
    }
  }

  openOfficeClosureHandler() {
    const config = {
      ignoreBackdropClick: true,
      class: 'modal-dialog-centered'
    };
    this.bsModalRef = this.modalService.show(OfficeClosureComponent, config);
  }

  setPlaygroundIdFromLocalStorage() {
    const userPlaygroundSessionInfo = this.localStorageService.get(ConstantsMaster.localStorageKeys.userPlaygroundSession);
    this.playgroundId = userPlaygroundSessionInfo?.playgroundId;
  }

  // TODO: Make the user leave or exit Whiteboard based on if the user is creator or just joining the whiteboard.
  // exitPlayground() {
  //   this.localStorageService.removeItem(ConstantsMaster.localStorageKeys.userPlaygroundSession);
  //   this.casePlanningPlaygroundService.setPlaygroundId(null);
  //   this.notifyService.showSuccess("Whiteboard Session Left Successfully!!");
  // }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe(); // Unsubscribe from the subject itself
    this.routerSub.unsubscribe();
  }
}
