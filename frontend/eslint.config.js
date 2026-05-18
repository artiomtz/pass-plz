import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tseslint from 'typescript-eslint';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prettierOptions = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../.prettierrc'), 'utf8'));

const react = (await import('eslint-plugin-react')).default;
const importPlugin = (await import('eslint-plugin-import')).default;
const perfectionist = (await import('eslint-plugin-perfectionist')).default;

export default tseslint.config(
    { ignores: ['dist'] },
    {
        files: ['**/*.{ts,tsx}, pathAliases.ts'],
        languageOptions: {
            ecmaVersion: 2020,
            parser: tsParser,
            parserOptions: {
                sourceType: 'module',
                project: ['./tsconfig.json'],
            },
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            prettier: prettierPlugin,
            react,
            import: importPlugin,
            perfectionist,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            curly: ['error', 'all'],
            'max-depth': ['warn', 3],
            'class-methods-use-this': ['error'],
            'arrow-parens': ['error', 'always'],
            'block-spacing': ['error', 'always'],
            'arrow-body-style': ['error', 'as-needed'],
            'prettier/prettier': ['error', prettierOptions],
            'react/jsx-first-prop-new-line': ['error', 'multiline'],
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
            'object-curly-newline': ['error', { multiline: true, consistent: true }],
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
            'padding-line-between-statements': [
                'error',
                { blankLine: 'any', prev: '*', next: 'break' },
                { blankLine: 'always', prev: 'block', next: '*' },
                { blankLine: 'always', prev: '*', next: 'return' },
            ],
            'perfectionist/sort-objects': [
                'error',
                {
                    order: 'asc',
                    type: 'natural',
                },
            ],
            'perfectionist/sort-imports': [
                'error',
                {
                    order: 'asc',
                    type: 'natural',
                    newlinesBetween: 'never',
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                },
            ],
            'perfectionist/sort-interfaces': [
                'error',
                {
                    order: 'asc',
                    type: 'natural',
                },
            ],
            'perfectionist/sort-jsx-props': [
                'error',
                {
                    order: 'asc',
                    type: 'natural',
                },
            ],
        },
        settings: {},
    }
);
