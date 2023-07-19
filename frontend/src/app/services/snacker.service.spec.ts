import { TestBed } from '@angular/core/testing';

import { SnackerService } from './snacker.service';

describe('SnackerService', () => {
  let service: SnackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
