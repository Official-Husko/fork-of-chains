// @ts-ignore
module.exports = {
  "plugins": ["solid"],
  "extends": ["eslint:recommended", "plugin:solid/recommended"],
  "env": {
    "browser": true,
    "es2021": true
  },
  "ignorePatterns": [
    "gulpfile.js",
    "dev/**/*",
    "dist/**/*",
    "docs/**/*",
    "generated/**/*",
    "project/**/*",
    "src/modules/**/*",
    "src/**/third-party/**/*",
    "/vite.config.js"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "indent": ["warn", 2, { "SwitchCase": 1 }],
    "linebreak-style": ["error", "unix"],
    //"quotes": ["warn", "single"],
    "semi": ["warn", "never"],
    "no-var": "error",
    "no-undef": "off",
    "no-unused-vars": "off", // "warn",
    "no-constant-condition": "warn",
  },
  "overrides": [],
}
