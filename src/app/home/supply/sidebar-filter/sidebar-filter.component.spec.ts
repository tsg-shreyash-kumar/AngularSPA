// import { SimpleChange } from '@angular/core';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormsModule } from '@angular/forms';
// import { By } from '@angular/platform-browser';
// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
// import { FAKE_EMPLOYEE } from 'src/app/shared/mocks/mock-core-service';
// import { FAKE_OFFICES, FAKE_RESOURCEGROUPS } from 'src/app/shared/mocks/mock-home-service';
// import { SidebarFilterComponent } from './sidebar-filter.component';

// describe('SidebarFilterComponent', () => {
//   let component: SidebarFilterComponent;
//   let fixture: ComponentFixture<SidebarFilterComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [SidebarFilterComponent],
//       imports: [NgMultiSelectDropDownModule, FormsModule]
//     })
//       .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(SidebarFilterComponent);
//     component = fixture.componentInstance;
//     component.offices = FAKE_OFFICES;
//     component.homeOffice = FAKE_EMPLOYEE.office;
//     component.resourceLength = 0;
//     FAKE_RESOURCEGROUPS.resourcesbyoffices.forEach(groups => {
//       //component.resourceLength += groups.resources.length;
//       component.resourceLength += groups.resources.length;
//       groups.groupTitle = `${groups.groupTitle}s`;
//     });
//     fixture.detectChanges();
//   });
//   describe('- UnitTests - ', () => {

//     it('should create', () => {
//       expect(component).toBeTruthy();
//     });

//     it('should get offices on init', () => {
//       expect(component.offices).toEqual(FAKE_OFFICES);
//     });

//     it('should get resourceLength on init', () => {
//       //Arrange
//       let expectedResourceLength = 0
//       FAKE_RESOURCEGROUPS.resourcesbyoffices.forEach(groups => {
//         expectedResourceLength += groups.resources.length;
//         groups.groupTitle = `${groups.groupTitle}s`;
//       });
//       expect(component.resourceLength).toEqual(expectedResourceLength);
//     });

//     it('should get homeOffice on init', () => {
//       expect(component.homeOffice).toEqual(FAKE_EMPLOYEE.office);
//     });

//     it('should set officeDropdownSettings on initialization', () => {
//       //Arrange
//       const expectedDropDownSettings = {
//         singleSelection: false,
//         idField: 'officeCode',
//         textField: 'officeName',
//         allowSearchFilter: true,
//         enableCheckAll: false
//       }
//       //Assert
//       expect(Object.assign({}, component.officeDropdownSettings)).toEqual(jasmine.objectContaining(Object.assign({}, expectedDropDownSettings)));
//     })

//     it('should select New Delhi (404) office if user\'s home office is BCC(332)', () => {
//       //Arrange
//       component.homeOffice.officeCode = 332;

//       //Act
//       //directly call ngOnChanges
//       component.ngOnChanges({
//         homeOffice: new SimpleChange(null, component.homeOffice, true),
//         offices: new SimpleChange(null, component.offices, true)
//       });

//       //Assert
//       expect(component.selectedOfficeList[0].officeCode.toString()).toContain("404");
//     });

//     it('should select office same as loggedIn User\'s home office', () => {
//       //Arrange
//       component.homeOffice.officeCode = 110;

//       //Act
//       //directly call ngOnChanges
//       component.ngOnChanges({
//         homeOffice: new SimpleChange(null, component.homeOffice, true),
//         offices: new SimpleChange(null, component.offices, true)
//       });

//       //Assert
//       expect(component.selectedOfficeList[0].officeCode.toString()).toContain(component.homeOffice.officeCode);
//     });

//     it('getResourcesBySelectedOffices() should emit getResources() event', (done) => {
//       // Arrange
//       const testOfficeCodes = '115,110';
//       component.selectedOfficeList = [{
//         'officeCode': 115,
//         'officeName': 'Atlanta',
//         'officeAbbreviation': 'ATL'
//       },
//       {
//         'officeCode': 110,
//         'officeName': 'Boston',
//         'officeAbbreviation': 'BOS'
//       }
//       ];

//       // Act
//       component.getResources.subscribe(event => {
//         // Assert
//         expect(event.officeCodes).toBe(testOfficeCodes);
//         done();
//       });
//       component.getResourcesBySelectedOffices();
//     });

//     it('searchEmployee() should emit searchEmployeeByName() event', (done) => {
//       // Arrange
//       component.employeeSearchString = 'erika';

//       // Act
//       component.searchEmployeeByName.subscribe(event => {
//         // Assert
//         expect(event.typeahead).toBe(component.employeeSearchString);
//         done();
//       });
//       component.searchEmployee();
//     });

//     it('clearSearchBox() should call searchEmployee() and empty searchbox input', () => {
//       // Arrange
//       component.employeeSearchString = 'erika';
//       spyOn(component, 'searchEmployee');

//       // Act
//       component.clearSearchBox(true);

//       // Assert
//       expect(component.employeeSearchString).toBe('');
//       expect(component.searchEmployee).toHaveBeenCalled();

//     });

//     it('should initialize group filter with values Office, Level Grade and Position', () => {
//       // Arrange
//       const expectedGroupsBy: string[] = ['Office', 'Level Grade', 'Position'];

//       // Act

//       // Assert
//       expect(Object.assign({}, component.groupsBy))
//       .toEqual(jasmine.objectContaining(Object.assign({}, expectedGroupsBy)));
//     });

//     it('should set groupByDropdownSettings on initialization', () => {
//       // Arrange
//       const expectedgroupByDropdownSettings = {
//         singleSelection: true,
//         itemsShowLimit: 3,
//         allowSearchFilter: true,
//         enableCheckAll: false
//       };

//       // Assert
//       expect(Object.assign({}, component.groupByDropdownSettings))
//       .toEqual(jasmine.objectContaining(Object.assign({}, expectedgroupByDropdownSettings)));
//     })
//   });

//   describe('- IntegrationTests - ', () => {

//     it('should toggle the visibility of other filters on click event of resource filter icon', () => {
//       //Arrange
//       const el = fixture.debugElement.query(By.css('#resourceFilterIcon')).nativeElement;
//       spyOn(component, 'toggleFiltersSection');

//       //Act
//       el.click();
//       fixture.detectChanges();

//       //Assert
//       expect(component.toggleFiltersSection).toHaveBeenCalled();
//     });

//     it('should trigger searchEmployee() on input values in search box', () => {
//       //Arrange
//       const inputElement = fixture.debugElement.query(By.css('#employeeSearchInput')).nativeElement;
//       spyOn(component, 'searchEmployee');
//       const searchString = 'erika'

//       //Act
//       inputElement.value = searchString;
//       inputElement.dispatchEvent(new Event('input'));
//       fixture.detectChanges();

//       //Assert
//       expect(component.searchEmployee).toHaveBeenCalled();
//       expect(component.employeeSearchString).toBe(searchString);
//     });

//     it('should have input-group-append-focus class when searchbox is focussed', () => {
//       //Arrange
//       const inputElement = fixture.debugElement.query(By.css('#employeeSearchInput')).nativeElement;
//       const el = fixture.debugElement.query(By.css('.input-group > .input-group-append'));

//       //Act
//       inputElement.dispatchEvent(new Event('focus'));
//       fixture.detectChanges();

//       //Assert
//       expect(el.classes['input-group-append-focus']).toBeTruthy();
//     });

//     it('should not have input-group-append-focus class when searchbox is blurred', () => {
//       //Arrange
//       const inputElement = fixture.debugElement.query(By.css('#employeeSearchInput')).nativeElement;
//       const el = fixture.debugElement.query(By.css('.input-group > .input-group-append'));

//       //Act
//       inputElement.dispatchEvent(new Event('blur'));
//       fixture.detectChanges();

//       //Assert
//       expect(el.classes['input-group-append-focus']).toBeFalsy();
//     });

//     it('should show search glass icon in textbox when input string length < 3', () => {
//       //Arrange
//       const inputElement = fixture.debugElement.query(By.css('#employeeSearchInput')).nativeElement;
//       const searchString = 'er'
//       let glassIconElement = fixture.debugElement.query(By.css('.fa-search'));
//       let deleteIconElement = fixture.debugElement.query(By.css('.fa-times'));

//       expect(glassIconElement).toBeTruthy();
//       expect(deleteIconElement).toBeNull();

//       //Act
//       inputElement.value = searchString;
//       inputElement.dispatchEvent(new Event('input'));
//       fixture.detectChanges();


//       glassIconElement = fixture.debugElement.query(By.css('.fa-search'));
//       deleteIconElement = fixture.debugElement.query(By.css('.fa-times'));

//       //Assert
//       expect(glassIconElement).toBeTruthy();
//       expect(deleteIconElement).toBeNull();
//     });

//     it('should show delete icon in textbox when input string length > 2', () => {
//       //Arrange
//       const inputElement = fixture.debugElement.query(By.css('#employeeSearchInput')).nativeElement;
//       const searchString = 'eri'

//       //Act
//       inputElement.value = searchString;
//       inputElement.dispatchEvent(new Event('input'));
//       fixture.detectChanges();

//       const glassIconElement = fixture.debugElement.query(By.css('.fa-search'));
//       const deleteIconElement = fixture.debugElement.query(By.css('.fa-times'));

//       //Assert
//       expect(component.employeeSearchString).toBe(searchString);
//       expect(deleteIconElement).toBeTruthy();
//       expect(glassIconElement).toBeNull();
//     });

//     it('should call clearSearchBox() on clicking of delete icon in searchbox', () => {
//       //Arrange
//       const inputElement = fixture.debugElement.query(By.css('#employeeSearchInput')).nativeElement;
//       const searchString = 'eri'
//       spyOn(component, 'clearSearchBox');

//       //Act
//       inputElement.value = searchString;
//       inputElement.dispatchEvent(new Event('input'));
//       fixture.detectChanges();

//       const glassIconElement = fixture.debugElement.query(By.css('.fa-search'));
//       const deleteIconElement = fixture.debugElement.query(By.css('.fa-times'));

//       deleteIconElement.nativeElement.click();

//       //Assert
//       expect(component.clearSearchBox).toHaveBeenCalled();
//     });

//   });
// });
