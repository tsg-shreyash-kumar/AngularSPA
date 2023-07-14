import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BackfillFormComponent } from './backfill-form.component';

describe('BackfillFormComponent', () => {
  let component: BackfillFormComponent;
  let fixture: ComponentFixture<BackfillFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BackfillFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackfillFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
