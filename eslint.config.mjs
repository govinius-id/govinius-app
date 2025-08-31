import { createConfigForNuxt } from '@nuxt/eslint-config/flat';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default createConfigForNuxt().append({
  ...eslintPluginPrettierRecommended,
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'import/no-named-as-default-member': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-v-model-argument': 'off',
    'vue/require-prop-types': 'off',
    'vue/require-default-prop': 'off',
    'vue/no-v-html': 'off',
    'vue/no-v-text-v-html-on-component': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'never',
          component: 'always',
        },
      },
    ],
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        printWidth: 80,
        singleQuote: true,
        trailingComma: 'all',
        plugins: ['prettier-plugin-tailwindcss'],
        tailwindStylesheet: './assets/css/tailwind.css',
      },
    ],
  },
});
