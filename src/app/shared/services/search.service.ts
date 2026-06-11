import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { AuthService } from '@shared/services/auth.service';
import { PostsListResponse } from '@features/posts/models/post.model';
import { GroupsListResponse } from '@features/groups/models/group.model';
import { environment } from '@app/shared/utils/env/environment';

export interface SearchAllResult {
  readonly posts: PostsListResponse;
  readonly groups: GroupsListResponse;
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private buildHeaders(): HttpHeaders {
    const token = this.authService.instance?.token;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  searchAll(term: string): Observable<SearchAllResult> {
    const options = { headers: this.buildHeaders(), withCredentials: true };
    const postParams = new HttpParams().set('page', '1').set('pageSize', '5').set('search', term);
    const groupParams = new HttpParams().set('page', '1').set('pageSize', '5').set('search', term);

    return forkJoin({
      posts: this.http.get<PostsListResponse>(`${environment.apiUrl}/posts`, { ...options, params: postParams }),
      groups: this.http.get<GroupsListResponse>(`${environment.apiUrl}/groups`, { ...options, params: groupParams }),
    });
  }
}
