import type { ASTNode, ParseResult } from './types';

export const SUPPORTED_FUNCTIONS = new Set([
  'sin',
  'cos',
  'tan',
  'exp',
  'log',
  'ln',
  'sqrt',
  'abs',
  'sigmoid',
  'gaussian'
]);

export const SUPPORTED_CONSTANTS: Record<string, number> = Object.create(null);
SUPPORTED_CONSTANTS.pi = Math.PI;
SUPPORTED_CONSTANTS.e = Math.E;

interface Token {
  type: 'NUMBER' | 'IDENTIFIER' | 'OP' | 'LPAREN' | 'RPAREN' | 'COMMA';
  value: string;
  numValue?: number;
  position: number;
}

/**
 * Preprocess and normalize user expressions, including handling LaTeX prefixes,
 * function assignment prefixes f(x)=, power operators, and LaTeX syntax.
 */
export function normalizeExpression(raw: string): string {
  let expr = raw.trim();

  // Strip assignment prefixes like f(x) =, y =, g(x) =
  expr = expr.replace(/^[a-zA-Z](\([a-zA-Z]\))?\s*=\s*/, '');
  expr = expr.replace(/^y\s*=\s*/i, '');

  // Convert LaTeX math macros to standard math syntax
  expr = expr.replace(/\\cdot/g, '*');
  expr = expr.replace(/\\times/g, '*');
  expr = expr.replace(/\\pi\b/g, 'pi');
  expr = expr.replace(/\\left\(/g, '(');
  expr = expr.replace(/\\right\)/g, ')');
  expr = expr.replace(/\\left\[/g, '(');
  expr = expr.replace(/\\right\]/g, ')');
  expr = expr.replace(/\\sin\b/g, 'sin');
  expr = expr.replace(/\\cos\b/g, 'cos');
  expr = expr.replace(/\\tan\b/g, 'tan');
  expr = expr.replace(/\\exp\b/g, 'exp');
  expr = expr.replace(/\\ln\b/g, 'ln');
  expr = expr.replace(/\\log\b/g, 'log');

  // Convert e^{...} to exp(...) or e^(...)
  expr = expr.replace(/e\^\{([^{}]+)\}/g, 'e^($1)');

  // Handle \sqrt{arg} -> sqrt(arg)
  let prev = '';
  while (prev !== expr) {
    prev = expr;
    expr = expr.replace(/\\sqrt\{([^{}]+)\}/g, 'sqrt($1)');
  }

  // Handle \frac{num}{den} with potential nested braces using brace-counting
  while (expr.includes('\\frac{')) {
    const fracIdx = expr.indexOf('\\frac{');
    const startNum = fracIdx + 6;
    let depth = 1;
    let endNum = -1;
    for (let i = startNum; i < expr.length; i++) {
      if (expr[i] === '{') depth++;
      else if (expr[i] === '}') {
        depth--;
        if (depth === 0) {
          endNum = i;
          break;
        }
      }
    }
    if (endNum === -1 || expr[endNum + 1] !== '{') break;

    const startDen = endNum + 2;
    depth = 1;
    let endDen = -1;
    for (let i = startDen; i < expr.length; i++) {
      if (expr[i] === '{') depth++;
      else if (expr[i] === '}') {
        depth--;
        if (depth === 0) {
          endDen = i;
          break;
        }
      }
    }
    if (endDen === -1) break;

    const num = expr.slice(startNum, endNum);
    const den = expr.slice(startDen, endDen);
    expr = expr.slice(0, fracIdx) + `((${num})/(${den}))` + expr.slice(endDen + 1);
  }

  // Convert ** to ^
  expr = expr.replace(/\*\*/g, '^');

  return expr.trim();
}

/**
 * Restricted tokenizer for mathematical expressions.
 * Rejects any unknown characters or dangerous constructs immediately.
 */
function tokenize(input: string): { tokens: Token[]; error?: string } {
  const tokens: Token[] = [];
  let i = 0;
  const len = input.length;

  while (i < len) {
    const ch = input[i];

    // Whitespace
    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    // Number (including decimals like .5 or 3.14)
    if (/[0-9]/.test(ch) || (ch === '.' && i + 1 < len && /[0-9]/.test(input[i + 1]))) {
      const start = i;
      let hasDot = ch === '.';
      i++;
      while (i < len && (/[0-9]/.test(input[i]) || (input[i] === '.' && !hasDot))) {
        if (input[i] === '.') hasDot = true;
        i++;
      }
      const numStr = input.slice(start, i);
      const val = parseFloat(numStr);
      if (Number.isNaN(val)) {
        return { tokens: [], error: `Invalid number format: "${numStr}" at position ${start + 1}` };
      }
      tokens.push({ type: 'NUMBER', value: numStr, numValue: val, position: start });
      continue;
    }

    // Identifiers (functions, constants, variable x)
    if (/[a-zA-Z_]/.test(ch)) {
      const start = i;
      while (i < len && /[a-zA-Z0-9_]/.test(input[i])) {
        i++;
      }
      const name = input.slice(start, i).toLowerCase();

      // Validate identifier against strict whitelist
      const isVar = name === 'x';
      const isConst = name in SUPPORTED_CONSTANTS;
      const isFunc = SUPPORTED_FUNCTIONS.has(name);

      if (!isVar && !isConst && !isFunc) {
        return {
          tokens: [],
          error: `Unsupported identifier "${name}" at position ${start + 1}. Supported: x, pi, e, sin, cos, tan, exp, log, ln, sqrt, abs, sigmoid, gaussian.`
        };
      }

      tokens.push({ type: 'IDENTIFIER', value: name, position: start });
      continue;
    }

    // Single character operators
    if (ch === '+' || ch === '-' || ch === '*' || ch === '/' || ch === '^') {
      tokens.push({ type: 'OP', value: ch, position: i });
      i++;
      continue;
    }

    // Parentheses
    if (ch === '(' || ch === '[') {
      tokens.push({ type: 'LPAREN', value: '(', position: i });
      i++;
      continue;
    }
    if (ch === ')' || ch === ']') {
      tokens.push({ type: 'RPAREN', value: ')', position: i });
      i++;
      continue;
    }

    // Comma (for multi-arg functions like gaussian(x, mu, sigma))
    if (ch === ',') {
      tokens.push({ type: 'COMMA', value: ',', position: i });
      i++;
      continue;
    }

    // Any unrecognized character
    return {
      tokens: [],
      error: `Unexpected character "${ch}" at position ${i + 1}. Only standard arithmetic and mathematical functions are permitted.`
    };
  }

  // Insert implicit multiplication tokens where appropriate:
  // e.g. 2x -> 2 * x; 2(x) -> 2 * (x); (x+1)(x-1) -> (x+1) * (x-1); x sin(x) -> x * sin(x)
  const expanded: Token[] = [];
  for (let k = 0; k < tokens.length; k++) {
    const curr = tokens[k];
    expanded.push(curr);

    if (k + 1 < tokens.length) {
      const next = tokens[k + 1];
      const canEndTerm =
        curr.type === 'NUMBER' ||
        curr.type === 'RPAREN' ||
        (curr.type === 'IDENTIFIER' && (curr.value === 'x' || curr.value in SUPPORTED_CONSTANTS));

      const canStartTerm =
        next.type === 'LPAREN' ||
        next.type === 'NUMBER' ||
        next.type === 'IDENTIFIER';

      if (canEndTerm && canStartTerm) {
        expanded.push({
          type: 'OP',
          value: '*',
          position: next.position
        });
      }
    }
  }

  return { tokens: expanded };
}

/**
 * Recursive descent parser building a strictly typed AST.
 * Enforces depth limit and valid syntax.
 */
class ExpressionParser {
  private tokens: Token[];
  private pos = 0;
  private depth = 0;
  private readonly maxDepth = 45;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private consume(): Token {
    const t = this.tokens[this.pos];
    this.pos++;
    return t;
  }

  private matchOp(op: string): boolean {
    const t = this.peek();
    if (t && t.type === 'OP' && t.value === op) {
      this.consume();
      return true;
    }
    return false;
  }

  public parse(): ASTNode {
    if (this.tokens.length === 0) {
      throw new Error('Expression cannot be empty.');
    }
    const node = this.parseExpression();
    if (this.pos < this.tokens.length) {
      const extra = this.tokens[this.pos];
      throw new Error(`Unexpected token "${extra.value}" at position ${extra.position + 1}.`);
    }
    return node;
  }

  // Expression -> Additive
  private parseExpression(): ASTNode {
    return this.parseAdditive();
  }

  // Additive -> Multiplicative (('+' | '-') Multiplicative)*
  private parseAdditive(): ASTNode {
    this.depth++;
    if (this.depth > this.maxDepth) {
      throw new Error('Expression exceeds maximum recursion nesting depth limit.');
    }

    try {
      let left = this.parseMultiplicative();

      while (this.pos < this.tokens.length) {
        const t = this.peek();
        if (t && t.type === 'OP' && (t.value === '+' || t.value === '-')) {
          this.consume();
          const right = this.parseMultiplicative();
          left = {
            type: 'BinaryOp',
            op: t.value as '+' | '-',
            left,
            right
          };
        } else {
          break;
        }
      }

      return left;
    } finally {
      this.depth--;
    }
  }

  // Multiplicative -> Power (('*' | '/') Power)*
  private parseMultiplicative(): ASTNode {
    this.depth++;
    if (this.depth > this.maxDepth) {
      throw new Error('Expression exceeds maximum recursion nesting depth limit.');
    }

    try {
      let left = this.parsePower();

      while (this.pos < this.tokens.length) {
        const t = this.peek();
        if (t && t.type === 'OP' && (t.value === '*' || t.value === '/')) {
          this.consume();
          const right = this.parsePower();
          left = {
            type: 'BinaryOp',
            op: t.value as '*' | '/',
            left,
            right
          };
        } else {
          break;
        }
      }

      return left;
    } finally {
      this.depth--;
    }
  }

  // Power -> Unary ('^' Power)? (Right-associative)
  private parsePower(): ASTNode {
    const base = this.parseUnary();

    if (this.matchOp('^')) {
      const exponent = this.parsePower();
      return {
        type: 'BinaryOp',
        op: '^',
        left: base,
        right: exponent
      };
    }

    return base;
  }

  // Unary -> ('+' | '-') Unary | Primary
  private parseUnary(): ASTNode {
    const t = this.peek();
    if (t && t.type === 'OP' && (t.value === '+' || t.value === '-')) {
      this.consume();
      const arg = this.parseUnary();
      return {
        type: 'UnaryOp',
        op: t.value as '+' | '-',
        argument: arg
      };
    }

    return this.parsePrimary();
  }

  // Primary -> NUMBER | CONSTANT | VARIABLE | FunctionCall | '(' Expression ')'
  private parsePrimary(): ASTNode {
    const t = this.peek();
    if (!t) {
      throw new Error('Unexpected end of expression, expected number, variable, or parenthesis.');
    }

    // Number literal
    if (t.type === 'NUMBER') {
      this.consume();
      return { type: 'Number', value: t.numValue! };
    }

    // Identifier: variable 'x', constant, or function call
    if (t.type === 'IDENTIFIER') {
      const idToken = this.consume();
      const name = idToken.value;

      // Variable 'x'
      if (name === 'x') {
        return { type: 'Variable', name: 'x' };
      }

      // Constant
      if (name in SUPPORTED_CONSTANTS) {
        return { type: 'Constant', name, value: SUPPORTED_CONSTANTS[name] };
      }

      // Function call
      if (SUPPORTED_FUNCTIONS.has(name)) {
        const next = this.peek();
        if (!next || next.type !== 'LPAREN') {
          throw new Error(`Function "${name}" must be followed by parentheses at position ${idToken.position + 1}.`);
        }
        this.consume(); // Consume '('

        const args: ASTNode[] = [];
        if (this.peek()?.type !== 'RPAREN') {
          while (true) {
            args.push(this.parseExpression());
            const commaOrClose = this.peek();
            if (commaOrClose && commaOrClose.type === 'COMMA') {
              this.consume();
              continue;
            }
            break;
          }
        }

        const close = this.peek();
        if (!close || close.type !== 'RPAREN') {
          throw new Error(`Missing closing parenthesis ')' for function "${name}".`);
        }
        this.consume(); // Consume ')'

        return { type: 'FunctionCall', name, args };
      }

      throw new Error(`Unrecognized symbol "${name}" at position ${idToken.position + 1}.`);
    }

    // Parenthesized sub-expression
    if (t.type === 'LPAREN') {
      this.consume();
      const inner = this.parseExpression();
      const close = this.peek();
      if (!close || close.type !== 'RPAREN') {
        throw new Error(`Missing closing parenthesis ')' matching opening parenthesis at position ${t.position + 1}.`);
      }
      this.consume();
      return inner;
    }

    throw new Error(`Unexpected token "${t.value}" at position ${t.position + 1}.`);
  }
}

/**
 * Safely parse a mathematical expression into an AST without arbitrary code execution.
 */
export function parseExpression(raw: string): ParseResult {
  if (!raw || raw.trim().length === 0) {
    return { success: false, error: 'Expression cannot be empty.' };
  }

  if (raw.length > 500) {
    return { success: false, error: 'Expression length exceeds safe limit (500 characters).' };
  }

  try {
    const normalized = normalizeExpression(raw);
    const { tokens, error: tokenError } = tokenize(normalized);

    if (tokenError || !tokens) {
      return { success: false, error: tokenError || 'Tokenization error', normalizedExpression: normalized };
    }

    const parser = new ExpressionParser(tokens);
    const ast = parser.parse();

    return {
      success: true,
      ast,
      normalizedExpression: normalized
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}
