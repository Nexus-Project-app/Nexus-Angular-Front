import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { USER_REPOSITORY } from '../../features/auth/application/ports/user.repository';
import { UserMe } from '../../features/auth/domain/user.model';

/**
 * Service pour accéder aux données utilisateur connecté
 * Utilise le repository injecté pour récupérer les infos via l'endpoint /me
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly userRepository = inject(USER_REPOSITORY, { optional: true });

  /**
   * Récupère les données de l'utilisateur connecté via le endpoint GET /users/me
   */
  getCurrentUser(): Observable<UserMe> | null {
    return this.userRepository?.me() ?? null;
  }
}
