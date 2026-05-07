import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateUserDTO,UserMe } from '../domain/user.model';
import { environment } from '../../../../environment/environment';
import { IUserRepository } from '../application/ports/user.repository';
import { AuthService } from '../../../shared/services/auth.service';


@Injectable({ providedIn: 'root' })
export class UserApi implements IUserRepository {
  
  protected readonly auth = inject(AuthService)
    
  constructor(private http: HttpClient) {}

  create(user: CreateUserDTO) {
    return this.http.post<CreateUserDTO>(`${environment.apiUrl}/users/register`, 
        user,
        {
            headers:{
                Authorization : `Bearer ${this.auth.instance.token}`
            }
        }
        
    );
  }

  me(){
    return this.http.get<UserMe>(`${environment.apiUrl}/users/me`,
        {
            headers:{
                Authorization : `Bearer ${this.auth.instance.token}`
            }
        }
    )
  }

}