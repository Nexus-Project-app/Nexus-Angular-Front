import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateUserDTO, User } from '../domain/user.model';
import { environment } from '../../../../environment/environment';
import { IUserRepository } from '../application/ports/user.repository';

@Injectable({ providedIn: 'root' })
export class UserApi implements IUserRepository {
  constructor(private http: HttpClient) {}

  create(user: CreateUserDTO) {
    return this.http.post<CreateUserDTO>(`${environment.apiUrl}/users/register`, user);
  }
}