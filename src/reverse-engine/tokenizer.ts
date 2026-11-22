import type { Token, TokenType } from './types';

export class TokenizerError extends Error {
  line: number;
  col: number;
  constructor(message: string, line: number, col: number) {
    super(`${message} at line ${line}, col ${col}`);
    this.name = 'TokenizerError';
    this.line = line;
    this.col = col;
  }
}

export function tokenizePython(source: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;
  let line = 1;
  let col = 1;

  const KEYWORDS = new Set([
    'def', 'return', 'import', 'from', 'as', 'for', 'while',
    'if', 'else', 'elif', 'in', 'is', 'not', 'and', 'or',
    'class', 'try', 'except', 'finally', 'with', 'pass', 'raise'
  ]);

  function advance(): string {
    const ch = source[index++];
    if (ch === '\n') {
      line++;
      col = 1;
    } else {
      col++;
    }
    return ch;
  }

  function peekNext(): string {
    return index + 1 < source.length ? source[index + 1] : '';
  }

  while (index < source.length) {
    const ch = source[index];

    // 1. Whitespace
    if (ch === ' ' || ch === '\t' || ch === '\r' || ch === '\n') {
      advance();
      continue;
    }

    // 2. Comments
    if (ch === '#') {
      while (index < source.length && source[index] !== '\n') {
        advance();
      }
      continue;
    }

    // 3. String literals (Docstrings or strings)
    if (ch === '"' || ch === "'") {
      const startLine = line;
      const startCol = col;
      const quoteChar = ch;
      const isTriple = (
        index + 2 < source.length &&
        source[index + 1] === quoteChar &&
        source[index + 2] === quoteChar
      );

      if (isTriple) {
        advance(); // 1
        advance(); // 2
        advance(); // 3
        while (index < source.length) {
          if (
            source[index] === quoteChar &&
            index + 2 < source.length &&
            source[index + 1] === quoteChar &&
            source[index + 2] === quoteChar
          ) {
            advance();
            advance();
            advance();
            break;
          }
          advance();
        }
      } else {
        advance(); // opening quote
        while (index < source.length && source[index] !== quoteChar && source[index] !== '\n') {
          if (source[index] === '\\' && index + 1 < source.length) {
            advance(); // skip backslash
          }
          advance();
        }
        if (index < source.length && source[index] === quoteChar) {
          advance(); // closing quote
        } else {
          throw new TokenizerError('Unterminated string literal', startLine, startCol);
        }
      }
      // String literals in expressions are ignored or treated as docstrings
      continue;
    }

    const curLine = line;
    const curCol = col;

    // 4. Numbers
    if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(peekNext()))) {
      let numStr = '';
      let hasDot = false;
      let hasExp = false;

      while (index < source.length) {
        const c = source[index];
        if (c === '.') {
          if (hasDot || hasExp) break;
          hasDot = true;
          numStr += advance();
        } else if (c === 'e' || c === 'E') {
          if (hasExp) break;
          hasExp = true;
          numStr += advance();
          if (index < source.length && (source[index] === '+' || source[index] === '-')) {
            numStr += advance();
          }
        } else if (/[0-9]/.test(c)) {
          numStr += advance();
        } else {
          break;
        }
      }

      tokens.push({
        type: 'NUMBER',
        value: numStr,
        line: curLine,
        col: curCol
      });
      continue;
    }

    // 5. Identifiers and Keywords
    if (/[a-zA-Z_]/.test(ch)) {
      let ident = '';
      while (index < source.length && /[a-zA-Z0-9_]/.test(source[index])) {
        ident += advance();
      }

      const type: TokenType = KEYWORDS.has(ident) ? 'KEYWORD' : 'IDENT';
      tokens.push({
        type,
        value: ident,
        line: curLine,
        col: curCol
      });
      continue;
    }

    // 6. Multi-character operators
    if (ch === '*' && peekNext() === '*') {
      advance();
      advance();
      tokens.push({ type: 'OP', value: '**', line: curLine, col: curCol });
      continue;
    }
    if (ch === '/' && peekNext() === '/') {
      advance();
      advance();
      tokens.push({ type: 'OP', value: '//', line: curLine, col: curCol });
      continue;
    }
    if (ch === '-' && peekNext() === '>') {
      advance();
      advance();
      tokens.push({ type: 'OP', value: '->', line: curLine, col: curCol });
      continue;
    }
    if ((ch === '=' || ch === '!' || ch === '<' || ch === '>') && peekNext() === '=') {
      const op = advance() + advance();
      tokens.push({ type: 'OP', value: op, line: curLine, col: curCol });
      continue;
    }

    // 7. Single-character operators and delimiters
    if ('+-*/%@=<>'.includes(ch)) {
      const op = advance();
      tokens.push({ type: 'OP', value: op, line: curLine, col: curCol });
      continue;
    }

    if ('(),:[]{}|'.includes(ch)) {
      const delim = advance();
      tokens.push({ type: 'DELIM', value: delim, line: curLine, col: curCol });
      continue;
    }

    if (ch === '.') {
      advance();
      tokens.push({ type: 'DELIM', value: '.', line: curLine, col: curCol });
      continue;
    }

    // Any other character is invalid in restricted mathematical Python
    throw new TokenizerError(`Unexpected character '${ch}'`, curLine, curCol);
  }

  tokens.push({
    type: 'EOF',
    value: '<EOF>',
    line,
    col
  });

  return tokens;
}
