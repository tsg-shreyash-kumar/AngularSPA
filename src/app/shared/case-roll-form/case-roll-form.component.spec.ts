import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CaseRollFormComponent } from './case-roll-form.component';
import { FormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FAKE_PROJECTS, FAKE_PROJECTS_DATA } from 'src/app/shared/mocks/mock-home-service';

describe('CaseRollFormComponent', () => {
  let component: CaseRollFormComponent;
  let fixture: ComponentFixture<CaseRollFormComponent>;

  const mockBsModalRef = {
    hide: jasmine.createSpy('hide')
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CaseRollFormComponent],
      imports: [
        FormsModule
      ],
      providers: [
        { provide: BsModalRef, useValue: mockBsModalRef }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseRollFormComponent);
    component = fixture.componentInstance;
    component.project = JSON.parse(JSON.stringify(FAKE_PROJECTS_DATA.casesandallocationsbyoffices[0]));
    fixture.detectChanges();
  });

  describe('- UnitTests - ', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    // it('should have case data in OnInIt', () => {
    // });
  });

});
