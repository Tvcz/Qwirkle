module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  parser: '@typescript-eslint/parser',
  extends: ['prettier', 'plugin:@typescript-eslint/recommended'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
  },
  overrides: [
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ]
};
