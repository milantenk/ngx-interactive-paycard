import { TestBed } from '@angular/core/testing';

import { InteractivePaycardLibService } from './interactive-paycard-lib.service';

describe('InteractivePaycardLibService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InteractivePaycardLibService = TestBed.get(InteractivePaycardLibService);
    expect(service).toBeTruthy();
  });
});
