/**
 * Extracts a balanced braced group starting at startIndex (which must be '{').
 */
function extractBracedGroup(str: string, startIndex: number): { content: string; endIndex: number } | null {
  if (str[startIndex] !== '{') return null;
  let depth = 0;
  for (let i = startIndex; i < str.length; i++) {
    if (str[i] === '{') depth++;
    else if (str[i] === '}') {
      depth--;
      if (depth === 0) {
        return { content: str.substring(startIndex + 1, i), endIndex: i };
      }
    }
  }
  return null;
}

/**
 * Replaces \frac{num}{den} with (num)/(den), respecting nested braces.
 */
function replaceFrac(str: string): string {
  let result = str;
  let idx = result.indexOf('\\frac');
  let iterations = 0;
  while (idx !== -1 && iterations < 50) {
    iterations++;
    const firstBrace = result.indexOf('{', idx + 5);
    if (firstBrace === -1) break;
    const group1 = extractBracedGroup(result, firstBrace);
    if (!group1) break;

    const secondBrace = result.indexOf('{', group1.endIndex + 1);
    if (secondBrace === -1) break;
    const group2 = extractBracedGroup(result, secondBrace);
    if (!group2) break;

    const before = result.substring(0, idx);
    const after = result.substring(group2.endIndex + 1);
    result = before + `(${group1.content})/(${group2.content})` + after;
    idx = result.indexOf('\\frac');
  }
  return result;
}

/**
 * Replaces \sqrt{x} with sqrt(x), respecting nested braces.
 */
function replaceSqrt(str: string): string {
  let result = str;
  let idx = result.indexOf('\\sqrt');
  let iterations = 0;
  while (idx !== -1 && iterations < 50) {
    iterations++;
    const firstBrace = result.indexOf('{', idx + 5);
    if (firstBrace === -1) break;
    const group = extractBracedGroup(result, firstBrace);
    if (!group) break;

    const before = result.substring(0, idx);
    const after = result.substring(group.endIndex + 1);
    result = before + `sqrt(${group.content})` + after;
    idx = result.indexOf('\\sqrt');
  }
  return result;
}

/**
 * Normalizes LaTeX and mathematical input strings for deterministic tokenization and pattern matching.
 */
export function normalizeEquation(input: string): string {
  if (!input) return '';

  let str = input.trim();

  // Strip LaTeX sizing/fencing commands: \left, \right, \displaystyle, \quad, \qquad
  str = str.replace(/\\left|\\right/g, '');
  str = str.replace(/\\displaystyle/g, '');
  str = str.replace(/\\quad|\\qquad/g, ' ');
  str = str.replace(/\\,/g, ' ');
  str = str.replace(/\\;/g, ' ');

  // Normalize font/styling commands: \mathbf{X} -> X, \mathrm{X} -> X, \mathit{X} -> X
  str = str.replace(/\\mathbf\{([^}]+)\}/g, '$1');
  str = str.replace(/\\mathrm\{([^}]+)\}/g, '$1');
  str = str.replace(/\\mathit\{([^}]+)\}/g, '$1');
  str = str.replace(/\\boldsymbol\{([^}]+)\}/g, '$1');

  // Normalize accents: \hat{y} -> y_hat, \hat y -> y_hat, \bar{x} -> x_bar
  str = str.replace(/\\hat\{([a-zA-Z0-9]+)\}/g, '$1_hat');
  str = str.replace(/\\hat\s+([a-zA-Z0-9]+)/g, '$1_hat');
  str = str.replace(/\\bar\{([a-zA-Z0-9]+)\}/g, '$1_bar');

  // Normalize fractions and square roots with balanced brace support
  str = replaceFrac(str);
  str = replaceSqrt(str);

  // Normalize exponential: \exp(...) -> exp(...)
  str = str.replace(/\\exp/g, 'exp');

  // Normalize common Greek symbols: \sigma -> sigma, \mu -> mu, \pi -> pi, \alpha -> alpha, \beta -> beta, \theta -> theta
  str = str.replace(/\\sigma/g, 'sigma');
  str = str.replace(/\\mu/g, 'mu');
  str = str.replace(/\\pi/g, 'pi');
  str = str.replace(/\\alpha/g, 'alpha');
  str = str.replace(/\\beta/g, 'beta');
  str = str.replace(/\\theta/g, 'theta');
  str = str.replace(/\\lambda/g, 'lambda');

  // Normalize operators: \cdot -> *, \times -> *, \mid -> |, \Longleftrightarrow -> <=>
  str = str.replace(/\\cdot/g, '*');
  str = str.replace(/\\times/g, '*');
  str = str.replace(/\\mid/g, '|');
  str = str.replace(/\\Longleftrightarrow|\\iff/g, '<=>');

  // Normalize norm notation: \|x\|_2 or ||x||_2 or \|x\|
  str = str.replace(/\\\|([^\\|]+)\\\|_2/g, 'norm2($1)');
  str = str.replace(/\\\|([^\\|]+)\\\|/g, 'norm($1)');
  str = str.replace(/\|\|([^|]+)\|\|_2/g, 'norm2($1)');
  str = str.replace(/\|\|([^|]+)\|\|/g, 'norm($1)');

  // Normalize sum: \sum_{i=1}^{n} or \sum_{i=1}^n -> sum
  str = str.replace(/\\sum_\{[^}]+\}\^\{[^}]+\}/g, 'sum');
  str = str.replace(/\\sum_\{[^}]+\}\^[a-zA-Z0-9]+/g, 'sum');
  str = str.replace(/\\sum/g, 'sum');

  // Normalize multiple spaces
  str = str.replace(/\s+/g, ' ').trim();

  return str;
}
