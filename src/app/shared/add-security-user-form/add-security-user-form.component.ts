import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { debounceTime, mergeMap } from 'rxjs/operators';
import { BS_DEFAULT_CONFIG } from '../constants/bsDatePickerConfig';
import { DateService } from '../dateService';
import { Resource } from '../interfaces/resource.interface';
import { NotificationService } from '../notification.service';
import { PopupDragService } from '../services/popupDrag.service';
import { SharedService } from '../shared.service';
import { ValidationService } from '../validationService';
import { LocalStorageService } from 'src/app/shared/local-storage.service';
import { ConstantsMaster } from '../constants/constantsMaster';
import { OfficeHierarchy } from '../interfaces/officeHierarchy.interface';
import { Office } from '../interfaces/office.interface';
import { ServiceLineHierarchy } from '../interfaces/serviceLineHierarchy';
import { PracticeArea } from '../interfaces/practiceArea.interface';
import { PositionHierarchy } from '../interfaces/positionHierarchy.interface';
import { SecurityRole } from '../interfaces/securityRole.interface';
import { LevelGrade } from 'src/app/shared/interfaces/levelGrade.interface';
import { CommitmentType } from 'src/app/shared/interfaces/commitmentType.interface';
import { UserPersonaType } from 'src/app/shared/interfaces/userPersonaType';


@Component({
    selector: 'app-add-security-user-form',
    templateUrl: './add-security-user-form.component.html',
    styleUrls: ['./add-security-user-form.component.scss'],
})
export class AddSecurityUserFormComponent implements OnInit {
   
    public users: Resource[];
    public asyncUsersSearchString: string;
    public selectedUserToAdd;
    public userExceptionList;
    public headerText = '';
    public primaryBtnText = 'Select';
    public invalidAdminUser = false;
    public bsConfig: Partial<BsDatepickerConfig>;
    public isEndDateInvalid: boolean = false;
    public endDate = null;
    public adminNotes = '';
    public validationSummaryMsg = '';

    //data sources for dropdowns
    
    officeHierarchy: OfficeHierarchy[];
    officeDropdownList;
    selectedOfficeList = [];

    serviceLinesHierarchy: ServiceLineHierarchy[];
    serviceLinesDropdownList;
    selectedServiceLinesList = [];
    
    positionsHierarchy: PositionHierarchy[] = [];
    positionsDropdownList;
    selectedPositionsList = [];

    levelGradesHierarchy: LevelGrade[];
    levelGradesDropdownList;
    selectedLevelGradesList = []; 

    ringfences: CommitmentType[];
    ringfenceDropdownList;
    selectedRingfenceDropdownList = [];
    
    practiceAreaDropDownList;
    practiceAreas: PracticeArea[] = [];
    selectedPracticeAreaList = [];

    securityRoles: SecurityRole[] = [];
    visibleSecurityRoleIds: number[] = [1,2,3,10];
    securityRolesDropdownList;
    selectedSecurityRole : number = 3;

    userPersonaTypesDropdownList;
    userPersonaTypes: UserPersonaType[] = [];
    selectedUserPersonaTypesList= '';

    geoTypelist = ConstantsMaster.UserGeotype;
    selectedGeoTypeList = '';
   
    validationMessage: string='';
    

    @Input() loggedInUserHomeOffice: Office;
    @Output() getSelectedUserEventEmitter = new EventEmitter<any>();
    
    
    constructor(public bsModalRef: BsModalRef,
        private sharedService: SharedService,
        private _popupDragService: PopupDragService,
        private notificationService: NotificationService,
        private localStorageService: LocalStorageService) { }

    ngOnInit() {
        this._popupDragService.dragEvents();
        this.attachEventForUserSearch();
        this.initialiseDatePicker();
        this.getLookUpDataForDropdowns();
        this.intilializeDropDowns();    
    }

    getLookUpDataForDropdowns() {

    this.officeHierarchy = this.localStorageService.get(ConstantsMaster.localStorageKeys.officeHierarchy);
    this.serviceLinesHierarchy = this.localStorageService.get(ConstantsMaster.localStorageKeys.serviceLinesHierarchy);
    this.positionsHierarchy = this.localStorageService.get(ConstantsMaster.localStorageKeys.positionsHierarchy);
    this.levelGradesHierarchy = this.localStorageService.get(ConstantsMaster.localStorageKeys.levelGradesHierarchy);
    this.practiceAreas = this.localStorageService.get(ConstantsMaster.localStorageKeys.capabilityPracticeAreas);
    this.ringfences = this.localStorageService.get(ConstantsMaster.localStorageKeys.ringfences).filter(x => x.commitmentTypeCode !== 'PS');
    this.userPersonaTypes = this.localStorageService.get(ConstantsMaster.localStorageKeys.userPersonaTypes);
    const securityRoles: SecurityRole[] = this.localStorageService.get(ConstantsMaster.localStorageKeys.securityRoles);
    this.securityRoles = securityRoles.filter(x => this.visibleSecurityRoleIds.some(code => code === x.roleCode));

  }

  intilializeDropDowns() {

    this.serviceLinesDropdownList = {
      text: 'All',
      value: 0,
      checked: false,
      children: this.serviceLinesHierarchy.map((item) => {
        return {
          text: item.text,
          value: item.value,
          collapsed: true,
          children: item.children != null ? item.children.map(child => {
            return {
              text: child.text,
              value: child.value,
              checked: false
            };
          }) : null,
          checked: false
        };
      })
    };


    this.positionsDropdownList = {
      text: 'All',
      value: 0,
      checked: false,
      children: this.positionsHierarchy.map((item) => {
        return {
          text: item.text,
          value: item.value,
          collapsed: true,
          children: item.children != null ? item.children.map(child => {
            return {
              text: child.text,
              value: child.value,
              checked: false
            };
          }) : null,
          checked: false
        };
      })
    };


    this.levelGradesDropdownList = {
      text: 'All',
      value: 0,
      checked: false,
      children: this.levelGradesHierarchy.map((item) => {
        return {
          text: item.text,
          value: item.value,
          collapsed: true,
          children: item.children != null ? item.children.map(child => {
            return {
              text: child.text,
              value: child.value,
              checked: false
            };
          }) : null,
          checked: false
        };
      })
    };

    this.ringfences = this.ringfences.filter(type => type.commitmentTypeCode != '');
    this.ringfenceDropdownList = {
      text: 'All',
      value: 0,
      checked: false,
      children: this.ringfences.map(x => {
        return {
          text: x.commitmentTypeName,
          value: x.commitmentTypeCode,
          checked: false
        };
      })
    };

    this.practiceAreaDropDownList = {
      text: 'All',
      value: 0,
      checked: false,
      children: this.practiceAreas.map(x => {
        return {
          text: x.practiceAreaName,
          value: x.practiceAreaCode,
          checked: false
        };
      })
    };


    this.securityRolesDropdownList = this.securityRoles.map(data => {
      return {
        "text": data.roleName,
        "value": data.roleCode
      }
    })

    this.userPersonaTypesDropdownList = this.userPersonaTypes.map(data => {
      return {
        "text": data.userTypeName,
        "value": data.userTypeCode
      }
    })

    this.geoTypelist=this.geoTypelist.map(data =>{
      return{
        "text": data.text,
        "value": data.text
      }
    })

  }

  
  setSelectedOfficeList(officeDropdownList) {
    this.selectedOfficeList = officeDropdownList.split(',');
  }

  setSelectedServiceLinesDropdownList(serviceLinesDropdownList) {
    this.selectedServiceLinesList = serviceLinesDropdownList.split(',');
  }

  setSelectedPositionsDropdownList(positionsDropdownList) {
    this.selectedPositionsList = positionsDropdownList.split(',');
  }

  setSelectedLevelGradesDropdownList(levelGradesDropdownList) {
    this.selectedLevelGradesList = levelGradesDropdownList.split(',');
  }

  setSelectedRingfenceDropdownList(ringfenceDropdownList) {
    this.selectedRingfenceDropdownList = ringfenceDropdownList.split(',');
  }

  setSelectedPracticeAreaList(practiceAreaCodes) {
    this.selectedPracticeAreaList = practiceAreaCodes.split(',');
  }


  setSelectedSecurityList(securityRoles) {
    this.selectedSecurityRole = securityRoles.value;
  }

  setSelectedUserPersonaTypesDropdownList(userPersonaTypesDropdownList) {
    this.selectedUserPersonaTypesList = userPersonaTypesDropdownList.value;
  }

  setSelectedGeoTypeList(geoTypelist) {
    this.selectedGeoTypeList = geoTypelist.value;
  }



    initialiseDatePicker() {
        this.bsConfig = BS_DEFAULT_CONFIG;
        this.bsConfig.containerClass = 'theme-red calendar-align-right';
    }

    typeaheadOnSelect(data) {
        if (this.userExceptionList?.length > 0 && this.isUserExistsInExceptionList(data.item.employeeCode)) {
            this.notificationService.showWarning(ValidationService.selectedUserAlreadyExist, 'Warning');
            this.resetForm();
        } else {
            this.invalidAdminUser = false;
            this.selectedUserToAdd = data.item;
            this.resetValidationSummary();
        }
    }

    isValidUser() {
        if (this.isUserSelectedAndNotEmpty()) {
            this.invalidAdminUser = false;
        } else {
            this.invalidAdminUser = true;
        }
    }

    closeForm() {
        this.bsModalRef.hide();
    }

    resetForm() {
        this.asyncUsersSearchString = null;
        this.selectedUserToAdd = '';
    }

    onEndDateChange(date) {
        if (date === null || ValidationService.validateDate(date).isValid) {
            this.isEndDateInvalid = false;
            this.resetValidationSummary();
            this.endDate = date === null ? date : DateService.convertDateInBainFormat(date);
        } else {
            this.isEndDateInvalid = true;
        }
    }


    onAddUserClick() {
        if (this.validateAddAdminUserObject()) {

            if(!this.selectedSecurityRole){
              this.validationMessage = "Please select a BOSS role";
            }

            else{
              this.getSelectedUserEventEmitter.emit({ user: this.selectedUserToAdd,  
                                                    endDate: this.endDate, 
                                                    notes: this.adminNotes,
                                                    roleCode: this.selectedSecurityRole,
                                                    userTypeCode: this.selectedUserPersonaTypesList,
                                                    geoType: this.selectedGeoTypeList,
                                                    officeCodes: this.selectedOfficeList?.join(),
                                                    serviceLineCodes: this.selectedServiceLinesList?.join(),
                                                    positionGroupCodes: this.selectedPositionsList?.join(),
                                                    levelGrades: this.selectedLevelGradesList?.join(),
                                                    practiceAreaCodes: this.selectedPracticeAreaList?.join(),
                                                    ringfenceCodes: this.selectedRingfenceDropdownList?.join()
                                                    });
            
              this.closeForm();
            }
        }
    }

    private validateAddAdminUserObject() {
        if (!this.isUserSelectedAndNotEmpty()) {
            this.validationSummaryMsg = ValidationService.invalidAdminUserMsg;
            this.resetForm();
            return false;
        }
        if (this.endDate !== null && !ValidationService.validateDate(this.endDate).isValid) {
            this.validationSummaryMsg = ValidationService.dateInvalidMessage;
            return false;
        }
        this.resetValidationSummary();
        return true;
    }

    typeaheadNoResultsHandler(event: boolean): void {
        this.invalidAdminUser = event;
    }

    resetValidationSummary() {
        this.validationSummaryMsg = '';
    }

    private isUserExistsInExceptionList(employeeCode: string) {
        return this.userExceptionList.some((securityUser) => securityUser.employeeCode.toLowerCase() === employeeCode.toLowerCase());
    }

    private isUserSelectedAndNotEmpty() {
        return !!this.selectedUserToAdd && !!this.asyncUsersSearchString && !this.invalidAdminUser;
    }

    private attachEventForUserSearch() {
        this.users = Observable.create((observer: any) => {
            observer.next(this.asyncUsersSearchString);
        }).pipe(
            debounceTime(1000),
            mergeMap((token: string) => this.sharedService.getResourcesBySearchString(token))
        );
    }
}
