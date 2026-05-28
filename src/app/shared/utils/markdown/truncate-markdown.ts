/**
 * Truncate markdown content, preserving text while stripping syntax.
 * Removes markdown formatting chars and collapses whitespace.
 */
export function truncateMarkdown(markdown: string, maxChars: number): string {
  if (!markdown || markdown.length === 0) {
    return '';
  }

  // Remove markdown syntax characters
  let text = markdown
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1') // Remove bold/italic
    .replace(/_([^_]+)_/g, '$1') // Remove underscores
    .replace(/`([^`]+)`/g, '$1') // Remove inline code
    .replace(/~~([^~]+)~~\n/g, '$1') // Remove strikethrough
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove link syntax
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // Remove image syntax
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/>\s*/g, '') // Remove blockquotes
    .replace(/[-*+]\s+/g, '') // Remove list markers
    .replace(/\n+/g, ' ') // Collapse newlines to spaces
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim();

  if (text.length > maxChars) {
    text = text.substring(0, maxChars).trimEnd() + '...';
  }

  return text;
}
