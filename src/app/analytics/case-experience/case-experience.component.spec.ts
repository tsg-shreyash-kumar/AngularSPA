import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseExperienceComponent } from './case-experience.component';

describe('CaseExperienceComponent', () => {
  let component: CaseExperienceComponent;
  let fixture: ComponentFixture<CaseExperienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseExperienceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
