import { TestBed } from '@angular/core/testing';

import { IsCollectorService } from './is-collector.service';

describe('IsCollectorService', () => {
  let service: IsCollectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsCollectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
