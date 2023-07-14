import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SupplySettingsComponent } from './supply-settings.component';

describe('SupplySettingsComponent', () => {
  let component: SupplySettingsComponent;
  let fixture: ComponentFixture<SupplySettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplySettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
