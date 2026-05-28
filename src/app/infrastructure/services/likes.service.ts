import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { ToggleLikeResponse } from '../../features/posts/models/post.model';
import { environment } from '../../shared/utils/environment';

@Injectable({ providedIn: 'root' })
export class LikesService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly baseUrl = `${environment.apiUrl}`;

  private buildHeaders(): HttpHeaders {
    const token = this.authService.instance?.token;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  /**
   * Toggle le like sur un post (like si pas liké, unlike sinon).
   * POST /posts/{postId}/likes
   */
  toggleLike(postId: string): Observable<ToggleLikeResponse> {
    return this.http.post<ToggleLikeResponse>(
      `${this.baseUrl}/posts/${postId}/likes`,
      {},
      { headers: this.buildHeaders(), withCredentials: true }
    );
  }
}
