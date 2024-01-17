module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:react/recommended",
  ],
  ignorePatterns: ["**/node_modules/*", "**/template/**"],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
    react: {
      version: "detect",
    },
  },
  plugins: [
    "@typescript-eslint",
    "etc",
    "import",
    "sort-keys-fix",
    "unused-imports",
    "react",
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "off",
    "no-inline-comments": "off",
    "no-commented-out-code": "off",
    "multiline-comment-style": "off",
    "no-useless-catch": "off",
    "array-bracket-newline": [
      "error",
      {
        minItems: 5,
        multiline: true,
      },
    ],
    "array-bracket-spacing": ["error", "never"],
    "array-element-newline": ["error", { minItems: 5, multiline: true }],
    "comma-dangle": ["error", { arrays: "only-multiline", objects: "only-multiline" }],
    "comma-spacing": ["error", { after: true, before: false }],
    "etc/no-commented-out-code": "error",
    "id-length": ["error", { exceptions: ["i", "j", "id"], min: 2, properties: "never" }],
    "import/order": [
      "error",
      {
        alphabetize: {
          caseInsensitive: true,
          order: "asc",
        },
        groups: ["builtin", "external", "internal"],
        "newlines-between": "always",
      },
    ],
    indent: ["error", 2, { MemberExpression: 1, SwitchCase: 1 }],
    "key-spacing": ["error", { align: "colon" }],
    "linebreak-style": ["error", "unix"],
    "newline-after-var": ["error", "always"],
    "newline-per-chained-call": ["error", { ignoreChainWithDepth: 3 }],
    "no-console": "off",
    "no-multi-spaces": ["error", { exceptions: { VariableDeclarator: true } }],
    "no-multiple-empty-lines": ["error", { max: 1 }],
    "no-var": "error",
    "object-curly-newline": [
      "error",
      {
        ExportDeclaration: { minProperties: 6, multiline: true },
        ImportDeclaration: { minProperties: 6, multiline: true },
        ObjectExpression: { minProperties: 6, multiline: true },
        ObjectPattern: { minProperties: 6, multiline: true },
      },
    ],
    "object-curly-spacing": ["error", "always"],
    "object-property-newline": ["error", { allowAllPropertiesOnSameLine: true }],
    "padding-line-between-statements": [
      "error",
      {
        blankLine: "always",
        next: "*",
        prev: ["const", "let", "var"],
      },
      {
        blankLine: "any",
        next: ["const", "let", "var"],
        prev: ["const", "let", "var"],
      },
      {
        blankLine: "always",
        next: "*",
        prev: ["case", "default"],
      },
    ],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "sort-keys-fix/sort-keys-fix": "error",
    "space-infix-ops": ["error", { int32Hint: false }],
    "unused-imports/no-unused-imports": "error",
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
  },
};
