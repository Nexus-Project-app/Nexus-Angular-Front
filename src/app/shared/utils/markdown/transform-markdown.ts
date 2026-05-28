import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import { highlightCodeBlock } from './highlight-code-block';

const markedInstance = new Marked(
  { gfm: true, breaks: false },
  markedHighlight({ async: true, highlight: highlightCodeBlock }),
);

export const markdownToHtml = (content: string): Promise<string> =>
  markedInstance.parse(content) as Promise<string>;
