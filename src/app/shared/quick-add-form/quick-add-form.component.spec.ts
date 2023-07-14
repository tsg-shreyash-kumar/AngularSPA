import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuickAddFormComponent } from './quick-add-form.component';

describe('QuickAddFormComponent', () => {
  let component: QuickAddFormComponent;
  let fixture: ComponentFixture<QuickAddFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickAddFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
