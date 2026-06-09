import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../shared/utils/environment';

export interface AttachmentResponse {
  readonly key: string;
  readonly url: string;
}

@Injectable({ providedIn: 'root' })
export class AttachmentService {
  private readonly http = inject(HttpClient);

  uploadFile(postId: string, file: File): Observable<AttachmentResponse> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<AttachmentResponse>(
      `${environment.apiUrl}/posts/${postId}/attachments`,
      form,
    );
  }
}
