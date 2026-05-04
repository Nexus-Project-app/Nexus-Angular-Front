import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';



describe('HomeComponent', () => {
  let router: Router;
  const mockExecute = vi.fn();

  beforeEach(async () => {
    mockExecute.mockReset();

    router = TestBed.inject(Router);
  });
  
  
});
