import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResourceviewComponent } from './resourceview.component';
import { FAKE_RESOURCEGROUPS } from '../../shared/mocks/mock-home-service';
import { By } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

describe('ResourceviewComponent', () => {
  let component: ResourceviewComponent;
  let fixture: ComponentFixture<ResourceviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceviewComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceviewComponent);
    component = fixture.componentInstance;
    component.resource = FAKE_RESOURCEGROUPS[0].resources[0];
    fixture.detectChanges();
  });

  describe('- Unit Tests -', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should get resource on init', () => {
      expect(component.resource).toEqual(FAKE_RESOURCEGROUPS[0].resources[0]);
    });

    it('openResourceDetailsDialogHandler() should emit "openResourceDetailsDialog" event',
      (done) => {
        //Arrange
        const testEmployeeCode = "44ACM";

        //Act
        component.openResourceDetailsDialog.subscribe(employeeCode => {
          //Assert
          expect(employeeCode).toBe(testEmployeeCode);
          done();
        });
        component.openResourceDetailsDialogHandler(testEmployeeCode);
      });

  });

  describe('- Integration Tests -', () => {

    it('should render resource properties',
      () => {
        //Arrange
        let resourceElements = fixture.debugElement.queryAll(By.css('.list-group-item .no-gutters div'));

        //Assert
        expect(resourceElements[0].nativeElement.textContent).toBe(`${component.resource.fullName}`);
        expect(resourceElements[0].nativeElement.title).toBe(`${component.resource.fullName}`);
        expect(resourceElements[1].nativeElement.textContent).toBe('100%');
        expect(resourceElements[2].nativeElement.textContent)
          .toBe(new DatePipe('en-US').transform(component.resource.dateFirstAvailable, 'dd-MMM'));
        expect(resourceElements[3].nativeElement.textContent).toBe(component.resource.levelGrade);
      });
  });  

});
