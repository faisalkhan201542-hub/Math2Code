import type {
  Token,
  ASTNode,
  BinaryOpNode,
  UnaryOpNode,
  CallNode,
  AttributeNode,
  SubscriptNode,
  NameNode,
  NumberNode
} from './types';

export class ParserError extends Error {
  line: number;
  col: number;
  constructor(message: string, line: number, col: number) {
    super(`${message} at line ${line}, col ${col}`);
    this.name = 'ParserError';
    this.line = line;
    this.col = col;
  }
}

export interface ParsedPython {
  ast: ASTNode;
  targetVariable?: string;
  functionName?: string;
  parameters: string[];
}

export class RestrictedPythonParser {
  private tokens: Token[];
  private current = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token {
    return this.tokens[this.current] || this.tokens[this.tokens.length - 1];
  }

  private isAtEnd(): boolean {
    return this.peek().type === 'EOF';
  }

  private advance(): Token {
    if (!this.isAtEnd()) {
      this.current++;
    }
    return this.tokens[this.current - 1];
  }

  private check(type: string, value?: string): boolean {
    if (this.isAtEnd()) return false;
    const tok = this.peek();
    if (tok.type !== type) return false;
    if (value !== undefined && tok.value !== value) return false;
    return true;
  }

  private match(type: string, value?: string): boolean {
    if (this.check(type, value)) {
      this.advance();
      return true;
    }
    return false;
  }

  private consume(type: string, value?: string, errMsg?: string): Token {
    if (this.check(type, value)) {
      return this.advance();
    }
    const tok = this.peek();
    throw new ParserError(
      errMsg || `Expected '${value || type}' but found '${tok.value}'`,
      tok.line,
      tok.col
    );
  }

  /**
   * Top-level entry: parses a routine, extracting imports, function wrapper, or top-level assignment/expression
   */
  public parse(): ParsedPython {
    let targetVariable: string | undefined;
    let functionName: string | undefined;
    const parameters: string[] = [];

    // Skip import statements: `import ...`, `from ... import ...`
    while (!this.isAtEnd()) {
      if (this.check('KEYWORD', 'import')) {
        this.advance();
        while (!this.isAtEnd() && !this.check('KEYWORD', 'def') && !this.check('KEYWORD', 'return')) {
          const tok = this.advance();
          if (tok.value === '\n') break;
        }
        continue;
      }
      if (this.check('KEYWORD', 'from')) {
        this.advance();
        while (!this.isAtEnd() && !this.check('KEYWORD', 'def') && !this.check('KEYWORD', 'return')) {
          const tok = this.advance();
          if (tok.value === '\n') break;
        }
        continue;
      }
      break;
    }

    // Explicitly reject unsupported control flow: loops, classes, exception blocks
    for (const tok of this.tokens) {
      if (tok.type === 'KEYWORD') {
        if (tok.value === 'for' || tok.value === 'while') {
          throw new ParserError('Loop constructs (for/while) cannot be converted to direct closed-form equations', tok.line, tok.col);
        }
        if (tok.value === 'class') {
          throw new ParserError('Class definitions are not supported in equation decompilation', tok.line, tok.col);
        }
        if (tok.value === 'try' || tok.value === 'except' || tok.value === 'finally') {
          throw new ParserError('Exception handling blocks are not supported in equation decompilation', tok.line, tok.col);
        }
      }
    }

    // Check if wrapped in a function: `def name(args) [-> ret]: ... return expr`
    if (this.match('KEYWORD', 'def')) {
      const nameTok = this.consume('IDENT', undefined, 'Expected function name after def');
      functionName = nameTok.value;
      this.consume('DELIM', '(', "Expected '(' after function name");

      while (!this.isAtEnd() && !this.check('DELIM', ')')) {
        if (this.check('IDENT')) {
          const param = this.advance().value;
          parameters.push(param);
          // Optional type annotation: `: type`
          if (this.match('DELIM', ':')) {
            // Skip type until comma or closing paren
            while (!this.isAtEnd() && !this.check('DELIM', ',') && !this.check('DELIM', ')')) {
              this.advance();
            }
          }
        }
        if (!this.match('DELIM', ',')) break;
      }
      this.consume('DELIM', ')', "Expected ')' after parameters");

      // Optional return type: `-> type`
      if (this.match('OP', '->')) {
        while (!this.isAtEnd() && !this.check('DELIM', ':')) {
          this.advance();
        }
      }
      this.consume('DELIM', ':', "Expected ':' after function signature");

      // Scan inside function body for assignment or return
      let returnNode: ASTNode | null = null;
      let lastAssignmentNode: ASTNode | null = null;

      while (!this.isAtEnd()) {
        if (this.match('KEYWORD', 'return')) {
          returnNode = this.parseExpression();
          break;
        } else if (this.check('IDENT')) {
          // Could be an assignment statement: `x = ...`
          const savedPos = this.current;
          try {
            const ident = this.advance().value;
            if (this.match('OP', '=')) {
              const val = this.parseExpression();
              targetVariable = ident;
              lastAssignmentNode = val;
            } else {
              this.current = savedPos;
              this.advance();
            }
          } catch {
            this.current = savedPos;
            this.advance();
          }
        } else {
          this.advance();
        }
      }

      const finalAst = returnNode || lastAssignmentNode;
      if (!finalAst) {
        throw new ParserError(`Function '${functionName}' does not contain a return statement or equation expression`, nameTok.line, nameTok.col);
      }

      return {
        ast: finalAst,
        targetVariable: targetVariable || (functionName ? functionName : undefined),
        functionName,
        parameters
      };
    }

    // Top-level assignment or expression
    if (this.check('IDENT')) {
      const savedPos = this.current;
      const targetTok = this.advance();
      if (this.match('OP', '=')) {
        targetVariable = targetTok.value;
        const valueNode = this.parseExpression();
        return {
          ast: valueNode,
          targetVariable,
          parameters: []
        };
      }
      // Not an assignment, rewind and parse as general expression
      this.current = savedPos;
    }

    const exprNode = this.parseExpression();
    return {
      ast: exprNode,
      targetVariable,
      parameters: []
    };
  }

  // --- Expression Grammar (Standard Python Precedence) ---

  public parseExpression(): ASTNode {
    return this.parseAdditive();
  }

  private parseAdditive(): ASTNode {
    let expr = this.parseMultiplicative();

    while (this.check('OP', '+') || this.check('OP', '-')) {
      const opTok = this.advance();
      const op = opTok.value as '+' | '-';
      const right = this.parseMultiplicative();
      const binaryNode: BinaryOpNode = {
        type: 'BinaryOp',
        left: expr,
        op,
        right
      };
      expr = binaryNode;
    }

    return expr;
  }

  private parseMultiplicative(): ASTNode {
    let expr = this.parseUnary();

    while (
      this.check('OP', '*') ||
      this.check('OP', '/') ||
      this.check('OP', '//') ||
      this.check('OP', '%') ||
      this.check('OP', '@')
    ) {
      const opTok = this.advance();
      const op = opTok.value as '*' | '/' | '//' | '%' | '@';
      const right = this.parseUnary();
      const binaryNode: BinaryOpNode = {
        type: 'BinaryOp',
        left: expr,
        op,
        right
      };
      expr = binaryNode;
    }

    return expr;
  }

  private parseUnary(): ASTNode {
    if (this.check('OP', '+') || this.check('OP', '-')) {
      const opTok = this.advance();
      const operand = this.parseUnary();
      const unaryNode: UnaryOpNode = {
        type: 'UnaryOp',
        op: opTok.value as '+' | '-',
        operand
      };
      return unaryNode;
    }
    return this.parsePower();
  }

  private parsePower(): ASTNode {
    const expr = this.parsePostfix();

    if (this.match('OP', '**')) {
      // Right-associative in Python: a ** b ** c is a ** (b ** c)
      const right = this.parseUnary();
      const binaryNode: BinaryOpNode = {
        type: 'BinaryOp',
        left: expr,
        op: '**',
        right
      };
      return binaryNode;
    }

    return expr;
  }

  private parsePostfix(): ASTNode {
    let expr = this.parsePrimary();

    while (true) {
      if (this.match('DELIM', '(')) {
        // Function call: expr(arg1, arg2, ...)
        const args: ASTNode[] = [];
        if (!this.check('DELIM', ')')) {
          do {
            // Handle keyword argument inside call: `axis=0`
            if (this.check('IDENT') && this.peekAhead(1)?.value === '=') {
              this.advance(); // skip kwarg name
              this.advance(); // skip '='
            }
            args.push(this.parseExpression());
          } while (this.match('DELIM', ','));
        }
        this.consume('DELIM', ')', "Expected ')' after call arguments");
        const callNode: CallNode = {
          type: 'Call',
          callee: expr,
          args
        };
        expr = callNode;
      } else if (this.match('DELIM', '.')) {
        // Attribute access: expr.attr
        const attrTok = this.consume('IDENT', undefined, "Expected attribute name after '.'");
        const attrNode: AttributeNode = {
          type: 'Attribute',
          value: expr,
          attr: attrTok.value
        };
        expr = attrNode;
      } else if (this.match('DELIM', '[')) {
        // Subscript: expr[slice]
        const slice = this.parseExpression();
        this.consume('DELIM', ']', "Expected ']' after subscript");
        const subNode: SubscriptNode = {
          type: 'Subscript',
          value: expr,
          slice
        };
        expr = subNode;
      } else {
        break;
      }
    }

    return expr;
  }

  private peekAhead(offset: number): Token | null {
    const pos = this.current + offset;
    return pos < this.tokens.length ? this.tokens[pos] : null;
  }

  private parsePrimary(): ASTNode {
    const tok = this.peek();

    // 1. Grouped Expression: `(expr)`
    if (this.match('DELIM', '(')) {
      const expr = this.parseExpression();
      this.consume('DELIM', ')', "Expected ')' after expression");
      return expr;
    }

    // 2. Number literal
    if (this.match('NUMBER')) {
      const val = parseFloat(tok.value);
      const numNode: NumberNode = {
        type: 'Number',
        value: val,
        raw: tok.value
      };
      return numNode;
    }

    // 3. Identifier
    if (this.match('IDENT')) {
      const nameNode: NameNode = {
        type: 'Name',
        id: tok.value
      };
      return nameNode;
    }

    throw new ParserError(`Unexpected token '${tok.value}' in expression`, tok.line, tok.col);
  }
}
