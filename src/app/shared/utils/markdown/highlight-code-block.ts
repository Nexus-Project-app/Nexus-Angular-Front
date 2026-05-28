import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import scss from 'highlight.js/lib/languages/scss';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
import bash from 'highlight.js/lib/languages/bash';
import python from 'highlight.js/lib/languages/python';
import markdown from 'highlight.js/lib/languages/markdown';

hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('scss', scss);
hljs.registerLanguage('json', json);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('shell', bash);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('python', python);
hljs.registerLanguage('markdown', markdown);

const LAZY_LANGS: Record<string, () => Promise<{ default: unknown }>> = {
  java: () => import('highlight.js/lib/languages/java'),
  kotlin: () => import('highlight.js/lib/languages/kotlin'),
  c: () => import('highlight.js/lib/languages/c'),
  cpp: () => import('highlight.js/lib/languages/cpp'),
  csharp: () => import('highlight.js/lib/languages/csharp'),
  rust: () => import('highlight.js/lib/languages/rust'),
  go: () => import('highlight.js/lib/languages/go'),
  php: () => import('highlight.js/lib/languages/php'),
  ruby: () => import('highlight.js/lib/languages/ruby'),
  swift: () => import('highlight.js/lib/languages/swift'),
  sql: () => import('highlight.js/lib/languages/sql'),
  graphql: () => import('highlight.js/lib/languages/graphql'),
  dockerfile: () => import('highlight.js/lib/languages/dockerfile'),
  less: () => import('highlight.js/lib/languages/less'),
};

const LANG_ALIASES: Record<string, string> = {
  ts: 'typescript',
  js: 'javascript',
  jsx: 'javascript',
  tsx: 'typescript',
  html: 'xml',
  cs: 'csharp',
  'c++': 'cpp',
};

const loadingLangs = new Set<string>();

async function ensureLangLoaded(lang: string): Promise<void> {
  if (hljs.getLanguage(lang) || loadingLangs.has(lang)) return;
  if (!(lang in LAZY_LANGS)) return;

  loadingLangs.add(lang);
  try {
    const mod = await LAZY_LANGS[lang]();
    hljs.registerLanguage(lang, mod.default as Parameters<typeof hljs.registerLanguage>[1]);
  } catch {
    loadingLangs.delete(lang);
  }
}

export async function highlightCodeBlock(code: string, language: string | undefined): Promise<string> {
  if (!language) return hljs.highlightAuto(code).value;

  const normalized = LANG_ALIASES[language] ?? language;
  await ensureLangLoaded(normalized);

  if (!hljs.getLanguage(normalized)) return hljs.highlightAuto(code).value;

  return hljs.highlight(code, { language: normalized }).value;
}
