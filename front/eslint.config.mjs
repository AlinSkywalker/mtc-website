import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import prettierConfig from "eslint-config-prettier"
import pluginPrettier from "eslint-plugin-prettier"
import importPlugin from 'eslint-plugin-import';


/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      prettier: pluginPrettier, // 👋 Add prettier plugin
    },
  },
  {
    // Additional custom rules
    rules: {
      "no-console": "warn",
      "no-unused-vars": "warn",
      "react/prop-types": "off",

      // 👋 Add prettier rules at the bottom
      ...prettierConfig.rules, // Merge Prettier and ESLint rules
      "prettier/prettier": "error", // Show Prettier errors as ESLint errors
    },
  },
];