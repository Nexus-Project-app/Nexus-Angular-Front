import { inject, Injectable } from '@angular/core';
import { USER_REPOSITORY } from '../ports/user.repository';
import { CreateUserDTO } from '../../domain/user.model';

@Injectable({ providedIn: 'root' })
export class CreateUserUseCase {
  private readonly repo = inject(USER_REPOSITORY);

  execute(user: CreateUserDTO) {
    return this.repo.create(user);
  }
}

@Injectable({ providedIn: 'root' })
export class me {
    private readonly repo = inject(USER_REPOSITORY);
    execute(){
        return this.repo.me()
    }
}