module.exports = {

  parser: '@typescript-eslint/parser',

  parserOptions: {
      project: './tsconfig.json',
      ecmaFeatures: {
          jsx: true
      },
  },

  plugins: ['@typescript-eslint'],

  extends: [
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended'
  ],

  settings: {
      react: {
          version: 'detect'
      }
  },

  rules: {
      'quotes': ['error', 'single'],
      'no-extra-parens': 'error',
      'require-await': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'semi': 'off',
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      '@typescript-eslint/semi': ['error', 'never'],
      '@typescript-eslint/member-delimiter-style': ['error', {
          'multiline': {
              'delimiter': 'none',
              'requireLast': false
          },
          'singleline': {
              'delimiter': 'comma',
              'requireLast': false
          }
      }],
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }]
  }

}
