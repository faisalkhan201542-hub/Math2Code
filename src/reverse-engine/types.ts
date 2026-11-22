export type ReversePatternType =
  // Canonical 6 patterns
  | 'matrix_multiplication'
  | 'vector_l2_norm'
  | 'sigmoid'
  | 'bayes_theorem'
  | 'linear_regression'
  | 'gaussian_pdf'
  // 20 Expanded patterns
  | 'dot_product'
  | 'euclidean_distance'
  | 'mean_squared_error'
  | 'mean_absolute_error'
  | 'variance'
  | 'covariance'
  | 'pearson_correlation'
  | 'gradient_descent'
  | 'precision'
  | 'recall'
  | 'f1_score'
  | 'chain_rule'
  | 'l1_regularization'
  | 'l2_regularization'
  | 'z_score'
  | 'entropy'
  | 'kl_divergence'
  | 'softmax'
  | 'relu'
  | 'binary_cross_entropy'
  | 'generic_algebraic'
  | 'unsupported';

export type ReverseConversionStatus = 'success' | 'unsupported_syntax' | 'invalid_input';

export interface PythonMathOperationMapping {
  pythonSyntax: string;
  mathSymbol: string;
  latexEquivalent: string;
  explanation: string;
}

export interface VariableSemanticMapping {
  pythonVariable: string;
  mathSymbol: string;
  role: string;
  isInferred: boolean;
}

export interface ReverseEquationExplanation {
  title: string;
  category: string;
  summary: string;
  mathDomain: string;
  detectedPattern: ReversePatternType;
  assumptions: string[];
  operationMappings: PythonMathOperationMapping[];
  variableMappings: VariableSemanticMapping[];
  limitations: string[];
}

export interface ReverseConversionResult {
  status: ReverseConversionStatus;
  pattern: ReversePatternType;
  equationName: string;
  latex: string;
  targetVariable?: string;
  explanation?: ReverseEquationExplanation;
  errorMessage?: string;
  diagnosticLocation?: string;
  rawAstSummary?: string;
  suggestedExamples?: { name: string; code: string }[];
}

// Restricted AST Definitions for Python mathematical expressions
export type TokenType =
  | 'IDENT'
  | 'NUMBER'
  | 'OP'
  | 'DELIM'
  | 'KEYWORD'
  | 'EOF';

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  col: number;
}

export type ASTNode =
  | AssignmentNode
  | BinaryOpNode
  | UnaryOpNode
  | CallNode
  | AttributeNode
  | SubscriptNode
  | NameNode
  | NumberNode;

export interface BaseNode {
  type: string;
}

export interface AssignmentNode extends BaseNode {
  type: 'Assignment';
  target: string;
  value: ASTNode;
}

export interface BinaryOpNode extends BaseNode {
  type: 'BinaryOp';
  left: ASTNode;
  op: '+' | '-' | '*' | '/' | '//' | '%' | '@' | '**';
  right: ASTNode;
}

export interface UnaryOpNode extends BaseNode {
  type: 'UnaryOp';
  op: '+' | '-';
  operand: ASTNode;
}

export interface CallNode extends BaseNode {
  type: 'Call';
  callee: ASTNode;
  args: ASTNode[];
}

export interface AttributeNode extends BaseNode {
  type: 'Attribute';
  value: ASTNode;
  attr: string;
}

export interface SubscriptNode extends BaseNode {
  type: 'Subscript';
  value: ASTNode;
  slice: ASTNode;
}

export interface NameNode extends BaseNode {
  type: 'Name';
  id: string;
}

export interface NumberNode extends BaseNode {
  type: 'Number';
  value: number;
  raw: string;
}
