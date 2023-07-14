import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CaseUpdatesAuditComponent } from './case-updates-audit.component';

describe('CaseUpdatesAuditComponent', () => {
  let component: CaseUpdatesAuditComponent;
  let fixture: ComponentFixture<CaseUpdatesAuditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseUpdatesAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseUpdatesAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
