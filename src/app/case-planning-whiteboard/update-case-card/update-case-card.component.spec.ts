import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCaseCardComponent } from './update-case-card.component';

describe('UpdateCaseCardComponent', () => {
  let component: UpdateCaseCardComponent;
  let fixture: ComponentFixture<UpdateCaseCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCaseCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCaseCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
