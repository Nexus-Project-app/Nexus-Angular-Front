import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { CommentPagedResponse } from '../../features/posts/models/comment.model';
import { environment } from '../utils/environment';

@Injectable({ providedIn: 'root' })
export class CommentsService {
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
   * Récupère les commentaires d'un post avec pagination.
   * GET /posts/{postId}/comments?page=1&pageSize=5
   */
  getComments(postId: string, page = 1, pageSize = 5): Observable<CommentPagedResponse> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));
    return this.http.get<CommentPagedResponse>(`${this.baseUrl}/posts/${postId}/comments`, {
      params,
      headers: this.buildHeaders(),
      withCredentials: true,
    });
  }

  /**
   * Ajoute un commentaire sur un post.
   * POST /posts/{postId}/comments
   */
  addComment(postId: string, content: string): Observable<string> {
    return this.http.post<string>(
      `${this.baseUrl}/posts/${postId}/comments`,
      { content },
      { headers: this.buildHeaders(), withCredentials: true }
    );
  }

  /**
   * Modifie un commentaire existant.
   * PUT /comments/{commentId}
   */
  updateComment(commentId: string, content: string): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/comments/${commentId}`,
      { content },
      { headers: this.buildHeaders(), withCredentials: true }
    );
  }

  /**
   * Supprime un commentaire.
   * DELETE /comments/{commentId}
   */
  deleteComment(commentId: string): Observable<string> {
    return this.http.delete<string>(
      `${this.baseUrl}/comments/${commentId}`,
      { headers: this.buildHeaders(), withCredentials: true }
    );
  }
}
