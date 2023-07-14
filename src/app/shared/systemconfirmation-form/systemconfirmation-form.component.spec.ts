import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SystemconfirmationFormComponent } from './systemconfirmation-form.component';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { By } from '@angular/platform-browser';

describe('SystemconfirmationFormComponent', () => {
  let component: SystemconfirmationFormComponent;
  let fixture: ComponentFixture<SystemconfirmationFormComponent>;

  const mockBsModalRef = {
    hide: jasmine.createSpy('hide')
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SystemconfirmationFormComponent],
      providers: [
        { provide: BsModalRef, useValue: mockBsModalRef }
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemconfirmationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.confirmationPopUpBodyMessage = 'Test Message';
    component.allocationId = '56431258-adc9-415b-a4c0-60ec18ceac6f';
  });

  describe('- Unit Tests - ', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should get required data on init', () => {
      expect(component.confirmationPopUpBodyMessage).toEqual('Test Message');
      expect(component.allocationId).toEqual('56431258-adc9-415b-a4c0-60ec18ceac6f');
    });

    it("closeForm(): should hide popup", () => {
      component.closeForm();
      expect(component.bsModalRef.hide).toHaveBeenCalled();
    });

    it("continueAction(): should emit allocation Id", () => {
      //Arrange
      spyOn(component.deleteResourceFromProject, 'emit');

      //Act
      component.continueAction();

      //Assert
      expect(component.deleteResourceFromProject.emit).toHaveBeenCalledWith({ allocationId: '56431258-adc9-415b-a4c0-60ec18ceac6f' });
    });

    it("continueAction(): should call closeForm()", () => {
      //Arrange
      spyOn(component, 'closeForm');

      //Act
      component.continueAction();

      //Assert
      expect(component.closeForm).toHaveBeenCalled();
    });

  });

  describe('- Integration Tests -', () => {
    it('title of the page should be "System Confirmation"', () => {
      fixture.detectChanges();

      //Arrange
      const el = fixture.debugElement.query(By.css('.modal-title')).nativeElement;

      //Assert
      expect(el.textContent.trim()).toBe('System Confirmation');
    });

    it('body of the popup should be "Test Message"', () => {
      fixture.detectChanges();

      //Arrange
      const el = fixture.debugElement.query(By.css('.modal-body label')).nativeElement;

      //Assert
      expect(el.textContent.trim()).toBe('Test Message');
    });
  });

  it('should call closeForm() on clicking close icon', () => {
    //Arrange
    spyOn(component, 'closeForm');
    const closeIcon = fixture.debugElement.query(By.css('.close')).nativeElement;

    //Act
    closeIcon.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    //Assert
    expect(component.closeForm).toHaveBeenCalled();
  });

  it('should call closeForm() on clicking cancel button', () => {
    //Arrange
    spyOn(component, 'closeForm');
    const cancelButton = fixture.debugElement.query(By.css('#closeModal')).nativeElement;

    //Act
    cancelButton.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    //Assert
    expect(component.closeForm).toHaveBeenCalled();
  });

  it('should call continueAction() on clicking Continue button', () => {
    //Arrange
    spyOn(component, 'continueAction');
    const continueButton = fixture.debugElement.query(By.css('#continueAction')).nativeElement;

    //Act
    continueButton.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    //Assert
    expect(component.continueAction).toHaveBeenCalled();
  });

  it('should call closeForm() on clicking Continue button', () => {
    //Arrange
    spyOn(component, 'closeForm');
    const continueButton = fixture.debugElement.query(By.css('#continueAction')).nativeElement;

    //Act
    continueButton.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    //Assert
    expect(component.closeForm).toHaveBeenCalled();
  });
});