// eslint.config.mjs
import js from '@eslint/js';
import next from 'eslint-config-next';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  js.configs.recommended,
  ...next, // รวม config ของ Next (core-web-vitals)
  {
    rules: {
      // เพิ่มกฎของคุณได้ที่นี่ เช่น
      // 'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
];
