import { TestBed } from '@angular/core/testing';

import { UserPreferencesMessageService } from './user-preferences-message.service';

describe('UserPreferencesMessageService', () => {
  let service: UserPreferencesMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserPreferencesMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
