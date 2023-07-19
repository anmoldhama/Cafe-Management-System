import { TestBed } from '@angular/core/testing';

import { TokenIntereptorInterceptor } from './token-intereptor.interceptor';

describe('TokenIntereptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      TokenIntereptorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: TokenIntereptorInterceptor = TestBed.inject(TokenIntereptorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
