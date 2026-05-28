import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import createDOMPurify from 'dompurify';
import { markdownToHtml } from '../utils/markdown/transform-markdown';

@Injectable({
  providedIn: 'root',
})
export class MarkdownService {
  private readonly document = inject(DOCUMENT);

  private readonly ALLOWED_TAGS = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'a', 'ul', 'ol', 'li',
    'pre', 'code', 'blockquote',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'img', 'br', 'hr',
    'strong', 'em', 's', 'del', 'sup', 'sub',
    'span', 'div', 'figure', 'figcaption',
  ];

  private readonly ALLOWED_ATTR = [
    'href', 'src', 'alt', 'title', 'class', 'id',
    'target', 'rel', 'aria-label',
  ];

  async htmlContent(content: string): Promise<string> {
    const raw = await markdownToHtml(content);
    return this.sanitize(raw);
  }

  private sanitize(html: string): string {
    const win = this.document.defaultView;
    if (!win) return html;

    const purify = createDOMPurify(win as Parameters<typeof createDOMPurify>[0]);
    return purify.sanitize(html, {
      ALLOWED_TAGS: this.ALLOWED_TAGS,
      ALLOWED_ATTR: this.ALLOWED_ATTR,
      FORCE_BODY: true,
    });
  }
}
