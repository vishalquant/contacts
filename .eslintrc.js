module.exports = {
  env: {
    es6: true,
  },
  extends: ['plugin:prettier/recommended'],

  plugins: ['prettier', 'typescript'],
  parser: 'typescript-eslint-parser',
  rules: {
    'prettier/prettier': 'error',
    'no-unused-vars': 'warn',
    'no-console': 'warn',
  },
};
