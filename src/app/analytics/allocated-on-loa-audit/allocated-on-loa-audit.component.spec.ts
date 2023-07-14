import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AllocatedOnLoaAuditComponent } from './allocated-on-loa-audit.component';

describe('AllocatedOnLoaAuditComponent', () => {
  let component: AllocatedOnLoaAuditComponent;
  let fixture: ComponentFixture<AllocatedOnLoaAuditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AllocatedOnLoaAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocatedOnLoaAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
