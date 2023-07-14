import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceBasicMenuComponent } from './resource-basic-menu.component';

describe('ResourceBasicMenuComponent', () => {
  let component: ResourceBasicMenuComponent;
  let fixture: ComponentFixture<ResourceBasicMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResourceBasicMenuComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceBasicMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
