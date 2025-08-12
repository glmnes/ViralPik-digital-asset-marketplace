﻿module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    '@next/next/no-img-element': 'off',
    'react/no-unescaped-entities': 'off',
    'prefer-const': 'warn'
  }
};
