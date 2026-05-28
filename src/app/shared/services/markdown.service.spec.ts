import { TestBed } from '@angular/core/testing';
import { describe, it, beforeEach, expect } from 'vitest';
import { MarkdownService } from './markdown.service';

describe('MarkdownService', () => {
  let service: MarkdownService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MarkdownService],
    });
    service = TestBed.inject(MarkdownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should convert markdown to HTML', async () => {
    const markdown = '# Hello World';
    const result = await service.htmlContent(markdown);
    expect(result).toContain('<h1');
    expect(result).toContain('Hello World');
  });

  it('should handle paragraphs', async () => {
    const markdown = 'This is a paragraph';
    const result = await service.htmlContent(markdown);
    expect(result).toContain('<p>');
    expect(result).toContain('This is a paragraph');
  });

  it('should handle emphasis markdown', async () => {
    const markdown = '**bold** and *italic*';
    const result = await service.htmlContent(markdown);
    expect(result).toContain('<strong>');
    expect(result).toContain('<em>');
  });

  it('should handle code blocks with language', async () => {
    const markdown = '```typescript\nconst x = 1;\n```';
    const result = await service.htmlContent(markdown);
    expect(result).toContain('<code');
    expect(result).toContain('language-typescript');
  });

  it('should handle unordered lists', async () => {
    const markdown = '- item 1\n- item 2';
    const result = await service.htmlContent(markdown);
    expect(result).toContain('<ul>');
    expect(result).toContain('<li>');
  });

  it('should handle ordered lists', async () => {
    const markdown = '1. first\n2. second';
    const result = await service.htmlContent(markdown);
    expect(result).toContain('<ol>');
    expect(result).toContain('<li>');
  });

  it('should handle links', async () => {
    const markdown = '[Google](https://google.com)';
    const result = await service.htmlContent(markdown);
    expect(result).toContain('<a');
    expect(result).toContain('href="https://google.com"');
  });

  it('should sanitize dangerous HTML', async () => {
    const markdown = '<script>alert("xss")</script>';
    const result = await service.htmlContent(markdown);
    expect(result).not.toContain('<script>');
  });

  it('should preserve safe HTML attributes', async () => {
    const markdown = '[Link](https://example.com)';
    const result = await service.htmlContent(markdown);
    expect(result).toContain('href=');
  });

  it('should handle complex markdown', async () => {
    const markdown = `# Title
This is a paragraph.
- List item 1
- List item 2
\`\`\`js
console.log('test');
\`\`\`
**Bold** and *italic*`;
    const result = await service.htmlContent(markdown);
    expect(result).toContain('<h1');
    expect(result).toContain('<ul>');
    expect(result).toContain('<code');
    expect(result).toContain('<strong>');
  });

  it('should handle empty content', async () => {
    const markdown = '';
    const result = await service.htmlContent(markdown);
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });
});
