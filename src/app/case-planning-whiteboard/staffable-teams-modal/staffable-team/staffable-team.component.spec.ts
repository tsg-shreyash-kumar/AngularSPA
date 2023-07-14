import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffableTeamComponent } from './staffable-team.component';

describe('StaffableTeamComponent', () => {
  let component: StaffableTeamComponent;
  let fixture: ComponentFixture<StaffableTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffableTeamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffableTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
