import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SidebarComponent } from './sidebar.component';
import { SidebarFilterComponent } from '../sidebar-filter/sidebar-filter.component';
import { ResourceviewComponent } from '../resourceview/resourceview.component';
import { FAKE_RESOURCEGROUPS, FAKE_OFFICES } from '../../shared/mocks/mock-home-service';
import { MaterialModule } from '../../shared/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { FAKE_EMPLOYEE } from 'src/app/shared/mocks/mock-core-service';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarComponent, ResourceviewComponent, SidebarFilterComponent],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        NgMultiSelectDropDownModule,
        FormsModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    component.resourceGroups = FAKE_RESOURCEGROUPS;
    component.offices = JSON.parse(JSON.stringify(FAKE_OFFICES));
    component.homeOffice = JSON.parse(JSON.stringify(FAKE_EMPLOYEE.office));
    fixture.detectChanges();
  });

  describe('- Unit Tests -', () => {

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should get resourceGroups on init', () => {
      expect(component.resourceGroups).toEqual(FAKE_RESOURCEGROUPS);
    });

    it('should get offices on init', () => {
      expect(component.offices).toEqual(FAKE_OFFICES);
    });

    it('should get homeOffice on init', () => {
      expect(component.homeOffice).toEqual(FAKE_EMPLOYEE.office);
    });

    it('openResourceDetailsDialogHandler() should emit "openResourceDetailsDialog" event',
      (done) => {
        // Arrange
        const testEmployeeCode = '44ACM';

        // Act
        component.openResourceDetailsDialog.subscribe(employeeCode => {
          // Assert
          expect(employeeCode).toBe(testEmployeeCode);
          done();
        });
        component.openResourceDetailsDialogHandler(testEmployeeCode);
      });
  });

  describe('- Integrations Tests -', () => {

    it('should render SidebarFilterComponent', () => {
      // Arrange
      const sidebarFilterComponentElement = fixture.debugElement.query(By.directive(SidebarFilterComponent));

      // Act
      expect(sidebarFilterComponentElement.componentInstance.offices).toEqual(FAKE_OFFICES);
      expect(sidebarFilterComponentElement.componentInstance.homeOffice).toEqual(FAKE_EMPLOYEE.office);
    });

    it('should bind resourceGroupsTitle',
      () => {
        // Arrange
        const resourceGroupElements = fixture.debugElement.queryAll(By.css('.staff-group header'));

        // Assert
        for (let index = 0; index < resourceGroupElements.length; index++) {
          expect(resourceGroupElements[index].nativeElement.innerText).toBe(`${FAKE_RESOURCEGROUPS[index].groupTitle}`);
        }
      });

    it('should render each resource as ResourceviewComponent', () => {
      // Arrange

      // Flattens the resource list from each resourceGroups
      const expectedResources: any = [];
      for (let index = 0; index < FAKE_RESOURCEGROUPS.length; index++) {
        for (let innerIndex = 0; innerIndex < FAKE_RESOURCEGROUPS[index].resources.length; innerIndex++) {
          expectedResources.push(FAKE_RESOURCEGROUPS[index].resources[innerIndex]);
        }
      }

      const resourceViewComponentElements = fixture.debugElement.queryAll(By.directive(ResourceviewComponent));

      // Assert
      for (let index = 0; index < resourceViewComponentElements.length; index++) {
        expect(resourceViewComponentElements[index].componentInstance.resource).toBe(expectedResources[index]);
      }
    });

    it('should invoke openResourceDetailsDialogHandler() on emitting openResourceDetailsDialog event from ResourceviewComponent', () => {
      // Arrange
      const testEmployeeCode = '44ACM';
      const resourceComponentElement = fixture.debugElement.query(By.directive(ResourceviewComponent));
      spyOn(component, 'openResourceDetailsDialogHandler');

      // Act
      resourceComponentElement.componentInstance.openResourceDetailsDialog.emit(testEmployeeCode);

      // Assert
      expect(component.openResourceDetailsDialogHandler).toHaveBeenCalledWith(testEmployeeCode);

    });

    it('should invoke getResourcesHandler() on emitting getResources event from SidebarFilterComponent', () => {
      // Arrange
      const sidebarFilterComponentElement = fixture.debugElement.query(By.directive(SidebarFilterComponent));
      spyOn(component, 'getResourcesHandler');

      // Act
      sidebarFilterComponentElement.componentInstance.getResources.emit();

      // Assert
      expect(component.getResourcesHandler).toHaveBeenCalled();

    });

    it('should invoke searchEmployeeByNameHandler() on emitting searchEmployeeByName event from SidebarFilterComponent', () => {
      // Arrange
      const sidebarFilterComponentElement = fixture.debugElement.query(By.directive(SidebarFilterComponent));
      spyOn(component, 'searchEmployeeByNameHandler');

      // Act
      sidebarFilterComponentElement.componentInstance.searchEmployeeByName.emit();

      // Assert
      expect(component.searchEmployeeByNameHandler).toHaveBeenCalled();

    });
  });

});
