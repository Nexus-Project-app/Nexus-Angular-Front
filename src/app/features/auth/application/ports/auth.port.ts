import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequestDto } from '../dto/login-request.dto';
import { LoginResponseDto } from '../dto/login-response.dto';

export interface IAuthPort {
  login(request: LoginRequestDto): Observable<LoginResponseDto>;
}

export const AUTH_PORT = new InjectionToken<IAuthPort>('AUTH_PORT');
