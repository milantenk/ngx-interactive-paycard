// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  { ignores: ["dist/**", "node_modules/**", "**/*.d.ts"] },
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
  },
  {
    files: ["projects/ngx-interactive-paycard-lib/**/*.ts"],
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        { type: "attribute", prefix: "lib", style: "camelCase" }
      ],
      "@angular-eslint/component-selector": [
        "error",
        { type: "element", prefix: ["lib", "ngx"], style: "kebab-case" }
      ]
    }
  },
  {
    files: ["projects/ngx-interactive-paycard-demo/**/*.ts"],
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        { type: "attribute", prefix: "app", style: "camelCase" }
      ],
      "@angular-eslint/component-selector": [
        "error",
        { type: "element", prefix: "app", style: "kebab-case" }
      ]
    }
  },
  {
    files: ["**/*.html"],
    extends: [...angular.configs.templateRecommended],
    rules: {}
  }
);
