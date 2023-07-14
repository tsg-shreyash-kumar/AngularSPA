import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocatedPlaceholderComponent } from './allocated-placeholder.component';

describe('AllocatedPlaceholderComponent', () => {
  let component: AllocatedPlaceholderComponent;
  let fixture: ComponentFixture<AllocatedPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllocatedPlaceholderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocatedPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
