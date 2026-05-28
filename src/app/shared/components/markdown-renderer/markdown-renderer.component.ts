import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, input, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MarkdownService } from '../../services/markdown.service';

@Component({
  selector: 'app-markdown-renderer',
  standalone: true,
  template: '<div class="markdown-content post-content"></div>',
  styleUrl: './markdown-renderer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkdownRendererComponent {
  content = input.required<string>();

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly markdownService = inject(MarkdownService);
  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    effect(() => {
      const markdownContent = this.content();
      void this.renderMarkdown(markdownContent);
    });
  }

  private async renderMarkdown(markdownContent: string): Promise<void> {
    try {
      const html = await this.markdownService.htmlContent(markdownContent);
      const contentDiv = this.elementRef.nativeElement.querySelector('.markdown-content');
      if (contentDiv) {
        contentDiv.innerHTML = html;
        if (isPlatformBrowser(this.platformId)) {
          this.decorateCodeBlocks(contentDiv);
        }
      }
    } catch (error) {
      console.error('[MarkdownRenderer] Failed to render markdown:', error);
    }
  }

  private decorateCodeBlocks(contentDiv: HTMLElement): void {
    const preElements = Array.from(contentDiv.querySelectorAll<HTMLPreElement>('pre'));

    preElements.forEach((preElement) => {
      const codeElement = preElement.querySelector('code');
      if (!codeElement) {
        return;
      }

      const ownerDocument = contentDiv.ownerDocument;
      if (!ownerDocument) {
        return;
      }

      const rawCode = codeElement.textContent ?? '';
      const lineCount = Math.max(rawCode.split(/\r\n|\r|\n/).length, 1);
      const languageLabel = this.extractLanguageLabel(codeElement);

      const wrapper = ownerDocument.createElement('div');
      wrapper.className = 'code-block-shell';

      const toolbar = ownerDocument.createElement('div');
      toolbar.className = 'code-block-toolbar';

      const label = ownerDocument.createElement('span');
      label.className = 'code-language-label';
      label.textContent = languageLabel;

      const copyButton = ownerDocument.createElement('button');
      copyButton.type = 'button';
      copyButton.className = 'code-copy-button';
      copyButton.textContent = 'Copy';
      copyButton.setAttribute('aria-label', 'Copy code block');

      copyButton.addEventListener('click', () => {
        void this.copyCodeBlock(rawCode, copyButton);
      });

      toolbar.append(label, copyButton);

      const body = ownerDocument.createElement('div');
      body.className = 'code-block-body';

      const lineNumbers = ownerDocument.createElement('div');
      lineNumbers.className = 'code-line-numbers';
      lineNumbers.setAttribute('aria-hidden', 'true');

      for (let lineNumber = 1; lineNumber <= lineCount; lineNumber += 1) {
        const lineNumberElement = ownerDocument.createElement('span');
        lineNumberElement.textContent = String(lineNumber);
        lineNumbers.append(lineNumberElement);
      }

      preElement.replaceWith(wrapper);
      body.append(lineNumbers, preElement);
      wrapper.append(toolbar, body);
    });
  }

  private extractLanguageLabel(codeElement: Element): string {
    const languageClass = Array.from(codeElement.classList).find((className) =>
      className.startsWith('language-'),
    );

    const language = languageClass ? languageClass.replace('language-', '') : 'code';

    if (language === 'ts') {
      return 'typescript';
    }

    if (language === 'js') {
      return 'javascript';
    }

    return language;
  }

  private async copyCodeBlock(code: string, button: HTMLButtonElement): Promise<void> {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = code;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }

    button.textContent = 'Copied!';
    button.disabled = true;
    setTimeout(() => {
      button.textContent = 'Copy';
      button.disabled = false;
    }, 2000);
  }
}
