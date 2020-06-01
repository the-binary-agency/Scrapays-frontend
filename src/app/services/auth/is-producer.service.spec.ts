import { TestBed } from '@angular/core/testing';

import { IsProducerService } from './is-producer.service';

describe('IsProducerService', () => {
  let service: IsProducerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsProducerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
