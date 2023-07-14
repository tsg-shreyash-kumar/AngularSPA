import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StaffingSettingsComponent } from './staffing-settings.component';

describe('StaffingSettingsComponent', () => {
  let component: StaffingSettingsComponent;
  let fixture: ComponentFixture<StaffingSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffingSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffingSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
