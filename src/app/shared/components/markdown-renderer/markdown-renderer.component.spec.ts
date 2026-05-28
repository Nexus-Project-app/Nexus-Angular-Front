import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { MarkdownRendererComponent } from './markdown-renderer.component';
import { MarkdownService } from '../../services/markdown.service';

describe('MarkdownRendererComponent', () => {
  let component: MarkdownRendererComponent;
  let fixture: ComponentFixture<MarkdownRendererComponent>;
  let markdownService: any;

  beforeEach(async () => {
    const markdownServiceMock = {
      htmlContent: vi.fn().mockResolvedValue('<p>Test</p>'),
    };

    await TestBed.configureTestingModule({
      imports: [MarkdownRendererComponent],
      providers: [{ provide: MarkdownService, useValue: markdownServiceMock }],
    }).compileComponents();

    markdownService = TestBed.inject(MarkdownService);
    fixture = TestBed.createComponent(MarkdownRendererComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render markdown content', async () => {
    const html = '<p>Hello World</p>';
    markdownService.htmlContent.mockResolvedValue(html);

    fixture.componentRef.setInput('content', '# Hello World');
    fixture.detectChanges();
    await fixture.whenStable();

    const contentDiv = fixture.nativeElement.querySelector('.markdown-content');
    expect(contentDiv.innerHTML).toContain('Hello World');
  });

  it('should handle code blocks with language class', async () => {
    const html = '<pre><code class="language-ts">const x = 1;</code></pre>';
    markdownService.htmlContent.mockResolvedValue(html);

    fixture.componentRef.setInput('content', '```ts\nconst x = 1;\n```');
    fixture.detectChanges();
    await fixture.whenStable();

    const codeBlockShell = fixture.nativeElement.querySelector('.code-block-shell');
    expect(codeBlockShell).toBeTruthy();
  });

  it('should decorate code blocks with copy button', async () => {
    const html = '<pre><code class="language-js">console.log("test");</code></pre>';
    markdownService.htmlContent.mockResolvedValue(html);

    fixture.componentRef.setInput('content', '```js\nconsole.log("test");\n```');
    fixture.detectChanges();
    await fixture.whenStable();

    const copyButton = fixture.nativeElement.querySelector('.code-copy-button');
    expect(copyButton).toBeTruthy();
    expect(copyButton.textContent).toContain('Copy');
  });

  it('should add line numbers to code blocks', async () => {
    const code = 'line 1\nline 2\nline 3';
    const html = `<pre><code class="language-txt">${code}</code></pre>`;
    markdownService.htmlContent.mockResolvedValue(html);

    fixture.componentRef.setInput('content', '```\nline 1\nline 2\nline 3\n```');
    fixture.detectChanges();
    await fixture.whenStable();

    const lineNumbers = fixture.nativeElement.querySelectorAll('.code-line-numbers span');
    expect(lineNumbers.length).toBe(3);
  });

  it('should extract language label correctly', async () => {
    const html = '<pre><code class="language-typescript">type X = string;</code></pre>';
    markdownService.htmlContent.mockResolvedValue(html);

    fixture.componentRef.setInput('content', '```typescript\ntype X = string;\n```');
    fixture.detectChanges();
    await fixture.whenStable();

    const label = fixture.nativeElement.querySelector('.code-language-label');
    expect(label.textContent).toContain('typescript');
  });

  it('should normalize short language names', async () => {
    const html = '<pre><code class="language-ts">const x = 1;</code></pre>';
    markdownService.htmlContent.mockResolvedValue(html);

    fixture.componentRef.setInput('content', '```ts\nconst x = 1;\n```');
    fixture.detectChanges();
    await fixture.whenStable();

    const label = fixture.nativeElement.querySelector('.code-language-label');
    expect(label.textContent).toContain('typescript');
  });

  it('should handle markdown updates', async () => {
    const html1 = '<p>First</p>';
    const html2 = '<p>Second</p>';
    markdownService.htmlContent.mockResolvedValue(html1);

    fixture.componentRef.setInput('content', 'First');
    fixture.detectChanges();
    await fixture.whenStable();

    let contentDiv = fixture.nativeElement.querySelector('.markdown-content');
    expect(contentDiv.innerHTML).toContain('First');

    markdownService.htmlContent.mockResolvedValue(html2);
    fixture.componentRef.setInput('content', 'Second');
    fixture.detectChanges();
    await fixture.whenStable();

    contentDiv = fixture.nativeElement.querySelector('.markdown-content');
    expect(contentDiv.innerHTML).toContain('Second');
  });

  it('should handle render errors gracefully', async () => {
    markdownService.htmlContent.mockRejectedValue(new Error('Render failed'));
    const consoleSpy = vi.spyOn(console, 'error');

    fixture.componentRef.setInput('content', 'Invalid');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
