import { TestBed } from '@angular/core/testing';

import { OauthServiceService } from './oauth-service.service';

describe('OauthServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OauthServiceService = TestBed.get(OauthServiceService);
    expect(service).toBeTruthy();
  });
});
