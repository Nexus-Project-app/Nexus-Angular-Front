import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '@shared/services/auth.service';
import { environment } from '@app/shared/utils/env/environment';
import {
  CreateGroupPayload,
  GroupDetailDto,
  GroupMemberDto,
  GroupsListResponse,
  JoinRequestDto,
  UpdateGroupPayload,
} from '@features/groups/models/group.model';
import { PostsListResponse } from '@features/posts/models/post.model';

@Injectable({ providedIn: 'root' })
export class GroupsService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly baseUrl = `${environment.apiUrl}/groups`;

  private buildHeaders(): HttpHeaders {
    const token = this.authService.instance?.token;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  listGroups(page = 1, pageSize = 20): Observable<GroupsListResponse> {
    const params = new HttpParams().set('page', String(page)).set('pageSize', String(pageSize));
    return this.http.get<GroupsListResponse>(this.baseUrl, {
      params,
      headers: this.buildHeaders(),
      withCredentials: true,
    });
  }

  getGroupById(id: string): Observable<GroupDetailDto> {
    return this.http.get<GroupDetailDto>(`${this.baseUrl}/${id}`, {
      headers: this.buildHeaders(),
      withCredentials: true,
    });
  }

  createGroup(payload: CreateGroupPayload): Observable<string> {
    return this.http.post<string>(this.baseUrl, payload, {
      headers: this.buildHeaders(),
      withCredentials: true,
    });
  }

  updateGroup(id: string, payload: UpdateGroupPayload): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, payload, {
      headers: this.buildHeaders(),
      withCredentials: true,
    });
  }

  deleteGroup(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.buildHeaders(),
      withCredentials: true,
    });
  }

  joinGroup(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/join`, {}, {
      headers: this.buildHeaders(),
      withCredentials: true,
    });
  }

  leaveGroup(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/members/me`, {
      headers: this.buildHeaders(),
      withCredentials: true,
    });
  }

  requestJoin(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/requests`, {}, {
      headers: this.buildHeaders(),
      withCredentials: true,
    });
  }

  reviewJoinRequest(groupId: string, requestId: string, accept: boolean): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${groupId}/requests/${requestId}`, { accept }, {
      headers: this.buildHeaders(),
      withCredentials: true,
    });
  }

  getMembers(id: string): Observable<GroupMemberDto[]> {
    return this.http.get<GroupMemberDto[]>(`${this.baseUrl}/${id}/members`, {
      headers: this.buildHeaders(),
      withCredentials: true,
    });
  }

  getJoinRequests(id: string): Observable<JoinRequestDto[]> {
    return this.http.get<JoinRequestDto[]>(`${this.baseUrl}/${id}/requests`, {
      headers: this.buildHeaders(),
      withCredentials: true,
    });
  }

  kickMember(groupId: string, userId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${groupId}/members/${userId}`, {
      headers: this.buildHeaders(),
      withCredentials: true,
    });
  }

  updateMemberRole(groupId: string, userId: string, role: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${groupId}/members/${userId}/role`, { role }, {
      headers: this.buildHeaders(),
      withCredentials: true,
    });
  }

  getGroupPosts(id: string, page = 1, pageSize = 10): Observable<PostsListResponse> {
    const params = new HttpParams().set('page', String(page)).set('pageSize', String(pageSize));
    return this.http.get<PostsListResponse>(`${this.baseUrl}/${id}/posts`, {
      params,
      headers: this.buildHeaders(),
      withCredentials: true,
    });
  }
}
