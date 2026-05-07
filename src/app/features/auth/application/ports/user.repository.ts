import { Observable } from 'rxjs';
import { CreateUserDTO, UserMe } from '../../domain/user.model';
import { InjectionToken } from '@angular/core';

export interface IUserRepository {
  create(user: CreateUserDTO): Observable<CreateUserDTO>;
  me(): Observable<UserMe>;
}

export const USER_REPOSITORY = new InjectionToken<IUserRepository>('USER_REPOSITORY');
