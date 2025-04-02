import globals from 'globals';
import js from '@eslint/js';
import json from "@eslint/json";

export default [
    {
        files: ["**/*.js"],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
        rules: {
            ...js.configs.recommended.rules,
            'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
            'quote-props': ["error", "as-needed"],
            'semi': ['error', 'always'],
            'prefer-template': 'error',
            'prefer-object-spread': 'error',
            'no-unused-vars': 'warn',
        }
    },
    {
        files: ["**/*.json"],
        plugins: {
            json,
        },
        language: "json/json",
        rules: {
            "json/no-duplicate-keys": "error",
        },
    },
];
