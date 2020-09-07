module.exports = {
  'env': {
    'browser': true,
    'es2020': true,
  },
  'extends': [
    'eslint:recommended',
    'google',
  ],
  'overrides': [
    {
      'files': ['**/*.svelte'],
      'processor': 'svelte3/svelte3',
    },
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  'plugins': [
    '@typescript-eslint',
    'svelte3',
    'prettier',
  ],
  'rules': {
    'max-len': ['error', { code: 100 }],
    'require-jsdoc': ['off'],
    'no-unused-vars': ['off'], // it is going crazy with imported types
  },
};
