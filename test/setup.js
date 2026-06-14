// Create minimal DOM for calculator tests
document.body.innerHTML = `
  <input type="text" id="result" />
  <button id="theme-toggle"></button>
`;

const fs = require("fs");
const path = require("path");

const scriptPath = path.resolve(__dirname, "../calculator/assets/js/script.js");
const scriptContent = fs.readFileSync(scriptPath, "utf8");

// Replace let with var so state variables become global object properties
const modifiedContent = scriptContent.replace("let LAST_RESULT", "var LAST_RESULT");

// Evaluate in global scope so functions become globally accessible
global.eval(modifiedContent);
