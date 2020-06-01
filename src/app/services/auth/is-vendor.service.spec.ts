import { TestBed } from '@angular/core/testing';

import { IsVendorService } from './is-vendor.service';

describe('IsVendorService', () => {
  let service: IsVendorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsVendorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
