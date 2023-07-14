import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesTypeaheadComponent } from './resources-typeahead.component';

describe('ResourcesTypeaheadComponent', () => {
  let component: ResourcesTypeaheadComponent;
  let fixture: ComponentFixture<ResourcesTypeaheadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourcesTypeaheadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcesTypeaheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
