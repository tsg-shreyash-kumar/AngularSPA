import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PreferenceListComponent } from './preference-list.component';

describe('PreferenceListComponent', () => {
  let component: PreferenceListComponent;
  let fixture: ComponentFixture<PreferenceListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferenceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferenceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});