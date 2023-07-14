import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SkuTabListComponent } from './sku-tab-list.component';

describe('SkuTabListComponent', () => {
  let component: SkuTabListComponent;
  let fixture: ComponentFixture<SkuTabListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SkuTabListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkuTabListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
