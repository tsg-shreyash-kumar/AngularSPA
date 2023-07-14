import { TestBed } from '@angular/core/testing';

import { CasePlanningWhiteboardService } from './case-planning-whiteboard.service';

describe('CasePlanningWhiteboardService', () => {
  let service: CasePlanningWhiteboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CasePlanningWhiteboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
