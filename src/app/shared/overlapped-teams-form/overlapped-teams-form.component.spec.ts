import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlappedTeamsFormComponent } from './overlapped-teams-form.component';

describe('OverlappedTeamsFormComponent', () => {
  let component: OverlappedTeamsFormComponent;
  let fixture: ComponentFixture<OverlappedTeamsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OverlappedTeamsFormComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverlappedTeamsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
