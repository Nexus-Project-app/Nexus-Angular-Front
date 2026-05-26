import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { PostDto, PostPayload, PostsListResponse } from '../../features/posts/models/post.model';
import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly baseUrl = `${environment.apiUrl}/posts`;

  private buildHeaders(): HttpHeaders {
    const token = this.authService.instance?.token;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  /**
   * Create a new post.
   * Backend returns just the post ID (UUID string).
   */
  createPost(payload: PostPayload): Observable<string> {
    const body = {
      title: payload.title,
      content: payload.content,
      tags: payload.tags ?? [],
    };
    return this.http.post<string>(this.baseUrl, body, {
      headers: this.buildHeaders(),
      withCredentials: true,
    });
  }

  /**
   * List all posts with pagination.
   * Backend returns paginated response with items array.
   */
  listPosts(page = 1, pageSize = 10): Observable<PostsListResponse> {
    const params = new HttpParams().set('page', String(page)).set('pageSize', String(pageSize));
    return this.http.get<PostsListResponse>(this.baseUrl, {
      params,
      headers: this.buildHeaders(),
      withCredentials: true,
    });
  }

  /**
   * Get a single post by ID.
   * Public endpoint, no authentication required.
   */
  getPostById(id: string): Observable<PostDto> {
    return this.http.get<PostDto>(`${this.baseUrl}/${id}`, {
      headers: this.buildHeaders(),
      withCredentials: true,
    });
  }

  /**
   * Update a post by ID.
   * Backend returns 204 No Content (no response body).
   */
  updatePost(id: string, payload: PostPayload): Observable<void> {
    const body = {
      title: payload.title,
      content: payload.content,
      tags: payload.tags ?? [],
    };
    return this.http.put<void>(`${this.baseUrl}/${id}`, body, {
      headers: this.buildHeaders(),
      withCredentials: true,
    });
  }

  /**
   * Delete a post by ID.
   * Backend returns the deleted post ID (UUID string).
   */
  deletePost(id: string): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/${id}`, {
      headers: this.buildHeaders(),
      withCredentials: true,
    });
  }
}
