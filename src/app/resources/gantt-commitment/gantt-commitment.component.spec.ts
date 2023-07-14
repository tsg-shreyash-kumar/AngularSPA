import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GanttCommitmentComponent } from './gantt-commitment.component';

describe('GanttCommitmentComponent', () => {
  let component: GanttCommitmentComponent;
  let fixture: ComponentFixture<GanttCommitmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GanttCommitmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanttCommitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
