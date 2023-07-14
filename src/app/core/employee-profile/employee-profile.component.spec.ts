import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { EmployeeProfileComponent } from './employee-profile.component';
import { FAKE_EMPLOYEE } from '../../shared/mocks/mock-core-service'
import { PopoverModule } from 'ngx-bootstrap/popover';

describe('EmployeeProfileComponent', () => {
  let component: EmployeeProfileComponent;
  let fixture: ComponentFixture<EmployeeProfileComponent>;
  let el: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeProfileComponent],
      imports: [PopoverModule.forRoot()]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeProfileComponent);
    component = fixture.componentInstance;
    component.employee = JSON.parse(JSON.stringify(FAKE_EMPLOYEE));

    fixture.detectChanges();
  });

  describe('- Unit Tests -', () => {

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should contain employee', () => {
      expect(component.employee).toEqual(FAKE_EMPLOYEE);
    });

  });

  describe('- Integration Tests -', () => {

    it('should show employee image if it exists in GXC', () => {
      //Arrange
      component.employee.profileImageUrl = 'testUrl';
      fixture.detectChanges();

      //Act
      el = fixture.debugElement.query(By.css('.nav-link > img')).nativeElement;

      //Assert
      expect(el.getAttribute('src')).toBe(component.employee.profileImageUrl);
    });

    it('should show user silhoutte if image does not exists in GXC', () => {
      component.employee.profileImageUrl = null;
      fixture.detectChanges();

      el = fixture.debugElement.query(By.css('.nav-link > img')).nativeElement;

      expect(el.getAttribute('src')).toBe('assets/img/user-icon.jpg');
    });

    it('should show employee Name in header', () => {
      el = fixture.debugElement.query(By.css('#lnkUserName')).nativeElement;

      expect(el.innerText).toBe(`${component.employee.fullName}`);
    });
  });

});
