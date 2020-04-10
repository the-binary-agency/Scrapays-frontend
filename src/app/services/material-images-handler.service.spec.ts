import { TestBed } from '@angular/core/testing';

import { MaterialImagesHandlerService } from './material-images-handler.service';

describe('MaterialImagesHandlerService', () => {
  let service: MaterialImagesHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaterialImagesHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
