// ===============================
// 🧠 SMART RESULT MEMORY FEATURE
// ===============================

let LAST_RESULT = 0;
var currentExpression = "";

// ------------------------------
// Theme Toggle Logic
// ------------------------------
function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById("theme-toggle");

  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    btn.innerHTML = "☀️";
    btn.title = "Switch to light mode";
    localStorage.setItem("theme", "dark");
  } else {
    btn.innerHTML = "🌙";
    btn.title = "Switch to dark mode";
    localStorage.setItem("theme", "light");
  }
}

// Set theme on page load from localStorage
window.addEventListener("DOMContentLoaded", function () {
  const theme = localStorage.getItem("theme");
  const body = document.body;
  const btn = document.getElementById("theme-toggle");

  if (btn) {
    if (theme === "dark") {
      body.classList.add("dark-mode");
      btn.innerHTML = "☀️";
      btn.title = "Switch to light mode";
    } else {
      btn.innerHTML = "🌙";
      btn.title = "Switch to dark mode";
    }
  }
});

// ------------------------------
// Calculator State
// ------------------------------
let left = "";
let operator = "";
let right = "";
let steps = [];
const MAX_STEPS = 6;

// ------------------------------
// Basic Calculator Functions
// ------------------------------
function appendToResult(value) {
  currentExpression += value.toString();
  updateResult();
}

function bracketToResult(value) {
  currentExpression += value;
  updateResult();
}

function backspace() {
  currentExpression = currentExpression.slice(0, -1);
  updateResult();
}

function operatorToResult(value) {
  if (value === "^") {
    currentExpression += "**";
  } else {
    currentExpression += value;
  }
  updateResult();
}

function clearResult() {
  currentExpression = "";
  updateResult();
}


function normalizeExpression(expr) {
  return expr
    .replace(/asin\(/g, "asinDeg(")
    .replace(/acos\(/g, "acosDeg(")
    .replace(/atan\(/g, "atanDeg(")
    .replace(/sin\(/g, "sinDeg(")
    .replace(/cos\(/g, "cosDeg(")
    .replace(/tan\(/g, "tanDeg(")
    .replace(/asinh\(/g, "asinh(")
    .replace(/sinh\(/g, "sinh(")
    .replace(/\be\b/g, "Math.E")
    .replace(/\bpi\b/g, "Math.PI");
}

function percentToResult() {
  if (!currentExpression) return;

  const match = currentExpression.match(/(.+?)(\*\*|[+\-*/^])([0-9.]*)$/);

  if (!match) {
    const num = parseFloat(currentExpression);
    if (isNaN(num)) return;

    currentExpression = (num / 100).toString();
  } else {
    const leftPart = match[1];
    const rightPart = match[3];

    if (!rightPart) return;

    let leftVal;

    try {
      leftVal = eval(leftPart);
    } catch (e) {
      leftVal = parseFloat(leftPart);
    }

    const rightVal = parseFloat(rightPart);
    if (isNaN(leftVal) || isNaN(rightVal)) return;

    const percentVal = (leftVal * rightVal) / 100;

    currentExpression = percentVal.toString();
  }

  // 🔥 ADD THIS LINE
  currentExpression += "*";

  updateResult();
}

// ------------------------------
// Calculate Result
// ------------------------------
function calculateExpression(expression) {
  try {
   
    let normalizedExpression = normalizeExpression(expression);

    // 🧠 Replace "ans" with last result automatically
    normalizedExpression = normalizedExpression.replace(
      /\bans\b/gi,
      LAST_RESULT,
    );

    // Calculate result
    let result = eval(normalizedExpression);
    console.log("Calculated result for expression:", expression, "->", result);
 
    if (isNaN(result) || !isFinite(result)) {
      throw new Error();
    }

    return result;
  } catch (e) {
    return "Error";
  }
}
function calculateResult() {
  if (!currentExpression) return;
    const display = document.getElementById("result"); 
    // Calculate result
    let result = calculateExpression(currentExpression);
    result = String(result);

    // Save result for future expressions
    LAST_RESULT = result;

    // Display normally
    display.value = result;

    currentExpression = result;
    updateResult();
}


function updateResult() {
  document.getElementById("result").value = currentExpression || "0";
}

// ===============================
// 🔢 NUMBER ANALYZER FEATURE
// ===============================

function isPrime(n) {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

function primeFactorization(n) {
  const factors = [];
  let d = 2;
  while (d * d <= n) {
    while (n % d === 0) {
      factors.push(d);
      n /= d;
    }
    d++;
  }
  if (n > 1) factors.push(n);
  return factors;
}

function countDivisors(n) {
  const factors = primeFactorization(n);
  const counts = {};
  factors.forEach(f => { counts[f] = (counts[f] || 0) + 1; });
  let total = 1;
  for (const exp in counts) {
    total *= (counts[exp] + 1);
  }
  return total;
}

function sumDivisors(n) {
  let sum = 0;
  for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      sum += i;
      if (i !== n / i) sum += n / i;
    }
  }
  return sum;
}

function isPerfectNumber(n) {
  return sumDivisors(n) - n === n && n > 1;
}

function isFibonacci(n) {
  if (n < 0) return false;
  const a = 5 * n * n + 4;
  const b = 5 * n * n - 4;
  const sqrtA = Math.round(Math.sqrt(a));
  const sqrtB = Math.round(Math.sqrt(b));
  return sqrtA * sqrtA === a || sqrtB * sqrtB === b;
}

function formatFactors(factors) {
  if (factors.length === 0) return "—";
  const counts = {};
  factors.forEach(f => { counts[f] = (counts[f] || 0) + 1; });
  return Object.entries(counts)
    .map(([base, exp]) => exp > 1 ? `${base}<sup>${exp}</sup>` : base)
    .join(" × ");
}

function analyzeNumber() {
  const panel = document.getElementById("analyzer-panel");
  const output = document.getElementById("analyzer-output");
  const raw = currentExpression.trim();
  const num = parseFloat(raw);

  if (!raw || isNaN(num) || num < 0 || !Number.isInteger(num)) {
    panel.style.display = "block";
    output.innerHTML = "<span class=\"prime-no\">Enter a non-negative integer on the display first.</span>";
    return;
  }

  const n = num;
  const factors = primeFactorization(n);
  const divisors = countDivisors(n);
  const sum = sumDivisors(n);
  const prime = isPrime(n);
  const perfect = isPerfectNumber(n);
  const fib = isFibonacci(n);

  let html = "";
  html += "<span class=\"label\">Input:</span> <span class=\"val\">" + n + "</span><br>";
  html += "<span class=\"label\">Prime:</span> <span class=\"" + (prime ? "prime-yes" : "prime-no") + "\">" + (prime ? "Yes" : "No") + "</span><br>";
  html += "<span class=\"label\">Factorization:</span> <span class=\"val\">" + formatFactors(factors) + "</span><br>";
  html += "<span class=\"label\">Divisors:</span> <span class=\"val\">" + divisors + "</span><br>";
  html += "<span class=\"label\">Sum of divisors:</span> <span class=\"val\">" + sum + "</span><br>";
  html += "<span class=\"label\">Perfect number:</span> <span class=\"" + (perfect ? "special-yes" : "") + "\">" + (perfect ? "Yes" : "No") + "</span><br>";
  html += "<span class=\"label\">Fibonacci number:</span> <span class=\"" + (fib ? "special-yes" : "") + "\">" + (fib ? "Yes" : "No") + "</span>";

  panel.style.display = "block";
  output.innerHTML = html;
}