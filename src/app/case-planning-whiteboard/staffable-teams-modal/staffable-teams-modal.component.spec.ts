import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffableTeamsModalComponent } from './staffable-teams-modal.component';

describe('StaffableTeamsModalComponent', () => {
  let component: StaffableTeamsModalComponent;
  let fixture: ComponentFixture<StaffableTeamsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StaffableTeamsModalComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffableTeamsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
