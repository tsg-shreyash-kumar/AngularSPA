import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilterComponent } from './filter.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { FAKE_OFFICES } from '../../../shared/mocks/mock-home-service';
import { FAKE_EMPLOYEE } from "../../../shared/mocks/mock-core-service";
import { By } from '@angular/platform-browser';
import * as moment from 'moment';
import { SimpleChange } from '@angular/core';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FilterComponent],
      imports: [NgMultiSelectDropDownModule, FormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    component.offices = FAKE_OFFICES;
    component.homeOffice = FAKE_EMPLOYEE.office;
    fixture.detectChanges();
  });

  describe('- UnitTests - ', () => {

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should get offices on init', () => {
      expect(component.offices).toEqual(FAKE_OFFICES);
    });

    it('should get homeOffice on init', () => {
      expect(component.homeOffice).toEqual(FAKE_EMPLOYEE.office);
    });

    it('should set isNewDemandChecked to true by default', () => {
      expect(component.isNewDemandChecked).toBeTruthy();
    });

    it('should set dropDownSettings on initialization', () => {
      //Arrange
      const expectedDropDownSettings = {
        singleSelection: false,
        idField: 'officeCode',
        itemsShowLimit: 1,
        textField: 'officeName',
        allowSearchFilter: true,
        enableCheckAll: false
      }
      //Assert
      expect(Object.assign({}, component.officeDropdownSettings)).toEqual(jasmine.objectContaining(Object.assign({}, expectedDropDownSettings)));
    })

    it('should set datePicker input value to current 2 weeks on initialization', () => {
      //Arrange
      const today = new Date();

      //Assert
      expect(Object.assign({}, component.selectedDateRange.startDate)).toEqual(jasmine.objectContaining(Object.assign({}, today)));
      expect(Object.assign({}, component.selectedDateRange.endDate)).
        toEqual(jasmine.objectContaining(Object.assign({}, new Date(today.setDate(today.getDate() + 14)))));

    })

    it('getProjectsBySelectedOffice should emit "getProjects" event with current 2 weeks date range by default',
      (done) => {
        //Arrange
        const testOffices = [{ officeCode: 110 }, { officeCode: 112 }];
        component.selectedOfficeList = testOffices;
        const today = new Date();

        component.getProjects.subscribe(event => {
          //Assert
          expect(event.officeCodes).toBe("110,112");
          expect(Object.assign({}, event.dateRange.startDate)).toEqual(jasmine.objectContaining(Object.assign({}, today)));
          expect(Object.assign({}, event.dateRange.endDate)).
            toEqual(jasmine.objectContaining(Object.assign({}, new Date(today.setDate(today.getDate() + 14)))));
          done();
        });

        //Act        
        component.getProjectsBySelectedOffice();
      });

    it('getProjectsBySelectedOffice should emit "getProjects" event with selected date range',
      (done) => {
        //Arrange
        const testOffices = [{ officeCode: 110 }, { officeCode: 112 }];
        component.selectedOfficeList = testOffices;
        const today = new Date();
        component.selectedDateRange = {
          startDate: new Date(today.setDate(today.getDate() + 14)),
          endDate: new Date(today.setDate(today.getDate() + 20))
        }

        component.getProjects.subscribe(event => {
          //Assert
          expect(event.officeCodes).toBe("110,112");
          expect(Object.assign({}, event.dateRange.startDate))
            .toEqual(jasmine.objectContaining(Object.assign({}, new Date(today.setDate(today.getDate() + 14)))));
          expect(Object.assign({}, event.dateRange.endDate))
            .toEqual(jasmine.objectContaining(Object.assign({}, new Date(today.setDate(today.getDate() + 20)))));
          done();
        });

        //Act        
        component.getProjectsBySelectedOffice();
      });

    it('getProjectsforSelectedDateRange should emit "getProjects" event with selected date range',
      (done) => {
        //Arrange
        const testOffices = [{ officeCode: 110 }, { officeCode: 112 }];
        component.selectedOfficeList = testOffices;
        let selectedDateRange = {
          startDate: moment().subtract(1, 'month').startOf('month'),
          endDate: moment().subtract(1, 'month').endOf('month')
        };
        const expectedStartDate = selectedDateRange.startDate.toDate();
        const expectedEndDate = selectedDateRange.endDate.toDate();


        component.getProjects.subscribe(event => {
          //Assert
          expect(event.officeCodes).toBe("110,112");
          expect(Object.assign({}, event.dateRange.startDate))
            .toEqual(jasmine.objectContaining(Object.assign({}, expectedStartDate)));
          expect(Object.assign({}, event.dateRange.endDate)).
            toEqual(jasmine.objectContaining(Object.assign({}, expectedEndDate)));
          done();
        });

        //Act        
        component.getProjectsforSelectedDateRange(selectedDateRange);
      });

    it('shiftDateRange should left shift date range by 1 week',
      (done) => {
        //Arrange
        const testOffices = [{ officeCode: 110 }, { officeCode: 112 }];
        component.selectedOfficeList = testOffices;
        const today = new Date();
        const currentEndDate = component.selectedDateRange.endDate;
        const expectedStartDate = new Date(today.setDate(today.getDate() - 7));
        const expectedEndDate = new Date(currentEndDate.setDate(currentEndDate.getDate() - 7));


        component.getProjects.subscribe(event => {
          //Assert
          expect(event.officeCodes).toBe("110,112");
          expect(Object.assign({}, event.dateRange.startDate))
            .toEqual(jasmine.objectContaining(Object.assign({}, expectedStartDate)));
          expect(Object.assign({}, event.dateRange.endDate)).
            toEqual(jasmine.objectContaining(Object.assign({}, expectedEndDate)));
          expect(Object.assign({}, component.selectedDateRange.startDate))
            .toEqual(jasmine.objectContaining(Object.assign({}, expectedStartDate)));
          expect(Object.assign({}, component.selectedDateRange.endDate)).
            toEqual(jasmine.objectContaining(Object.assign({}, expectedEndDate)));
          done();
        });

        //Act        
        component.shiftDateRange('left');
      });

    it('shiftDateRange should Right shift date range by 1 week',
      (done) => {
        //Arrange
        const testOffices = [{ officeCode: 110 }, { officeCode: 112 }];
        component.selectedOfficeList = testOffices;
        const today = new Date();
        const currentEndDate = component.selectedDateRange.endDate;
        const expectedStartDate = new Date(today.setDate(today.getDate() + 7));
        const expectedEndDate = new Date(currentEndDate.setDate(currentEndDate.getDate() + 7));


        component.getProjects.subscribe(event => {
          //Assert
          expect(event.officeCodes).toBe("110,112");
          expect(Object.assign({}, event.dateRange.startDate))
            .toEqual(jasmine.objectContaining(Object.assign({}, expectedStartDate)));
          expect(Object.assign({}, event.dateRange.endDate)).
            toEqual(jasmine.objectContaining(Object.assign({}, expectedEndDate)));
          expect(Object.assign({}, component.selectedDateRange.startDate))
            .toEqual(jasmine.objectContaining(Object.assign({}, expectedStartDate)));
          expect(Object.assign({}, component.selectedDateRange.endDate)).
            toEqual(jasmine.objectContaining(Object.assign({}, expectedEndDate)));
          done();
        });

        //Act        
        component.shiftDateRange('right');
      });

    it('showHideActiveCases should emit "toggleActiveCasesVisibility" event',
      (done) => {
        //Arrange
        component.isNewDemandChecked = false;

        component.toggleActiveCasesVisibility.subscribe(newDemandCheckBoxStatus => {
          //Assert
          expect(newDemandCheckBoxStatus).toBe(true);
          done();
        });

        //Act
        component.showHideActiveCases();
      });

    it('should select New Delhi (404) office if user\'s home office is BCC(332)', () => {
      //Arrange
      component.homeOffice.officeCode = 332;

      //Act
      //directly call ngOnChanges
      component.ngOnChanges({
        homeOffice: new SimpleChange(null, component.homeOffice, true),
        offices: new SimpleChange(null, component.offices, true)
      });

      //Assert
      expect(component.selectedOfficeList[0].officeCode.toString()).toContain("404");
    });

    it('should select office same as loggedIn User\'s home office', () => {
      //Arrange
      component.homeOffice.officeCode = 110;

      //Act
      //directly call ngOnChanges
      component.ngOnChanges({
        homeOffice: new SimpleChange(null, component.homeOffice, true),
        offices: new SimpleChange(null, component.offices, true)
      });

      //Assert
      expect(component.selectedOfficeList[0].officeCode.toString()).toContain(component.homeOffice.officeCode);
    });

  });

  describe('- IntegrationTests -', () => {

    it('should isNewDemandChecked to false on clicking New Demand checkbox', () => {
      //Arrange
      const el = fixture.debugElement.query(By.css("#new-demand")).nativeElement;

      //Act
      el.click();
      fixture.detectChanges();

      //Assert
      expect(component.isNewDemandChecked).toBeFalsy();

    });

    it('should trigger showHideActiveCases() on clicking New Demand checkbox', () => {
      //Arrange
      const el = fixture.debugElement.query(By.css("#new-demand")).nativeElement;
      spyOn(component, 'showHideActiveCases');

      //Act
      el.click();
      fixture.detectChanges();

      //Assert
      expect(component.showHideActiveCases).toHaveBeenCalled();

    });

    it('should trigger shiftDateRange() on clicking left arrow button', () => {
      //Arrange
      const el = fixture.debugElement.query(By.css("#btnDateShiftLeft")).nativeElement;
      spyOn(component, 'shiftDateRange');

      //Act
      el.click();
      fixture.detectChanges();

      //Assert
      expect(component.shiftDateRange).toHaveBeenCalledWith('left');

    });

    it('should trigger shiftDateRange() on clicking Right arrow button', () => {
      //Arrange
      const el = fixture.debugElement.query(By.css("#btnDateShiftRight")).nativeElement;
      spyOn(component, 'shiftDateRange');
      //Act
      el.click();
      fixture.detectChanges();

      //Assert
      expect(component.shiftDateRange).toHaveBeenCalledWith('right');

    });

  });
});
