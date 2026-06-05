import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Désactivé : apostrophes dans contenu texte statique (pages légales, etc.)
      "react/no-unescaped-entities": "off",
      // Désactivé : variables non utilisées dans API routes (Next.js pattern)
      "@typescript-eslint/no-unused-vars": "warn",
      // Désactivé : setState dans useEffect — patterns courants côté client Next.js
      "react-hooks/set-state-in-effect": "off",
      // Désactivé : fonctions impures dans render — usage acceptable pour valeurs par défaut
      "react-hooks/purity": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Tests (non lintés par CI, mais par Jest)
    "__tests__/**",
    "jest.setup.ts",
    "e2e-tests/**",
    "playwright.config.ts",
    "jest.config.js",
  ]),
]);

export default eslintConfig;
