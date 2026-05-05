import { Observable } from 'rxjs';
import { CreateUserDTO } from '../../domain/user.model';
import { Injectable, InjectionToken } from '@angular/core';
import { UserApi } from '../../infrastructure/user.api';

export interface IUserRepository {
  create(user: CreateUserDTO): Observable<CreateUserDTO>;
}

export const USER_REPOSITORY = new InjectionToken<IUserRepository>('USER_REPOSITORY');    