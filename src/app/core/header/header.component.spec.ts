//----------------------- Angular Package References ----------------------------------//
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';


//----------------------- Application References ----------------------------------//
import { HeaderComponent } from './header.component';
import { EmployeeProfileComponent } from '../employee-profile/employee-profile.component';
import { MockCoreService, FAKE_EMPLOYEE } from '../../shared/mocks/mock-core-service';
import { CoreService } from '../core.service';
import {BsModalService } from 'ngx-bootstrap/modal'
import { PopoverModule } from 'ngx-bootstrap/popover';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrModule } from 'ngx-toastr';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let coreService: CoreService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent, EmployeeProfileComponent],
      providers: [
        { provide: CoreService, useClass: MockCoreService },
        BsModalService
      ],
      imports: [
        PopoverModule.forRoot(),
        MatDialogModule,
        ToastrModule.forRoot()
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    coreService = TestBed.get(CoreService);

    fixture.detectChanges();
  });

  describe('- Unit Tests -', () => {

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should get employee from core service', () => {
      expect(component.employee).toEqual(coreService.loggedInUser);
    });

  });

  describe('- Integration Tests -', () => {

    it('should display employee as EmployeeProfileComponent', () => {
      //Arrange
      component.isAuthenticated = true;
      fixture.detectChanges();

      //Act
      const employeeComponentDE = fixture.debugElement.query(By.directive(EmployeeProfileComponent));

      //Assert
      expect(employeeComponentDE).not.toBe(undefined);
      expect(employeeComponentDE.componentInstance.employee).toBe(FAKE_EMPLOYEE);
    });

    it('should display project name', () => {
      //Arrange
      component.isAuthenticated = true;
      fixture.detectChanges();

      let el = fixture.debugElement.query(By.css('#lblProjectName')).nativeElement;

      //Assert
      expect(el.innerText).toBe(`BOSS`);
    });

  });
});
