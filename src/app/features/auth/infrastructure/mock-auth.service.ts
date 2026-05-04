import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { IAuthPort } from '../application/ports/auth.port';
import { LoginRequestDto } from '../application/dto/login-request.dto';
import { LoginResponseDto } from '../application/dto/login-response.dto';

@Injectable()
export class MockAuthService implements IAuthPort {
  login(request: LoginRequestDto): Observable<LoginResponseDto> {
    if (!request.email || !request.password) {
      return throwError(() => new Error('Identifiants incorrects.')).pipe(delay(400));
    }
    return of({ accessToken: 'mock-token-dev', userId: 'mock-user-1' }).pipe(delay(600));
  }
}
