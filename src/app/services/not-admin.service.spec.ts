import { TestBed } from '@angular/core/testing';

import { NotAdminService } from './not-admin.service';

describe('NotAdminService', () => {
  let service: NotAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
