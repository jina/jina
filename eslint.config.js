/**
 * @type {import('eslint').Linter.Config[]}
 */

import js from '@eslint/js';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import prettier from 'eslint-config-prettier';
import html from 'eslint-plugin-html';
import yml from 'eslint-plugin-yml';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

import 'eslint-plugin-only-warn';

export default defineConfig([
	globalIgnores(['.wireit/', 'node_modules/']),

	{ linterOptions: { reportUnusedInlineConfigs: 'warn' } },

	{
		files: ['**/*.js'],
		...js.configs.recommended,
		languageOptions: {
			globals: { ...globals.browser, ...globals.node, ...globals.es2025 },
			sourceType: 'module',
		},
	},

	{
		files: ['**/*.json'],
		...json.configs.recommended,
		ignores: ['**/package-lock.json'],
		language: 'json/json',
	},

	{
		files: ['.vscode/*.json'],
		language: 'json/jsonc',
		languageOptions: { allowTrailingCommas: true },
	},

	{
		files: ['**/*.{yaml,yml}'],
		languageOptions: yml.configs['flat/standard'][1].languageOptions,
		plugins: { yml },
		rules: {
			...yml.configs['flat/standard'][1].rules,
			...yml.configs['flat/standard'][2].rules,
			...yml.configs['flat/prettier'][1].rules,
			...yml.configs['flat/prettier'][2].rules,
		},
	},

	{
		files: ['**/*.md'],
		language: markdown.configs.recommended[0].language,
		languageOptions: markdown.configs.processor[2].languageOptions,
		plugins: { html, markdown },
		processor: markdown.configs.processor[1].processor,
		rules: {
			...markdown.configs.recommended[0].rules,
			...markdown.configs.processor[2].rules,
		},
		settings: {
			html: {
				'html-extensions': ['.md'],
				'indent': '+tab',
				'report-bad-intent': 'warn',
			},
		},
	},

	{ rules: { ...prettier.rules } },
]);
