import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OverAllocatedAuditComponent } from './over-allocated-audit.component';

describe('OverAllocatedAuditComponent', () => {
  let component: OverAllocatedAuditComponent;
  let fixture: ComponentFixture<OverAllocatedAuditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OverAllocatedAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverAllocatedAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
