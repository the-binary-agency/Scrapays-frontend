import { TestBed } from '@angular/core/testing';

import { IsEnterpriseService } from './is-enterprise.service';

describe('IsEnterpriseService', () => {
  let service: IsEnterpriseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsEnterpriseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
