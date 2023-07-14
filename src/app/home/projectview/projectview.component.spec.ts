import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProjectviewComponent } from './projectview.component';
import { FAKE_PROJECTS } from '../../shared/mocks/mock-home-service';
import { By } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { ProjectResourceComponent } from '../project-resource/project-resource.component';

describe('ProjectviewComponent', () => {
  let component: ProjectviewComponent;
  let fixture: ComponentFixture<ProjectviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectviewComponent, ProjectResourceComponent],
      imports: [
        FormsModule,
        DragDropModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectviewComponent);
    component = fixture.componentInstance;
    component.project = FAKE_PROJECTS[0];
    fixture.detectChanges();
  });

  describe('- Unit Tests -', () => {

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should get project on init', () => {
      expect(component.project).toEqual(FAKE_PROJECTS[0]);
    });

    it('should emit openResourceDetailsDialog output event on clicking of Resource Name', () => {
      //Arrange    
      const testEmployeeCode: string = "37995"

      component.openResourceDetailsDialog.subscribe(params => {
        //Assert
        expect(params).toBe(testEmployeeCode);
      });

      //Act
      component.openResourceDetailsDialogHandler(testEmployeeCode);
    })

  });

  describe('- Integration Tests -', () => {

    it('should not render anything if there is no project', () => {
      //Arrange
      component.project = null;
      fixture.detectChanges();

      let projectElement = fixture.debugElement.query(By.css('.project'));

      //Assert

      expect(projectElement).toBe(null);
    });

    it('should have [ngClass] resolve to accent-1 when project type is Opportunity', () => {
      //Arrange
      component.project = FAKE_PROJECTS.find(x => x.type == 'Opportunity');
      fixture.detectChanges();

      const projectColor = fixture.debugElement.query(By.css('.project'));

      //Assert
      expect(projectColor.classes['accent-1']).toBeTruthy();
    });

    it('should have [ngClass] resolve to accent-2 when project type is NewDemand', () => {
      //Arrange
      component.project = FAKE_PROJECTS.filter(x => x.type === 'NewDemand')[0];
      fixture.detectChanges();

      const projectColor = fixture.debugElement.query(By.css('.project'));

      //Assert
      expect(projectColor.classes['accent-2']).toBeTruthy();
    });

    it('should have [ngClass] resolve to accent-3 when project type is ActiveCase', () => {
      //Arrange
      component.project = FAKE_PROJECTS.filter(x => x.type === 'ActiveCase')[0];
      fixture.detectChanges();

      const projectColor = fixture.debugElement.query(By.css('.project'));

      //Assert
      expect(projectColor.classes['accent-3']).toBeTruthy();
    });

    it('should show probablity percent in header with client name - opportunity name - probability percent format when project type is Opportunity', () => {
      //Arrange
      component.project = FAKE_PROJECTS.filter(x => x.type === 'Opportunity')[0];
      fixture.detectChanges();

      let projectElement = fixture.debugElement.query(By.css('.name')).nativeElement;

      //Assert
      expect(projectElement.textContent)
        .toBe(`${component.project.clientName} - ${component.project.opportunityName} - ${component.project.probabilityPercent}%`);
      expect(projectElement.title)
        .toBe(`${component.project.clientName} - ${component.project.opportunityName} - ${component.project.probabilityPercent}%`);
    });

    it('should NOT show probablity percent in header with client name - opportunity name format when project type is Opportunity ', () => {
      //Arrange
      component.project = FAKE_PROJECTS.filter(x => x.type === 'Opportunity')[0];
      component.project.probabilityPercent = null;
      fixture.detectChanges();

      let projectHeaderLine1Element = fixture.debugElement.query(By.css('.name')).nativeElement;

      //Assert
      expect(projectHeaderLine1Element.textContent)
        .toBe(`${component.project.clientName} - ${component.project.opportunityName}`);
      expect(projectHeaderLine1Element.title)
        .toBe(`${component.project.clientName} - ${component.project.opportunityName}`);
    });

    it('should show endDate in header when project type is Opportunity and endDate is not null ', () => {
      //Arrange
      component.project = FAKE_PROJECTS.filter(x => x.type === 'Opportunity')[0];
      fixture.detectChanges();

      let projectHeaderLine2Element = fixture.debugElement.queryAll(By.css('.details > div'));

      //Assert
      expect(projectHeaderLine2Element[0].nativeElement.textContent)
        .toBe(new DatePipe('en-US').transform(component.project.startDate, 'dd-MMM-yyyy') +
          ' - ' +
          new DatePipe('en-US').transform(component.project.endDate, 'dd-MMM-yyyy'));
      expect(projectHeaderLine2Element[1].nativeElement.textContent).toBe(component.project.managingOfficeAbbreviation);
    });

    it('should not show endDate in header when project type is Opportunity endDate is null ', () => {
      //Arrange
      component.project = FAKE_PROJECTS.filter(x => x.type === 'Opportunity')[0];
      component.project.endDate = null;
      fixture.detectChanges();

      let projectHeaderLine2Element = fixture.debugElement.queryAll(By.css('.details > div'));

      //Assert
      expect(projectHeaderLine2Element[0].nativeElement.textContent)
        .toBe(new DatePipe('en-US').transform(component.project.startDate, 'dd-MMM-yyyy'));
      expect(projectHeaderLine2Element[1].nativeElement.textContent).toBe(component.project.managingOfficeAbbreviation);
    });

    it('should render project header with case code - client name - case name format when project type is ActiveCases', () => {
      //Arrange
      component.project = FAKE_PROJECTS.filter(x => x.type === 'ActiveCase')[0];
      fixture.detectChanges();

      let projectHeaderLine1Element = fixture.debugElement.query(By.css('.name')).nativeElement;

      //Assert
      expect(projectHeaderLine1Element.textContent)
        .toBe(`${component.project.oldCaseCode} - ${component.project.clientName} - ${component.project.caseName}`);
      expect(projectHeaderLine1Element.title)
        .toBe(`${component.project.oldCaseCode} - ${component.project.clientName} - ${component.project.caseName}`);
    });

    it('should render project header with [startDate - endDate officeCode] format when project type is ActiveCases', () => {
      //Arrange
      component.project = FAKE_PROJECTS.filter(x => x.type === 'ActiveCase')[0];
      fixture.detectChanges();

      let projectHeaderLine2Element = fixture.debugElement.queryAll(By.css('.details > div'));

      //Assert      
      expect(projectHeaderLine2Element[0].nativeElement.textContent)
        .toBe(new DatePipe('en-US').transform(component.project.startDate, 'dd-MMM-yyyy') +
          ' - ' +
          new DatePipe('en-US').transform(component.project.endDate, 'dd-MMM-yyyy'));
      expect(projectHeaderLine2Element[1].nativeElement.textContent).toBe(component.project.managingOfficeAbbreviation);
    });

    it('should render project header with case code - client name - case name format when project type is NewDemand', () => {
      //Arrange
      component.project = FAKE_PROJECTS.filter(x => x.type === 'NewDemand')[0];
      fixture.detectChanges();

      let projectHeaderLine1Element = fixture.debugElement.query(By.css('.name')).nativeElement;

      //Assert
      expect(projectHeaderLine1Element.textContent)
        .toBe(`${component.project.oldCaseCode} - ${component.project.clientName} - ${component.project.caseName}`);
      expect(projectHeaderLine1Element.title)
        .toBe(`${component.project.oldCaseCode} - ${component.project.clientName} - ${component.project.caseName}`);
    });

    it('should render project header with [startDate - endDate officeCode] format when project type is NewDemand', () => {
      //Arrange
      component.project = FAKE_PROJECTS.filter(x => x.type === 'NewDemand')[0];
      fixture.detectChanges();

      let projectHeaderLine2Element = fixture.debugElement.queryAll(By.css('.details > div'));

      //Assert
      expect(projectHeaderLine2Element[0].nativeElement.textContent)
        .toBe(new DatePipe('en-US').transform(component.project.startDate, 'dd-MMM-yyyy') +
          ' - ' +
          new DatePipe('en-US').transform(component.project.endDate, 'dd-MMM-yyyy'));
      expect(projectHeaderLine2Element[1].nativeElement.textContent).toBe(component.project.managingOfficeAbbreviation);
    });

    it('should render resources inside project card', () => {
      //Arrange
      component.project = FAKE_PROJECTS.filter(x => x.allocatedResources.length > 0)[0];
      fixture.detectChanges();

      let resources = fixture.debugElement.queryAll(By.css('.content > .table> tbody > tr'));

      //Assert
      expect(resources.length).toBe(component.project.allocatedResources.length);

      for (var i = 0; i < resources.length; i++) {
        var tds = resources[i].queryAll(By.css('td'));
        var linkItem = tds[0].query(By.css('a'));

        expect(linkItem).not.toBeNull();
        expect(linkItem.nativeElement.getAttribute('title')).toBe(component.project.allocatedResources[i].fullName);
        expect(tds[0].nativeElement.textContent).toBe(component.project.allocatedResources[i].fullName);
        expect(tds[1].nativeElement.textContent).toBe(component.project.allocatedResources[i].currentLevelGrade);
        expect(tds[2].nativeElement.textContent).toBe(component.project.allocatedResources[i].officeAbbreviation);
        expect(tds[3].nativeElement.textContent).toBe(component.project.allocatedResources[i].allocation + '%');
        expect(tds[4].nativeElement.textContent).toBe(new DatePipe('en-US').transform(component.project.allocatedResources[i].endDate, 'dd-MMM-yyyy'));
        //expect(tds[4].nativeElement.getAttribute('class')).toBe('no-wrap');
      }
    });

    it('should trigger openResourceDetailsDialogHandler with employee code on clickng on resource name inside card', () => {
      //Arrange
      component.project = FAKE_PROJECTS.filter(x => x.allocatedResources.length > 0)[0];
      spyOn(component, 'openResourceDetailsDialogHandler');
      fixture.detectChanges();

      let deResourceName = fixture.debugElement.query(By.css('#lnkResourceName')).nativeElement;
      deResourceName.click();

      //Assert
      expect(component.openResourceDetailsDialogHandler).toHaveBeenCalledWith(component.project.allocatedResources[0].employeeCode);
    });
  });

});
