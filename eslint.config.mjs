import eslint from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['out/**', 'dist/**', 'node_modules/**', 'coverage/**'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/main/**/*.ts', 'src/preload/**/*.ts', 'database/seeds/**/*.mjs', 'electron.vite.config.ts', 'vitest.config.ts'],
    languageOptions: { globals: globals.node }
  },
  {
    files: ['src/renderer/**/*.ts'],
    languageOptions: { globals: globals.browser }
  },
  {
    files: ['prototipos/enzo/**/*.ts'],
    languageOptions: { globals: globals.browser }
  }
)
