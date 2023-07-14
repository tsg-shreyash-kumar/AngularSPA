import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinPlaygroundPopUpComponent } from './join-playground-pop-up.component';

describe('JoinPlaygroundPopUpComponent', () => {
  let component: JoinPlaygroundPopUpComponent;
  let fixture: ComponentFixture<JoinPlaygroundPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinPlaygroundPopUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinPlaygroundPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
