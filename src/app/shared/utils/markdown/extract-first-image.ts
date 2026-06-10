const MARKDOWN_IMAGE_RE = /!\[(?:[^\]]*)\]\(([^)]+)\)/;

export function extractFirstImage(markdown: string): string | null {
  const match = MARKDOWN_IMAGE_RE.exec(markdown);
  return match ? match[1] : null;
}
