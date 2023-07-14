import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommitmentDetailsComponent } from './commitment-details.component';

describe('CommitmentDetailsComponent', () => {
  let component: CommitmentDetailsComponent;
  let fixture: ComponentFixture<CommitmentDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CommitmentDetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
