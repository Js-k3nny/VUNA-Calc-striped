import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        // Browser globals
        window: "readonly",
        document: "readonly",
        console: "readonly",
        navigator: "readonly",
        alert: "readonly",
        confirm: "readonly",
        prompt: "readonly",
        setTimeout: "readonly",
        setInterval: "readonly",
        clearTimeout: "readonly",
        clearInterval: "readonly",
        fetch: "readonly",
        URL: "readonly",
        FormData: "readonly",
        localStorage: "readonly",

      },
    },
    rules: {
      "no-unused-vars": "off",
      "no-undef": "error",
    },
  },
  {
    ignores: ["assets/js/bootstrap.min.js", "test/"],
  },
];
