import { describe, it, expect } from 'vitest';
import { highlightCodeBlock } from './highlight-code-block';

describe('highlightCodeBlock', () => {
  it('should highlight TypeScript code', async () => {
    const code = 'const x: string = "hello";';
    const result = await highlightCodeBlock(code, 'typescript');
    expect(result).toContain('<span');
    expect(result).not.toBe(code);
  });

  it('should highlight JavaScript code', async () => {
    const code = 'const x = "hello";';
    const result = await highlightCodeBlock(code, 'javascript');
    expect(result).toContain('<span');
  });

  it('should handle short language aliases', async () => {
    const code = 'const x = 1;';
    const tsResult = await highlightCodeBlock(code, 'ts');
    const jsResult = await highlightCodeBlock(code, 'js');
    expect(tsResult).toContain('<span');
    expect(jsResult).toContain('<span');
  });

  it('should fallback to auto-highlight for unknown language', async () => {
    const code = 'some code';
    const result = await highlightCodeBlock(code, 'unknownlang');
    expect(result).toBeDefined();
  });

  it('should auto-highlight when no language provided', async () => {
    const code = 'const x = 1;';
    const result = await highlightCodeBlock(code, undefined);
    expect(result).toBeDefined();
  });

  it('should handle HTML code', async () => {
    const code = '<div class="hello">World</div>';
    const result = await highlightCodeBlock(code, 'html');
    expect(result).toContain('<span');
  });

  it('should handle CSS code', async () => {
    const code = '.class { color: red; }';
    const result = await highlightCodeBlock(code, 'css');
    expect(result).toContain('<span');
  });

  it('should handle Python code', async () => {
    const code = 'def hello():\n    print("world")';
    const result = await highlightCodeBlock(code, 'python');
    expect(result).toContain('<span');
  });

  it('should handle JSON code', async () => {
    const code = '{"key": "value"}';
    const result = await highlightCodeBlock(code, 'json');
    expect(result).toContain('<span');
  });

  it('should handle YAML code', async () => {
    const code = 'key: value\nlist:\n  - item1';
    const result = await highlightCodeBlock(code, 'yaml');
    expect(result).toContain('<span');
  });

  it('should handle Bash code', async () => {
    const code = 'echo "hello"';
    const result = await highlightCodeBlock(code, 'bash');
    expect(result).toContain('<span');
  });

  it('should handle shell alias', async () => {
    const code = 'ls -la';
    const result = await highlightCodeBlock(code, 'shell');
    expect(result).toContain('<span');
  });

  it('should handle sh alias', async () => {
    const code = 'pwd';
    const result = await highlightCodeBlock(code, 'sh');
    expect(result).toContain('<span');
  });

  it('should handle XML code', async () => {
    const code = '<?xml version="1.0"?><root></root>';
    const result = await highlightCodeBlock(code, 'xml');
    expect(result).toContain('<span');
  });

  it('should handle JSX', async () => {
    const code = 'const el = <div>Hello</div>;';
    const result = await highlightCodeBlock(code, 'jsx');
    expect(result).toContain('<span');
  });

  it('should handle TSX', async () => {
    const code = 'const el: React.ReactNode = <div>Hello</div>;';
    const result = await highlightCodeBlock(code, 'tsx');
    expect(result).toContain('<span');
  });

  it('should cache already-loaded languages', async () => {
    const code = 'const x = 1;';
    const result1 = await highlightCodeBlock(code, 'typescript');
    const result2 = await highlightCodeBlock(code, 'typescript');
    expect(result1).toBe(result2);
  });

  it('should handle empty code', async () => {
    const result = await highlightCodeBlock('', 'typescript');
    expect(result).toBeDefined();
  });

  it('should handle multiline code', async () => {
    const code = `function hello() {
  console.log('world');
}`;
    const result = await highlightCodeBlock(code, 'javascript');
    expect(result).toContain('<span');
  });

  it('should preserve code structure', async () => {
    const code = 'const x = 1;';
    const result = await highlightCodeBlock(code, 'typescript');
    expect(result).toContain('const');
    expect(result).toContain('x');
    expect(result).toContain('1');
  });
});
