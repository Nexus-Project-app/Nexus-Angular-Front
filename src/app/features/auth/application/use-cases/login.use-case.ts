import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginCredentials } from '../../domain/credentials.model';
import { AUTH_PORT } from '../ports/auth.port';
import { LoginResponseDto } from '../dto/login-response.dto';

@Injectable()
export class LoginUseCase {
  private readonly authPort = inject(AUTH_PORT);

  execute(credentials: LoginCredentials): Observable<LoginResponseDto> {
    return this.authPort.login(credentials);
  }
}
