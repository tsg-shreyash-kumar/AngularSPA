import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupActionPanelComponent } from './group-action-panel.component';

describe('GroupActionPanelComponent', () => {
  let component: GroupActionPanelComponent;
  let fixture: ComponentFixture<GroupActionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupActionPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupActionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
