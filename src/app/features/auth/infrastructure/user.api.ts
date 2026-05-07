import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { CreateUserDTO, UserMe } from '../domain/user.model';
import { environment } from '../../../../environment/environment';
import { IUserRepository } from '../application/ports/user.repository';
import { AuthService } from '../../../shared/services/auth.service';

@Injectable({ providedIn: 'root' })
export class UserApi implements IUserRepository {
  protected readonly auth = inject(AuthService);

  constructor(private readonly http: HttpClient) {}

  create(user: CreateUserDTO) {
    const token = this.auth.instance?.token;
    if (!token) {
      return EMPTY as unknown as Observable<CreateUserDTO>;
    }
    return this.http.post<CreateUserDTO>(`${environment.apiUrl}/users/register`, user, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  me(): Observable<UserMe> {
    // SSR-safe : Keycloak n'est pas initialisé côté serveur, on retourne EMPTY
    const token = this.auth.instance?.token;
    if (!token) {
      return EMPTY;
    }
    return this.http.get<UserMe>(`${environment.apiUrl}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
