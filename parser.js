// parser.js - موتور تبدیل وابسته به dictionary سراسری
class Parser {
  constructor() {
    this.dict = window.dictionary || {};
    this.rules = [
      // الگو: چاپ کن ...
      { pattern: /^چاپ کن (.*)$/, replacer: (match, p1) => `console.log(${this.parseValue(p1)})` },

      // الگو: متغیر به نام X با مقدار Y
      { pattern: /^(?:یک )?متغیر به نام (\S+) با مقدار (.+)$/, replacer: (match, name, value) => `let ${name} = ${this.parseValue(value)};` },

      // الگو: تابع به نام X بنویس که Y رو انجام بده
      { pattern: /^(?:یک )?تابع به نام (\S+) بنویس که (.+)$/, replacer: (match, name, body) => `function ${name}() { ${this.parseStatement(body)} }` },

      // الگو: اگر X بود Y رو بکن
      { pattern: /^اگر (.+) بود (.+)$/, replacer: (match, condition, action) => `if (${this.parseExpression(condition)}) { ${this.parseStatement(action)} }` },

      // الگو: برای i از ۱ تا ۱۰ ...
      { pattern: /^برای (\S+) از (\d+) تا (\d+) (.+)$/, replacer: (match, varName, start, end, body) => `for (let ${varName}=${start}; ${varName}<=${end}; ${varName}++) { ${this.parseStatement(body)} }` },

      // الگو: تعریف آرایه به نام X با مقادیر a, b, c
      { pattern: /^تعریف آرایه به نام (\S+) با مقادیر (.+)$/, replacer: (match, name, values) => `let ${name} = [${values.split('،').map(v => this.parseValue(v.trim())).join(', ')}];` },

      // الگو: اضافه کن به آرایه X مقدار Y
      { pattern: /^اضافه کن به آرایه (\S+) مقدار (.+)$/, replacer: (match, arr, val) => `${arr}.push(${this.parseValue(val)});` }
    ];
  }

  // تبدیل مقدار (عدد، رشته، متغیر)
  parseValue(expr) {
    expr = expr.trim();
    // اگر عدد است
    if (/^\d+$/.test(expr)) return expr;
    // اگر رشته ساده (بدون فاصله) احتمالاً متغیر است
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(expr)) return expr;
    // در غیر این صورت به عنوان رشته در نظر بگیر
    return `"${expr}"`;
  }

  parseExpression(expr) {
    // جایگزینی کلمات کلیدی در عبارت
    let result = expr;
    for (let [fa, en] of Object.entries(this.dict)) {
      result = result.replace(new RegExp(fa, 'g'), en);
    }
    return result;
  }

  parseStatement(stmt) {
    return this.parse(stmt).code;
  }

  parse(input) {
    input = input.trim();
    if (input === '') return { code: '', error: null };

    for (let rule of this.rules) {
      const match = input.match(rule.pattern);
      if (match) {
        try {
          const code = rule.replacer(...match);
          return { code, error: null };
        } catch (e) {
          return { code: null, error: { type: 500, message: e.message } };
        }
      }
    }

    return { code: null, error: { type: 401, message: 'دستور نامفهوم. لطفاً ساده‌تر بگویید.' } };
  }
}

if (typeof window !== 'undefined') {
  window.Parser = Parser;
}
