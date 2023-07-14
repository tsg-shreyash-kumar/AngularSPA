import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CaseEconomicsComponent } from './case-economics.component';

describe('CaseEconomicsComponent', () => {
  let component: CaseEconomicsComponent;
  let fixture: ComponentFixture<CaseEconomicsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseEconomicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseEconomicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
