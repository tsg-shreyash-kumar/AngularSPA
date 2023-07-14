import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';
import { debounceTime} from 'rxjs/operators';
import { CoreService } from 'src/app/core/core.service';
import { SecurityUserDetail } from 'src/app/shared/interfaces/securityUserDetail';
import { AddSecurityUserFormComponent } from 'src/app/shared/add-security-user-form/add-security-user-form.component';
import { SystemconfirmationFormComponent } from 'src/app/shared/systemconfirmation-form/systemconfirmation-form.component';
import { ConstantsMaster } from 'src/app/shared/constants/constantsMaster';
import { CommitmentType } from 'src/app/shared/interfaces/commitmentType.interface';
import { OfficeHierarchy } from 'src/app/shared/interfaces/officeHierarchy.interface';
import { LocalStorageService } from 'src/app/shared/local-storage.service';
import { LevelGrade } from 'src/app/shared/interfaces/levelGrade.interface';
import { ServiceLineHierarchy } from 'src/app/shared/interfaces/serviceLineHierarchy';
import { PracticeArea } from 'src/app/shared/interfaces/practiceArea.interface';
import { PositionHierarchy } from 'src/app/shared/interfaces/positionHierarchy.interface';
import * as moment from 'moment';
// --------------------------Redux Component -----------------------------------------//
import * as adminActions from '../State/admin.actions';
import * as fromAdmin from '../State/admin.selectors';
import * as adminState from '../State/admin.state';
import { DateService } from 'src/app/shared/dateService';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InlineEditableNotesComponent } from 'src/app/shared/inline-editable-notes/inline-editable-notes.component';
import { GridOptions, } from 'ag-grid-enterprise';
import {  FirstDataRenderedEvent, RowDataTransaction} from 'ag-grid-community';
import { AgGridMultiSelectComponent } from 'src/app/shared/ag-grid-multi-select/ag-grid-multi-select.component';
import { ServiceLine } from 'src/app/shared/constants/enumMaster';
import { Office } from 'src/app/shared/interfaces/office.interface';
import { Position } from 'src/app/shared/interfaces/position.interface';
import { AgGridOfficeDropdownComponent } from 'src/app/shared/ag-grid-office-dropdown/ag-grid-office-dropdown.component';
import { CheckboxRenderer } from "src/app/shared/ag-grid-checkbox-renderer/checkbox-renderer.component";
import { ValidationService } from 'src/app/shared/validationService';
import { SecurityRole } from 'src/app/shared/interfaces/securityRole.interface';
import { UserPersonaType } from 'src/app/shared/interfaces/userPersonaType';
import { PracticeRingfencesComponent } from '../practice-ringfences/practice-ringfences.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {
  public securityUsersDetails;
  public modalRef: BsModalRef;
  public bsModalRef: BsModalRef;
  public filteredUsers;
  private searchFilter$: Subject<string> = new Subject();
  public storeSub: Subscription = new Subscription();
  public showProgressBar = false;
  editNotesDialogRef: MatDialogRef<InlineEditableNotesComponent, any>;
  @ViewChild('staffingUsersSearchInput', { static: true }) staffingUsersSearchInput: ElementRef;
  ringFences: CommitmentType[] = [];
  officeHierarchy: OfficeHierarchy;
  officesFlat: Office[];
  levelGrades: LevelGrade[] = [];
  serviceLines: ServiceLineHierarchy[] = [];
  serviceLinesFlat: ServiceLine[] = [];
  practiceAreas: PracticeArea[] = [];
  positionsHierarchy: PositionHierarchy[] = [];
  positionsList: Position[] = [];
  userTypeList: UserPersonaType[] = [];
  geoTypelist = ConstantsMaster.UserGeotype;
  securityRoles: SecurityRole[] = [];

  // AG Grid
  public components;
  public frameworkComponents;
  public rowData: any[] = [];
  // public rowData: any[] | null = immutableStore;
  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public localCellStyles = {
    "color": "#000",
    "font-size": "12px",
  };

  

  constructor(private modalService: BsModalService,
    private coreService: CoreService,
    private store: Store<adminState.State>,
    public dialog: MatDialog,private localStorageService: LocalStorageService) {
  }
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  gridOptions: GridOptions ={
     context: {
       componentParent: this,
     },
     rowClassRules: {
      'terminated': function(params) { return params.data.isTerminated; },
  },

    frameworkComponents:{
      agEmployeeEditor: AgGridMultiSelectComponent
    },

    getRowId: (params) => params.data.employeeCode,

  };
 // Function to load set AG Grid options
 loadGridConfigurations() {

  this.defaultColDef = {

    cellStyle: this.localCellStyles,
    sortable: true, // can sort by client, project name, etc
    filter: true, // can search for case
    editable: true,
    resizable: true,
  };

  this.columnDefs = [
    {
      headerName:"Name",
      field: "fullName",
      minWidth: 150,
      editable: false,
      valueGetter: function (params) {

       let fullName=params.data.fullName;
        if (params.data.isTerminated) {
          fullName += ' (Alumni)'
        }
        return fullName;
      }
    },
    {
      headerName:"Title",
      field: "jobTitle",
      minWidth: 150,
      editable: false,
    },
    {
      headerName: 'Boss User Type', field: 'userTypeCode', minWidth: 150,
      cellEditor: 'agRichSelectCellEditor',
      cellEditorParams: {
        cellHeight: 35,
        values: this.userTypeList.map(userType =>
          userType.userTypeName),
      },
      valueGetter: function (params) {

        let userTypeName = '';
        if (params.data.userTypeCode) {
          userTypeName = params.context.componentParent.userTypeList.find(x => params.data.userTypeCode === x.userTypeCode)?.userTypeName
        }
        return userTypeName;
      },
      valueSetter: function (params) {
        if(params.newValue){
          params.data.userTypeCode = params.context.componentParent.userTypeList.find(x => params.newValue === x.userTypeName)?.userTypeCode;
        }else
        {
          params.data.userTypeCode = '';
        }

        return true;
      }
    },
    {
      headerName: 'Staffing Geo Type', field: 'geoType', minWidth: 150,
      cellEditor: 'agRichSelectCellEditor',
      cellEditorParams: {
        cellHeight: 35,
        values: this.geoTypelist.map(geoType =>
          geoType.text),
      }
    },
    {
      headerName: 'Staffing Geo Name',
      field: "officeCodes",
      minWidth: 250,
      cellEditor:AgGridOfficeDropdownComponent,
      cellEditorParams: {
        cellHeight: 45,
         values: this.officeHierarchy
       },
       valueGetter: function (params) {
         if(params.data.officeCodes){
           const officeCodes = params.data.officeCodes;
           const officeNames = params.context.componentParent.officesFlat.filter(x => officeCodes.includes(x.officeCode)).map(x => x.officeName).join(",");
           return officeNames;
         }

       },
       valueSetter: function (params) {
         if(params.newValue){
           params.data.officeCodes = params.newValue.join(",");
         }else
         {
           params.data.officeCodes = '';

         return true;
       }
      }
    },
    {
      headerName: 'Staffing Service Line',
      field: "serviceLineCodes",
      minWidth: 210,
      cellEditor:AgGridMultiSelectComponent,
      cellEditorParams: {
        cellHeight: 45,
        values: this.serviceLines,
        dropdownTitle : 'Service Lines',
        dropdownTypeCode : 'H'
      },
      valueGetter: function (params) {
        if(params.data.serviceLineCodes){
          const serviceLineCodes = params.data.serviceLineCodes;
          const serviceLineNames= params.context.componentParent.serviceLinesFlat.filter(x => serviceLineCodes.includes(x.serviceLineCode)).map(x => x.serviceLineName).join(",");
          return serviceLineNames;

        }
      },
      valueSetter: function (params) {
        if(params.newValue){
          params.data.serviceLineCodes = params.newValue.join(",");
        }else
        {
          params.data.serviceLineCodes = '';
        }

        return true;
      }
    },
    {
      headerName: 'Staffing Position Group',
      field: "positionGroupCodes",
      minWidth: 250,
      cellEditor:AgGridMultiSelectComponent,
      cellEditorParams: {
        cellHeight: 45,
        values: this.positionsHierarchy,
        dropdownTitle : 'Position Groups',
        dropdownTypeCode : 'H'
      },
      valueGetter: function (params) {
        if(params.data.positionGroupCodes){
          const positionGroupCodes = params.data.positionGroupCodes;
          const positionNames = params.context.componentParent.positionsList.filter(x => positionGroupCodes.includes(x.positionCode)).map(x => x.defaultJobTitle).join(",");
          return positionNames;

        }
      },
      valueSetter: function (params) {
        if(params.newValue){
          params.data.positionGroupCodes = params.newValue.join(",");
        }else
        {
          params.data.positionGroupCodes = '';
        }

        return true;
      }
    },
    {
      field: "levelGrades",
      headerName:'Staffing Level Grade',
      minWidth: 250,
      cellEditor:AgGridMultiSelectComponent,
      cellEditorParams: {
        cellHeight: 45,
        values: this.levelGrades,
        dropdownTitle : 'Level Grades',
        dropdownTypeCode : 'H'
      },
      valueSetter: function (params) {
        if(params.newValue){
          params.data.levelGrades = params.newValue.join(",");
        }else
        {
          params.data.levelGrades = '';
        }

        return true;
      }
    },
    {
      headerName:'Staffing Practice',
      field: "practiceAreaCodes",
      minWidth: 250,
      cellEditor:AgGridMultiSelectComponent,
      cellEditorParams: {
        cellHeight: 45,
        values: this.practiceAreas,
        dropdownTitle : 'Practice Areas'
      },
      valueGetter: function (params) {

        if(params.data.practiceAreaCodes){
          const practiceAreaCodes = params.data.practiceAreaCodes;
          const practiceAreaNames = params.context.componentParent.practiceAreas?.filter(x => practiceAreaCodes.includes(x.practiceAreaCode)).map(x => x.practiceAreaName).join(",");
          return practiceAreaNames;
        }

      },
      valueSetter: function (params) {
        if(params.newValue){
          params.data.practiceAreaCodes = params.newValue.join(",");
        }else
        {
          params.data.practiceAreaCodes = '';
        }

        return true;
      }
    },
    {
      headerName:'Staffing Ringfence',
      field: "ringfenceCodes",
      minWidth: 200,
      cellEditor:AgGridMultiSelectComponent,
      cellEditorParams: {
        cellHeight: 45,
        values: this.ringFences,
        dropdownTitle : 'Ringfences'
      },
      valueGetter: function (params) {

        if(params.data.ringfenceCodes){
          const ringfenceCodes = params.data.ringfenceCodes;
          const ringfenceNames = params.context.componentParent.ringFences.filter(x => ringfenceCodes.includes(x.commitmentTypeCode)).map(x => x.commitmentTypeName).join(",");
          return ringfenceNames;
        }

      },
      valueSetter: function (params) {
        if(params.newValue){
          params.data.ringfenceCodes = params.newValue.join(",");
        }else
        {
          params.data.ringfenceCodes = '';
        }

        return true;
      }
    },
    {
      headerName:"Staffing Role", field: "roleCode", minWidth: 150,
      cellEditor: 'agRichSelectCellEditor',
      cellEditorParams: {
        cellHeight: 35,
        values: this.securityRoles.map(roles =>
          roles.roleName),
      },
      valueGetter: function (params) {

        let roleName = '';
        if (params.data.roleCode) {
          roleName = params.context.componentParent.securityRoles.find(x => params.data.roleCode === x.roleCode)?.roleName
        }
        return roleName;
      },
      valueSetter: function (params) {
        if(params.newValue){
          params.data.roleCode = params.context.componentParent.securityRoles.find(x => params.newValue === x.roleName)?.roleCode;
        }else
        {
          params.data.roleCode = '';
        }

        return true;
      }
    },
    {
      field: "override",
      maxWidth: 120,
      editable: false,
      sortable: false,
      cellStyle: this.localCellStyles,
      cellRenderer: "checkboxRenderer",
      menuTabs: ["filterMenuTab"],
    },
    {
      headerName: 'End Date', field: 'endDate', maxWidth: 140,
      editable: true,
      comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
        return Date.parse(valueA) - Date.parse(valueB);
      },
      cellStyle: this.localCellStyles,
      valueGetter: params => {
        return DateService.convertDateInBainFormat(params.data.endDate);
      },
      valueSetter: function (params) {
        if (params.newValue==="") {
          const updatedData = Object.assign({}, params.data);
          updatedData.endDate = params.newValue;
          params.data.endDate = updatedData.endDate;
          return true;
        }
        if(ValidationService.isValidDate(params.newValue)){
          const updatedData = Object.assign({}, params.data);
          updatedData.endDate = params.newValue;
          params.data.endDate = updatedData.endDate;
          return true;
        }
         return false;
      },
      filter: 'agDateColumnFilter',
      filterParams: {
        applyButton: true,
        clearButton: true,
        comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
          return Date.parse(valueA) - Date.parse(valueB);
        },
      }
    },
    {
      field: "notes",
      maxWidth: 150,
      cellStyle: this.localCellStyles,
      menuTabs: ["filterMenuTab"],
    },
    {
      headerName: "Modified By",
      field: "lastUpdatedBy",
      editable: false,
      maxWidth: 150,
      menuTabs: ["filterMenuTab"],
    },
    {
      headerName: "Last Modified",
      field: "lastUpdated",
      editable: false,
      sortable: true,
      maxWidth: 150,
      menuTabs: ["filterMenuTab"],
      comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
        return Date.parse(valueA) - Date.parse(valueB);
      },
      valueGetter: params => {
        return DateService.convertDateInBainFormat(params.data.lastUpdated);
      },
    },
    {
      headerName: '',
      field: "Action",
      maxWidth: 150,
      filter:false,
      editable: false,
      cellRenderer: function (params) {
        return '<button class="btn btn-sm btn-outline-danger btn-delete ag-cell-delete-btn">Delete</button>';
      }
    },
  ];
  this.components = { datePicker: this.getDatePicker() };
  this.frameworkComponents = {
    checkboxRenderer: CheckboxRenderer
  };
}

getDatePicker() {
  function Datepicker() { }
  Datepicker.prototype.init = function (params) {
    this.eInput = document.createElement('input');
    this.eInput.id = 'datePicker';
    this.eInput.type = 'date';
    this.eInput.classList.add('aggrid-datePicker');
    this.eInput.value = DateService.formatDate(params.value);
    this.eInput.style.height = '100%';
    this.eInput.setAttribute('data-date', params.value);
    this.eInput.setAttribute('data-date-format', 'DD-MMM-YYYY');
    this.eInput.onchange = function () {
      const el = <HTMLInputElement>document.getElementById('datePicker');
      const formattedDate = moment(el.value, 'YYYY-MM-DD').format(el.getAttribute('data-date-format'));
      el.setAttribute('data-date', formattedDate);
    };
  };
  Datepicker.prototype.getGui = function () {
    return this.eInput;
  };
  Datepicker.prototype.afterGuiAttached = function () {
    this.eInput.focus();
    this.eInput.select();
  };
  Datepicker.prototype.getValue = function () {
    if(this.eInput.value==="1970-01-01")
    {
      return null;
    }
    return DateService.convertDateInBainFormat(this.eInput.value);
  };
  Datepicker.prototype.destroy = function () { };
  Datepicker.prototype.isPopup = function () {
    return true;
  };
  return Datepicker;
}


// this will prevent re-rendering of the html table when
// a row is inserted/updated/deleted
getUniqueIdentifier(index: Number, user: SecurityUserDetail) {
  return user.employeeCode;
}

  ngOnInit() {
    this.getLookUpdataFromLocalStorage();
    this.loadGridConfigurations();
    this.setStoreSubscription();
    this.getSecurityUsersDetails();
    this.attachSearchFilterSubsciption();
  }

  getLookUpdataFromLocalStorage() {

    this.officeHierarchy = this.localStorageService.get(ConstantsMaster.localStorageKeys.officeHierarchy);
    this.officesFlat = this.localStorageService.get(ConstantsMaster.localStorageKeys.OfficeList);
    this.levelGrades = this.localStorageService.get(ConstantsMaster.localStorageKeys.levelGradesHierarchy);
    this.serviceLines = this.localStorageService.get(ConstantsMaster.localStorageKeys.serviceLinesHierarchy);
    this.serviceLinesFlat = this.localStorageService.get(ConstantsMaster.localStorageKeys.serviceLines);
    this.positionsHierarchy = this.localStorageService.get(ConstantsMaster.localStorageKeys.positionsHierarchy);
    this.positionsList = this.localStorageService.get(ConstantsMaster.localStorageKeys.positions);
    this.practiceAreas = this.localStorageService.get(ConstantsMaster.localStorageKeys.practiceAreas);
    this.securityRoles = this.localStorageService.get(ConstantsMaster.localStorageKeys.securityRoles);

    this.userTypeList = this.localStorageService.get(ConstantsMaster.localStorageKeys.userPersonaTypes);
    this.ringFences = this.localStorageService.get(ConstantsMaster.localStorageKeys.ringfences).filter(x => x.commitmentTypeCode !== 'PS'); //exclude PEG Syrge from RF
  }

  // openEditNotesDialog(notes, employeeCode) {
  //   const config = {
  //     class: 'modal-dialog-centered',
  //     ignoreBackdropClick: true,
  //     initialState: {
  //       inputNotes: notes,
  //       uniqueId: employeeCode,
  //       maxLength: 1000
  //     }
  //   };

  //   this.bsModalRef = this.modalService.show(InlineEditableNotesComponent, config);
  //   this.bsModalRef.content.updateNotesEventEmitter.subscribe(data => {
  //     this.updateNotes(data);
  //   });
  // }

  // updateNotes(data) {
  //   let userToUpdate: SecurityUserDetail = this.getUserToUpdate(data.uniqueId);
  //   if (data.updatedNotes !== userToUpdate.notes?.trim()) {
  //     userToUpdate.notes = data.updatedNotes;
  //     this.updateSecurityUser(userToUpdate);
  //   }
  // }

  dateUpdatedEventEmitterHandler(data) {
    let userToUpdate: SecurityUserDetail = this.getUserToUpdate(data.employeeCode);
    let updatedDate = DateService.convertDateInBainFormat(userToUpdate.endDate);
    data.updatedDate = DateService.convertDateInBainFormat(data.updatedDate)
    if (data.updatedDate !== updatedDate) {
      userToUpdate.endDate = data.updatedDate;
      this.updateSecurityUser(userToUpdate);
    }
  }

  deleteSecurityUser(securityUserDetails: SecurityUserDetail) {
    const confirmationPopUpBodyMessage = 'Are you sure you want to delete ' + securityUserDetails.fullName + ' from the database ?';
    const config = {
      class: 'modal-dialog-centered',
      ignoreBackdropClick: true,
      initialState: {
        confirmationPopUpBodyMessage: confirmationPopUpBodyMessage
      }
    };
    this.bsModalRef = this.modalService.show(SystemconfirmationFormComponent, config);
    this.bsModalRef.content.deleteResourceNote.subscribe(() => {
      this.confirmDeleteSecurityUser(securityUserDetails.employeeCode);
    });
  }

  openAddRingfenceModal() {
    const config = {
      class: 'modal-dialog-centered',
      ignoreBackdropClick: true
    };

    this.bsModalRef = this.modalService.show(PracticeRingfencesComponent, config);
    this.bsModalRef.content.upsertPracticeBasedRingfenceEmitter.subscribe((selectedPracticeBaseRinfence) => {
      this.upsertPracticeBasedRingfence(selectedPracticeBaseRinfence);
    });
  }

    private upsertPracticeBasedRingfence(praticeBasedRingfence: CommitmentType) {
    this.store.dispatch(
      new adminActions.UpsertPracticeBasedRingfence(praticeBasedRingfence)
    );
  }

  openAddUserModal() {
    const config = {
      class: 'modal-dialog-centered',
      ignoreBackdropClick: true,
      initialState: {
        userExceptionList: this.securityUsersDetails,
        headerText: 'Add Security User',
        primaryBtnText: 'Add'
      }
    };

    this.bsModalRef = this.modalService.show(AddSecurityUserFormComponent, config);
    this.bsModalRef.content.getSelectedUserEventEmitter.subscribe((userData) => {
      this.addUserHandler(userData);
    });
  }

  addUserHandler(userData) {

    const addNewStaffingUserReqObj : SecurityUserDetail= {
      employeeCode: userData.user.employeeCode,
      lastUpdatedBy: this.coreService.loggedInUser.fullName,
      lastUpdated: DateService.getBainFormattedToday(),
      serviceLine: userData.user.serviceLine.serviceLineName,
      jobTitle: userData.user.levelName,
      isAdmin: false,
      fullName: userData.user.fullName,
      isTerminated: userData.user.isTerminated,

      roleCode: userData.roleCode,
      userTypeCode: userData.userTypeCode,
      geoType: userData.geoType,
      officeCodes: userData.officeCodes,
      serviceLineCodes: userData.serviceLineCodes,
      positionGroupCodes: userData.positionGroupCodes,
      levelGrades: userData.levelGrades,
      practiceAreaCodes: userData.practiceAreaCodes,
      ringfenceCodes: userData.ringfenceCodes,

      override: false,
      notes: userData.notes,
      endDate: userData.endDate
    };

   
    this.addNewStaffingUser(addNewStaffingUserReqObj);
  }

  searchFilterHandler(event) {
    this.searchFilter$.next(event.target.value);
  }

  ngOnDestroy() {
    this.storeSub.unsubscribe();
  }

  private getUserToUpdate(employeeCode) {
    return this.filteredUsers.find(emp => emp.employeeCode === employeeCode);
  }

  private confirmDeleteSecurityUser(employeeCode: string) {
    this.showHideStaffingUsersLoader(true);
    this.store.dispatch(
      new adminActions.DeleteSaffingUser(employeeCode)
    );

    //this.gridOptions.api.applyTransaction({ remove: employeeCode})

    var rowNode = this.gridApi.getRowNode(employeeCode.toString());

    let index = this.rowData.findIndex(i => i.employeeCode == rowNode.data.employeeCode);
    this.rowData.splice(index, 1);
    this.gridApi.applyTransaction({ remove: [rowNode.data] });

  }

  private setStoreSubscription() {
    this.setLoadStaffingUsersSusbscription();
    this.setLoaderSubscription();
  }

  private setLoadStaffingUsersSusbscription() {
    this.storeSub.add(this.store.pipe(
      select(fromAdmin.getStaffingUsers)
    ).subscribe((staffingUsers: SecurityUserDetail[]) => {
      //TODO: hack to prevent auto-sorting on every save

      if(this.filteredUsers?.length){
        //this.filteredUsers = staffingUsers;
      }else{
        this.filteredUsers = this.securityUsersDetails = this.sortSecurityUsersByDate(staffingUsers);
      }


      this.rowData=this.filteredUsers;
      //this.staffingUsersSearchInput.nativeElement.value = '';
    }));

  }

  private setLoaderSubscription() {
    this.storeSub.add(this.store.pipe(
      select(fromAdmin.staffingUsersLoader)
    ).subscribe((staffingUsersLoader: boolean) => {
      this.showProgressBar = staffingUsersLoader;
    }));
  }

  private addNewStaffingUser(addNewStaffingUserReqObj: any) {
    this.showHideStaffingUsersLoader(true);
    this.store.dispatch(
      new adminActions.UpsertSecurityUser(addNewStaffingUserReqObj)
    );

    //this.gridOptions.api.applyTransaction({ add: addNewStaffingUserReqObj})

    const res= addNewStaffingUserReqObj;
    this.rowData.unshift(res);
        let row: RowDataTransaction = { add: [res], addIndex: 0 }
        this.gridApi.applyTransaction(row);

  }

  private sortSecurityUsersByDate(securityUsersDetails: SecurityUserDetail[]) {
    return securityUsersDetails.sort((a, b) => <any>new Date(b.lastUpdated) - <any>new Date(a.lastUpdated));
  }

  private filterUsersBySearchString(searchTextValue) {
    if (searchTextValue.length < 1) {
      this.filteredUsers = this.securityUsersDetails;
    }else{
      this.filteredUsers = this.securityUsersDetails.filter(securityUser => {
        if (!!securityUser.fullName) {
          return (
            securityUser.fullName.toLowerCase().includes(searchTextValue.trim().toLowerCase())
            || securityUser.employeeCode === searchTextValue.trim()
          );
        }
      });
    }

    this.rowData = this.filteredUsers;
  }

  private updateSecurityUser(data: SecurityUserDetail) {

    const updateRequestObj = {
      lastUpdatedByName: this.coreService.loggedInUser.fullName,
      employeeCode: data.employeeCode,
      serviceLine: data.serviceLine,
      jobTitle: data.jobTitle,
      fullName: data.fullName,
      isTerminated: data.isTerminated,
      isAdmin: data.isAdmin,
      override: data.override,
      notes: data.notes,
      endDate: data.endDate,
      
      roleCode: data.roleCode,
      userTypeCode: data.userTypeCode,
      geoType: data.geoType,
      officeCodes: data.officeCodes,
      serviceLineCodes: data.serviceLineCodes,
      positionGroupCodes: data.positionGroupCodes,
      levelGrades: data.levelGrades,
      practiceAreaCodes: data.practiceAreaCodes,
      ringfenceCodes: data.ringfenceCodes

      
    };
    
    this.showHideStaffingUsersLoader(true);
    this.store.dispatch(
      new adminActions.UpsertSecurityUser(updateRequestObj)
    );

    this.gridApi.setRowData(this.rowData);
    var rowNode = this.gridApi.getRowNode(updateRequestObj.employeeCode.toString());

    rowNode.data.lastUpdatedBy = this.coreService.loggedInUser.fullName;
    rowNode.data.lastUpdated = DateService.getBainFormattedToday();

    this.gridApi.applyTransaction({ update: [rowNode] });

  }

  private attachSearchFilterSubsciption() {
    this.searchFilter$.pipe(
      debounceTime(500)
    ).subscribe(searchTextValue => {
      this.filterUsersBySearchString(searchTextValue);
    });
  }

  private getSecurityUsersDetails() {
    this.showHideStaffingUsersLoader(true);
    this.store.dispatch(
      new adminActions.LoadStaffingUsers()
    );
  }

  private showHideStaffingUsersLoader(value: boolean) {
    this.store.dispatch(
      new adminActions.ShowHideStaffingUsersLoader(value)
    );
  }

  onAgGridCellClick($event){
    if ($event.colDef.field === 'Action') {
      this.deleteSecurityUser($event.data);
    }
  }

  onCellValueChanged(params) {
    if (!(params.newValue === params.oldValue)) {
      const data = params.data;
      this.updateSecurityUser(data);
    }
  }

}
