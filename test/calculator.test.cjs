/**
 * @jest-environment jsdom
 */

const { readFileSync } = require("fs");
const { resolve } = require("path");
const vm = require("vm");

const scriptContent = readFileSync(
  resolve(__dirname, "../assets/js/script.js"),
  "utf-8",
);

const script = new vm.Script(scriptContent);

function setupCalculator() {
  document.body.innerHTML = `
    <input type="text" id="result" />
    <button id="theme-toggle">🌙</button>
  `;

  const sandbox = {
    window,
    document,
    console,
    localStorage,
    navigator,
    Math,
    isNaN,
    isFinite,
    parseFloat,
    parseInt,
    String,
    Error,
  };

  const context = vm.createContext(sandbox);
  script.runInContext(context);

  return {
    normalizeExpression: sandbox.normalizeExpression,
    calculateExpression: sandbox.calculateExpression,
    appendToResult: sandbox.appendToResult,
    bracketToResult: sandbox.bracketToResult,
    backspace: sandbox.backspace,
    operatorToResult: sandbox.operatorToResult,
    clearResult: sandbox.clearResult,
    calculateResult: sandbox.calculateResult,
    percentToResult: sandbox.percentToResult,
  };
}

describe("normalizeExpression", () => {
  let normalizeExpression;

  beforeEach(() => {
    ({ normalizeExpression } = setupCalculator());
  });

  test("replaces sin( with sinDeg(", () => {
    expect(normalizeExpression("sin(30)")).toBe("sinDeg(30)");
  });

  test("replaces cos( with cosDeg(", () => {
    expect(normalizeExpression("cos(60)")).toBe("cosDeg(60)");
  });

  test("replaces tan( with tanDeg(", () => {
    expect(normalizeExpression("tan(45)")).toBe("tanDeg(45)");
  });

  test("replaces asin( with asinDeg(", () => {
    expect(normalizeExpression("asin(0.5)")).toBe("asinDeg(0.5)");
  });

  test("replaces acos( with acosDeg(", () => {
    expect(normalizeExpression("acos(0.5)")).toBe("acosDeg(0.5)");
  });

  test("replaces atan( with atanDeg(", () => {
    expect(normalizeExpression("atan(1)")).toBe("atanDeg(1)");
  });

  test("replaces e with Math.E", () => {
    expect(normalizeExpression("e")).toBe("Math.E");
  });

  test("replaces pi with Math.PI", () => {
    expect(normalizeExpression("pi")).toBe("Math.PI");
  });

  test("replaces sqrt( with Math.sqrt(", () => {
    expect(normalizeExpression("sqrt(9)")).toBe("Math.sqrt(9)");
  });

  test("does not replace sinh( or asinh(", () => {
    expect(normalizeExpression("sinh(1)")).toBe("sinh(1)");
    expect(normalizeExpression("asinh(1)")).toBe("asinh(1)");
  });
});

describe("calculateExpression", () => {
  let calculateExpression;

  beforeEach(() => {
    ({ calculateExpression } = setupCalculator());
  });

  test("evaluates simple addition", () => {
    expect(calculateExpression("2+3")).toBe(5);
  });

  test("evaluates simple multiplication", () => {
    expect(calculateExpression("4*5")).toBe(20);
  });

  test("evaluates division", () => {
    expect(calculateExpression("10/2")).toBe(5);
  });

  test("evaluates subtraction", () => {
    expect(calculateExpression("10-3")).toBe(7);
  });

  test("evaluates exponentiation", () => {
    expect(calculateExpression("2**3")).toBe(8);
  });

  test("evaluates complex expression", () => {
    expect(calculateExpression("2+3*4")).toBe(14);
  });

  test("evaluates parentheses", () => {
    expect(calculateExpression("(2+3)*4")).toBe(20);
  });

  test("returns Error for invalid expression", () => {
    expect(calculateExpression("abc")).toBe("Error");
  });

  test("returns Error for division by zero", () => {
    expect(calculateExpression("1/0")).toBe("Error");
  });

  test("evaluates Math.PI", () => {
    expect(calculateExpression("pi")).toBeCloseTo(Math.PI);
  });

  test("evaluates Math.E", () => {
    expect(calculateExpression("e")).toBeCloseTo(Math.E);
  });

  test("evaluates sqrt(9)", () => {
    expect(calculateExpression("sqrt(9)")).toBeCloseTo(3);
  });
});

describe("appendToResult", () => {
  let calc;

  beforeEach(() => {
    calc = setupCalculator();
  });

  test("appends number to expression", () => {
    calc.appendToResult(5);
    expect(document.getElementById("result").value).toBe("5");
  });

  test("appends multiple digits", () => {
    calc.appendToResult(1);
    calc.appendToResult(2);
    calc.appendToResult(3);
    expect(document.getElementById("result").value).toBe("123");
  });

  test("appends decimal point", () => {
    calc.appendToResult(3);
    calc.appendToResult(".");
    calc.appendToResult(1);
    expect(document.getElementById("result").value).toBe("3.1");
  });
});

describe("bracketToResult", () => {
  let calc;

  beforeEach(() => {
    calc = setupCalculator();
  });

  test("appends opening bracket", () => {
    calc.bracketToResult("(");
    expect(document.getElementById("result").value).toBe("(");
  });

  test("appends closing bracket", () => {
    calc.bracketToResult("(");
    calc.bracketToResult(")");
    expect(document.getElementById("result").value).toBe("()");
  });
});

describe("backspace", () => {
  let calc;

  beforeEach(() => {
    calc = setupCalculator();
  });

  test("removes last character", () => {
    calc.appendToResult(1);
    calc.appendToResult(2);
    calc.appendToResult(3);
    calc.backspace();
    expect(document.getElementById("result").value).toBe("12");
  });

  test("clears to empty on single character", () => {
    calc.appendToResult(5);
    calc.backspace();
    expect(document.getElementById("result").value).toBe("0");
  });
});

describe("operatorToResult", () => {
  let calc;

  beforeEach(() => {
    calc = setupCalculator();
  });

  test("appends + operator", () => {
    calc.appendToResult(5);
    calc.operatorToResult("+");
    expect(document.getElementById("result").value).toBe("5+");
  });

  test("appends - operator", () => {
    calc.appendToResult(5);
    calc.operatorToResult("-");
    expect(document.getElementById("result").value).toBe("5-");
  });

  test("appends * operator", () => {
    calc.appendToResult(5);
    calc.operatorToResult("*");
    expect(document.getElementById("result").value).toBe("5*");
  });

  test("appends / operator", () => {
    calc.appendToResult(5);
    calc.operatorToResult("/");
    expect(document.getElementById("result").value).toBe("5/");
  });

  test("converts ^ to ** for exponentiation", () => {
    calc.appendToResult(2);
    calc.operatorToResult("^");
    expect(document.getElementById("result").value).toBe("2**");
  });
});

describe("clearResult", () => {
  let calc;

  beforeEach(() => {
    calc = setupCalculator();
  });

  test("clears the expression", () => {
    calc.appendToResult(1);
    calc.appendToResult(2);
    calc.appendToResult(3);
    calc.clearResult();
    expect(document.getElementById("result").value).toBe("0");
  });
});

describe("calculateResult", () => {
  let calc;

  beforeEach(() => {
    calc = setupCalculator();
  });

  test("calculates and displays result", () => {
    calc.appendToResult(2);
    calc.operatorToResult("+");
    calc.appendToResult(3);
    calc.calculateResult();
    expect(document.getElementById("result").value).toBe("5");
  });

  test("handles empty expression", () => {
    calc.calculateResult();
    expect(document.getElementById("result").value).toBe("");
  });

  test("chained calculations use previous result", () => {
    calc.appendToResult(5);
    calc.operatorToResult("+");
    calc.appendToResult(3);
    calc.calculateResult();
    expect(document.getElementById("result").value).toBe("8");
  });
});

describe("percentToResult", () => {
  let calc;

  beforeEach(() => {
    calc = setupCalculator();
  });

  test("converts standalone number to percentage", () => {
    calc.appendToResult(5);
    calc.appendToResult(0);
    calc.percentToResult();
    const result = document.getElementById("result").value;
    expect(result).toContain("0.5");
  });
});
