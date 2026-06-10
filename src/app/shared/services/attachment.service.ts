import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../utils/env/environment';

export interface AttachmentResponse {
  readonly key: string;
  readonly url: string;
}

@Injectable({ providedIn: 'root' })
export class AttachmentService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  uploadFile(postId: string, file: File): Observable<AttachmentResponse> {
    const form = new FormData();
    form.append('file', file);
    const token = this.authService.instance?.token;
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.post<AttachmentResponse>(
      `${environment.apiUrl}/posts/${postId}/attachments`,
      form,
      { headers, withCredentials: true },
    );
  }
}
