import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResourcesCommitmentsComponent } from './resources-commitments.component';

describe('ResourcesCommitmentsComponent', () => {
  let component: ResourcesCommitmentsComponent;
  let fixture: ComponentFixture<ResourcesCommitmentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourcesCommitmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcesCommitmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
