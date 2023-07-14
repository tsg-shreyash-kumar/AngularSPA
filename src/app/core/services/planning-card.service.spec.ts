import { TestBed } from '@angular/core/testing';

import { PlanningCardService } from './planning-card.service';

describe('PlanningCardService', () => {
  let service: PlanningCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanningCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
