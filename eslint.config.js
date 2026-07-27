import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

import { rules, ruleConfigs } from './eslint/custom-rules.js';

export default [
    {
        ignores: ['node_modules', 'dist', '.astro']
    },
    {
        files: ['**/*.{js,ts,mjs,cjs,tsx,jsx}'],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                console: 'readonly',
                process: 'readonly',
                Buffer: 'readonly',
                fetch: 'readonly',
                structuredClone: 'readonly',
                Response: 'readonly',
                URL: 'readonly',
                File: 'readonly',
                FormDataEntryValue: 'readonly'
            }
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            'custom': { rules },
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tsPlugin.configs.recommended.rules,
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_'
                }
            ],
            'no-multiple-empty-lines': [
                'error',
                {
                    max: 1,
                    maxBOF: 0,
                    maxEOF: 0
                }
            ],
            ...ruleConfigs,
        }
    },
];