import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import pluginRouter from '@tanstack/eslint-plugin-router'
import prettier from 'eslint-config-prettier'
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended'
import unicorn from 'eslint-plugin-unicorn'
import importPlugin from 'eslint-plugin-import'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import { defineConfig, globalIgnores } from 'eslint/config'

// FSD: порядок групп для сортировки импортов (simple-import-sort)
// side-effect → node: → React → @app → @pages → @widgets → @features → @entities → @shared → @/ → внешние пакеты → relative
const fsdImportSortGroups = [
  ['^\\u0000'], // side effect
  ['^node:'],
  ['^react$', '^react-dom$'], // React первым
  ['^@app/'],
  ['^@pages/'],
  ['^@widgets/'],
  ['^@features/'],
  ['^@entities/'],
  ['^@shared/'],
  ['^@/'], // @/components, @/lib, @/types
  ['^@?\\w'], // внешние пакеты (node_modules)
  ['^\\.'], // относительные
]

// FSD: иерархия слоёв (сверху вниз) — app → pages → widgets → features → entities → shared
// Файл в слое X не может импортировать из слоёв выше X
const fsdLayerZones = [
  { target: 'src/shared', from: ['src/entities', 'src/features', 'src/widgets', 'src/pages', 'src/app', 'src/routes'] },
  { target: 'src/lib', from: ['src/entities', 'src/features', 'src/widgets', 'src/pages', 'src/app', 'src/routes'] },
  { target: 'src/types', from: ['src/entities', 'src/features', 'src/widgets', 'src/pages', 'src/app', 'src/routes'] },
  { target: 'src/entities', from: ['src/features', 'src/widgets', 'src/pages', 'src/app', 'src/routes'] },
  { target: 'src/features', from: ['src/widgets', 'src/pages', 'src/app', 'src/routes'] },
  { target: 'src/widgets', from: ['src/pages', 'src/app', 'src/routes'] },
  { target: 'src/pages', from: ['src/app', 'src/routes'] },
  { target: 'src/routes', from: ['src/app'] },
]

export default defineConfig([
  ...pluginRouter.configs['flat/recommended'],
  globalIgnores(['dist', 'dev-dist', 'src/routeTree.gen.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['dist', 'dev-dist', 'node_modules', 'src/routeTree.gen.ts'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettier,
      eslintPluginPrettier,
    ],
    plugins: {
      unicorn,
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.app.json'],
      },
    },
    rules: {
      semi: ['error', 'always'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'prettier/prettier': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/only-throw-error': [
        'error',
        {
          allow: [
            {
              from: 'package',
              package: '@tanstack/router-core',
              name: 'Redirect',
            },
            {
              from: 'package',
              package: '@tanstack/router-core',
              name: 'NotFoundError',
            },
          ],
        },
      ],
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            kebabCase: true,
          },
          ignore: [
            '^__root\\.tsx$', // TanStack Router root route
            '^routeTree\\.gen\\.ts$', // generated routes tree
            '^.+\\.d\\.ts$', // type declaration files
          ],
        },
      ],
      // FSD: запрет импорта из вышележащих слоёв
      'import/no-restricted-paths': [
        'error',
        {
          zones: fsdLayerZones.map((zone) => ({
            ...zone,
            message: `FSD: слой не может импортировать из вышележащего слоя. Разрешены только: shared ← entities ← features ← widgets ← pages ← app.`,
          })),
        },
      ],
      // Сортировка импортов: FSD-слои (@app → … → @shared → @/) → внешние пакеты → relative; между группами — пустая строка
      'simple-import-sort/imports': [
        'error',
        { groups: fsdImportSortGroups },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
  {
    files: ['src/routes/**/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['src/shared/ui/**/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['vite.config.ts'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json'],
      },
    },
  },
])
