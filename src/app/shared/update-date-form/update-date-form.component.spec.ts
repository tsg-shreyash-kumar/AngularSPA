import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UpdateDateFormComponent } from './update-date-form.component';

describe('UpdateDateFormComponent', () => {
  let component: UpdateDateFormComponent;
  let fixture: ComponentFixture<UpdateDateFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateDateFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateDateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
