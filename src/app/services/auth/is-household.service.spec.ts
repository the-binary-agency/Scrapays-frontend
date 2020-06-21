import { TestBed } from '@angular/core/testing';

import { IsHouseholdService } from './is-household.service';

describe('IsHouseholdService', () => {
  let service: IsHouseholdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsHouseholdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
