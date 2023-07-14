import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesTypeaheadComponent } from './cases-typeahead.component';

describe('CasesTypeaheadComponent', () => {
  let component: CasesTypeaheadComponent;
  let fixture: ComponentFixture<CasesTypeaheadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasesTypeaheadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CasesTypeaheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
