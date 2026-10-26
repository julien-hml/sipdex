import nextPlugin from "@next/eslint-plugin-next"
import baseConfig from "@sipdex/eslint/base"
import reactConfig from "@sipdex/eslint/react"
import globals from "globals"

/** @type {import('@sipdex/eslint').Config} */
export default [
  {
    ignores: [
      ".next",
      "next-env.d.ts",
      "playwright-report",
      "test-results",
      "tests/e2e/screenshots",
    ],
  },
  ...baseConfig,
  ...reactConfig,
  {
    languageOptions: { globals: globals.browser },
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
  {
    // Vendored shadcn components follow upstream conventions that
    // intentionally diverge from our base rules.
    files: ["src/components/ui/**"],
    rules: {
      "no-undefined": "off",
      "max-lines": "off",
      complexity: "off",
      "func-style": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
    },
  },
  {
    files: ["tests/**"],
    rules: {
      "max-lines-per-function": "off",
      "max-nested-callbacks": "off",
      "no-undefined": "off",
    },
  },
]
