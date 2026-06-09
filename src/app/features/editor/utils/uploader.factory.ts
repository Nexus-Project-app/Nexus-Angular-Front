import { firstValueFrom } from 'rxjs';
import type { Node } from '@milkdown/kit/prose/model';
import type { AttachmentService } from '../../../infrastructure/services/attachment.service';

export type Uploader = (files: FileList, schema: import('@milkdown/kit/prose/model').Schema) => Promise<Node[]>;

export function createUploader(postId: string, attachmentService: AttachmentService): Uploader {
  return async (files, schema): Promise<Node[]> => {
    const nodes: Node[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (!file) {
        continue;
      }

      const { url } = await firstValueFrom(attachmentService.uploadFile(postId, file));

      if (file.type.startsWith('image/')) {
        const node = schema.nodes['image'].createAndFill({
          src: url,
          alt: file.name,
          title: file.name,
        });
        if (node) {
          nodes.push(node);
        }
      } else {
        nodes.push(
          schema.text(file.name, [
            schema.marks['link'].create({ href: url, title: file.name }),
          ]),
        );
      }
    }

    return nodes;
  };
}
