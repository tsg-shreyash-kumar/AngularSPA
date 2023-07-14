import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUpdateOfficeClosureComponent } from './office-closure.component';

describe('BulkUpdateOfficeClosureComponent', () => {
  let component: BulkUpdateOfficeClosureComponent;
  let fixture: ComponentFixture<BulkUpdateOfficeClosureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkUpdateOfficeClosureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUpdateOfficeClosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
