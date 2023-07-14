import { ComponentFixture, TestBed, tick, fakeAsync, waitForAsync } from '@angular/core/testing';

import { ProjectOverlayComponent } from './project-overlay.component';
import { NgModule } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FAKE_PROJECTS, MockHomeService } from 'src/app/shared/mocks/mock-home-service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { DatePipe } from '@angular/common';
import { HomeService } from '../../home/home.service';
import { By } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { GanttCaseComponent } from '../gantt/gantt-case/gantt-case.component';
import { FormsModule } from '@angular/forms';

//Since we won't be able to use Overlay component directly in a template. So we need to create a dummy NgModule for using OverlayComponent as an EntryComponent
const TEST_DIRECTIVES = [
  ProjectOverlayComponent,
  GanttCaseComponent
];

const mockDialogRef = {
  close: jasmine.createSpy('close')
};

const config = {
  data: {
    projectData: FAKE_PROJECTS[0],
    showDialog: true
  }
};

@NgModule({
  imports: [MatDialogModule, NoopAnimationsModule, FormsModule],
  providers: [
    { provide: MatDialogRef, useValue: mockDialogRef },
    { provide: MAT_DIALOG_DATA, useValue: config.data },
    BsModalService
  ],
  exports: TEST_DIRECTIVES,
  declarations: TEST_DIRECTIVES,
  entryComponents: [
    ProjectOverlayComponent
  ],
})
class DialogTestModule { }

describe('ProjectOverlayComponent', () => {
  let dialog: MatDialog;
  let overlayContainerElement: HTMLElement;
  let component: ProjectOverlayComponent;
  let fixture: ComponentFixture<ProjectOverlayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({

      imports: [DialogTestModule],
      providers: [
        { provide: HomeService, useClass: MockHomeService },
        {
          /*When Material asks for a OverlayContainer create an empty div and return the only portion of the real container we need, in other words, a function that returns our div.
          Now, when we open our dialog, it will be hosted in that empty div, and since we have access to it, we can do any assertion.*/
          provide: OverlayContainer, useFactory: () => {
            overlayContainerElement = document.createElement('div');
            return { getContainerElement: () => overlayContainerElement };
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectOverlayComponent);
    component = fixture.componentInstance;
    component.showDialog = true;
    dialog = TestBed.get(MatDialog);
    component.data = config.data;
    component.data.projectData = FAKE_PROJECTS[0];

    fixture.detectChanges();
  });

  describe(' - Unit Tests- ', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('data should be present in OnInIt()', () => {
      const projectData = FAKE_PROJECTS[0];
      projectData.startDate = new DatePipe('en-US').transform(FAKE_PROJECTS[0].startDate, 'dd-MMM-yyyy');
      projectData.endDate = new DatePipe('en-US').transform(FAKE_PROJECTS[0].endDate, 'dd-MMM-yyyy');
      expect(component.project.projectDetails).toEqual(projectData);
    });

    it("test the close button click", fakeAsync(() => {
      component.closeDialog();
      tick(1001);
      expect(component.showDialog).toEqual(false);

      fixture.whenStable().then(() => {
        expect(component.dialogRef.close).toHaveBeenCalled();
      });
    }));

    it('should close pop up on pressing escape button', () => {
      const event = new KeyboardEvent("keypress", {
        "key": "Escape"
      });
      const projectDetailsComponentEl = fixture.debugElement.query(By.css('#project-card'));
      projectDetailsComponentEl.triggerEventHandler('keydown', event);
      spyOn(component, 'handleKeyboardEvent');
      component.handleKeyboardEvent(event);
      expect(component.handleKeyboardEvent).toHaveBeenCalled();
      fixture.whenStable().then(() => {
        expect(component.dialogRef.close).toHaveBeenCalled();
      });
    });

    it('openResourceDetailsDialogHandler() should emit "openResourceDetailsFromProjectDialog" event',
      (done) => {
        //Arrange
        const testEmployeeCode = "44ACM";

        //Act
        component.openResourceDetailsFromProjectDialog.subscribe(employeeCode => {
          //Assert
          expect(employeeCode).toBe(testEmployeeCode);
          done();
        });
        component.openResourceDetailsDialogHandler(testEmployeeCode);
      });

  });
  describe(' - Integration Tests- ', () => {
    it('should show [staffing] in h2 tag', () => {
      //Arrange
      dialog.open(ProjectOverlayComponent, config);

      //Act
      fixture.detectChanges();
      const el = fixture.debugElement.query(By.css('#header')).nativeElement;

      //Assert
      expect(el.textContent.trim()).toBe('Staffing');
    });

    it('should show Opportunity/Case Name on the header', () => {
      //Arrange
      dialog.open(ProjectOverlayComponent, config);

      //Act
      fixture.detectChanges();
      let projectName = fixture.debugElement.query(By.css('#projectName')).nativeElement;

      //Assert
      if (component.project.projectDetails.type == 'Opportunity') {
        expect(projectName.textContent.trim())
          .toBe(`${component.project.projectDetails.opportunityName}`);
      }
      else {
        expect(projectName.textContent.trim())
          .toBe(`${component.project.projectDetails.caseName}`);
      }
    });

    it('should show name of the resource as [FirstName LastName] of the resource in title', () => {
      //Arrange
      dialog.open(ProjectOverlayComponent, config);

      //Act
      fixture.detectChanges();
      let projectName = fixture.debugElement.query(By.css('.title span')).nativeElement;

      //Assert
      if (component.project.projectDetails.type == 'Opportunity') {
        expect(projectName.textContent.trim())
          .toBe(`${component.project.projectDetails.opportunityName}`);
      }
      else {
        expect(projectName.textContent.trim())
          .toBe(`${component.project.projectDetails.caseName}`);
      }
    });

    it('should show Client Name, Type and Office Name below title', () => {
      //Arrange
      dialog.open(ProjectOverlayComponent, config);

      //Act
      fixture.detectChanges();
      let elements = fixture.debugElement.queryAll(By.css('.emphasize'));

      //Assert
      expect(elements[0].nativeElement.textContent.trim())
        .toBe(component.project.projectDetails.clientName);
      if (component.project.projectDetails.type == 'Opportunity') {
        expect(elements[1].nativeElement.textContent.trim())
          .toBe('Opportunity');
      }
      else {
        expect(elements[1].nativeElement.textContent.trim())
          .toBe('Case');
      }
      expect(elements[2].nativeElement.textContent.trim())
        .toBe(component.project.projectDetails.officeName);
    });

    it('should show other basic information', () => {
      //Arrange
      dialog.open(ProjectOverlayComponent, config);

      //Act
      fixture.detectChanges();
      let elements = fixture.debugElement.queryAll(By.css('.pl-1'));
      //Assert
      if (component.project.projectDetails.type == 'Opportunity') {
        expect(elements[0].nativeElement.textContent.trim()) //Case Code
          .toBe('N/A');
        expect(elements[1].nativeElement.textContent.trim()) //Case Type
          .toBe('N/A');
      }
      else {
        expect(elements[0].nativeElement.textContent.trim()) //Case Code
          .toBe(component.project.projectDetails.oldCaseCode);
        expect(elements[1].nativeElement.textContent.trim()) //Case Type
          .toBe(component.project.projectDetails.caseType);
      }
      expect(elements[2].nativeElement.textContent.trim()) //Start Date
        .toBe(component.project.projectDetails.startDate);

      expect(elements[3].nativeElement.textContent.trim()) //End Date
        .toBe(component.project.projectDetails.endDate);
    });

    it('should show Allocated Resources', () => {
      //Arrange
      dialog.open(ProjectOverlayComponent, config);

      //Act
      fixture.detectChanges();
      let projectTab = fixture.debugElement.query(By.css('.tab-team a')).nativeElement;
      projectTab.click();
      fixture.detectChanges();

      let elements = fixture.debugElement.queryAll(By.css('#tblAllocatedResources tbody tr td')); //Get first row data for tbody
      //Assert
      expect(elements[0].nativeElement.textContent.trim()) //Name
        .toBe(component.project.projectDetails.allocatedResources[0].fullName);

      expect(elements[1].nativeElement.textContent.trim()) //Office
        .toBe(component.project.projectDetails.allocatedResources[0].officeAbbreviation);

      expect(elements[2].nativeElement.textContent.trim()) //Level Grade
        .toBe(component.project.projectDetails.allocatedResources[0].currentLevelGrade);

      expect(elements[3].nativeElement.textContent.trim()) //Start Date
        .toBe(new DatePipe('en-US').transform(component.project.projectDetails.allocatedResources[0].startDate, 'dd-MMM-yyyy'));

      expect(elements[4].nativeElement.textContent.trim()) //End Date
        .toBe(new DatePipe('en-US').transform(component.project.projectDetails.allocatedResources[0].endDate, 'dd-MMM-yyyy'));

      expect(elements[5].nativeElement.textContent.trim()) //Allocation %
        .toBe(component.project.projectDetails.allocatedResources[0].allocation + '%');
    });

    it('clicking allocated resource name should open resource popup', () => {
      //Arrange
      dialog.open(ProjectOverlayComponent, config);
      spyOn(component, 'openResourceDetailsDialogHandler');
      const resourceName = fixture.debugElement.query(By.css('#tblAllocatedResources tbody tr td a')).nativeElement; //Get first row data for tbody
      let employeeCode = component.project.projectDetails.allocatedResources[0].employeeCode;

      //Act
      fixture.detectChanges();
      resourceName.click();

      //Assert
      expect(component.openResourceDetailsDialogHandler).toHaveBeenCalledWith(employeeCode);
    });
  })
});
