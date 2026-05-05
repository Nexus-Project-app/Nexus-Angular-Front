import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  // Ignore patterns
  {
    ignores: [
      'node_modules',
      'dist',
      'build',
      '.angular',
      'coverage',
      '*.log',
      '.env*',
      'public',
    ],
  },

  // Global settings
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // TypeScript files
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // Base ESLint rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'eqeqeq': ['error', 'always'],
      'no-implicit-coercion': 'error',
      'no-unused-expressions': 'error',
      'no-duplicate-imports': 'error',
      'no-irregular-whitespace': 'error',
      'curly': 'error',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { avoidEscape: true }],

      // TypeScript specific
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',

      // Prettier formatting
      'prettier/prettier': 'warn',
    },
  },

  // JavaScript files (config files, scripts, etc.)
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    ...js.configs.recommended,
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'no-console': 'warn',
      'no-debugger': 'error',
      'prettier/prettier': 'warn',
    },
  },
];
