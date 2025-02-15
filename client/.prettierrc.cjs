module.exports = {
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  arrowParens: 'avoid',
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
  printWidth: 120,
  endOfLine: 'auto',
  importOrder: ['^(react/(.*)$)|^(react$)', '<THIRD_PARTY_MODULES>', '^@(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
