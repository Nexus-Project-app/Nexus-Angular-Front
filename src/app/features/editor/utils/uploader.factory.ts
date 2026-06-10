import { firstValueFrom } from 'rxjs';
import type { AttachmentService } from '../../../shared/services/attachment.service';

export function createImageUploader(
  postId: string,
  attachmentService: AttachmentService,
): (file: File) => Promise<string> {
  return async (file: File): Promise<string> => {
    const { url } = await firstValueFrom(attachmentService.uploadFile(postId, file));
    return url;
  };
}
