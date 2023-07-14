import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DemandSettingsComponent } from './demand-settings.component';

describe('DemandSettingsComponent', () => {
  let component: DemandSettingsComponent;
  let fixture: ComponentFixture<DemandSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
