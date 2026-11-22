export interface Point {
  x: number;
  y: number | null;
}

export interface CurveConfig {
  id: string;
  expression: string;
  color: string;
  name: string;
  visible: boolean;
}

export interface DomainConfig {
  xMin: number;
  xMax: number;
  sampleCount: number;
}

export interface CurveData {
  id: string;
  name: string;
  expression: string;
  color: string;
  visible: boolean;
  points: Point[];
  segments: Point[][];
  validCount: number;
  invalidCount: number;
  minY: number | null;
  maxY: number | null;
  hasError: boolean;
  errorMessage?: string;
  warningMessage?: string;
}

export interface PlotData {
  curves: CurveData[];
  domain: DomainConfig;
  totalValidPoints: number;
  totalInvalidPoints: number;
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
}

export type ASTNode =
  | { type: 'Number'; value: number }
  | { type: 'Variable'; name: string }
  | { type: 'Constant'; name: string; value: number }
  | { type: 'UnaryOp'; op: '+' | '-'; argument: ASTNode }
  | { type: 'BinaryOp'; op: '+' | '-' | '*' | '/' | '^'; left: ASTNode; right: ASTNode }
  | { type: 'FunctionCall'; name: string; args: ASTNode[] };

export interface ParseResult {
  success: boolean;
  ast?: ASTNode;
  error?: string;
  normalizedExpression?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  warningMessage?: string;
}
