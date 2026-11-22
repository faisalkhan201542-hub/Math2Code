import { describe, it, expect, beforeEach } from 'vitest';
import {
  SAMPLE_FORMULA_IMAGES,
  cleanExtractedLatex,
  scanFormulaImage,
  getSavedApiKey,
  saveApiKey
} from '../services/formulaOcrService';
import { convertEquationToPython } from '../engine';

describe('Formula OCR Service & Vision Engine', () => {
  beforeEach(() => {
    saveApiKey('');
  });

  it('provides 8 verified sample formula images with valid Base64 SVG data URIs', () => {
    expect(SAMPLE_FORMULA_IMAGES.length).toBe(8);

    for (const sample of SAMPLE_FORMULA_IMAGES) {
      expect(sample.id).toBeTruthy();
      expect(sample.name).toBeTruthy();
      expect(sample.latex).toBeTruthy();
      expect(sample.svgDataUri).toMatch(/^data:image\/svg\+xml;base64,/);
      expect(sample.svgDataUri).not.toContain(';utf8');
      expect(sample.patternKey).toBeTruthy();

      // Verify that each sample's LaTeX is recognized by our Equation-to-Code engine!
      const compiled = convertEquationToPython(sample.latex);
      expect(compiled.status, `Compilation failed for sample ${sample.name}`).toBe('success');
      expect(compiled.code).toContain('def ');
    }
  });

  it('correctly cleans and sanitizes raw model output strings into pristine LaTeX', () => {
    // Markdown fenced code block
    expect(cleanExtractedLatex('```latex\n\\sigma(z) = \\frac{1}{1 + e^{-z}}\n```')).toBe(
      '\\sigma(z) = \\frac{1}{1 + e^{-z}}'
    );

    // Dollar wrapped
    expect(cleanExtractedLatex('$$\\operatorname{MSE} = \\frac{1}{n}\\sum (y_i - \\hat{y}_i)^2$$')).toBe(
      '\\operatorname{MSE} = \\frac{1}{n}\\sum (y_i - \\hat{y}_i)^2'
    );

    // Prefix stripped
    expect(cleanExtractedLatex('Formula: z = \\frac{x - \\mu}{\\sigma}')).toBe(
      'z = \\frac{x - \\mu}{\\sigma}'
    );
  });

  it('instantly recognizes sample formula images via client-side matcher without API key', async () => {
    const sample = SAMPLE_FORMULA_IMAGES[0]; // Sigmoid
    const result = await scanFormulaImage(sample.svgDataUri);

    expect(result.status).toBe('success');
    expect(result.latex).toBe(sample.latex);
    expect(result.detectedPattern).toBe('sigmoid');
    expect(result.confidence).toBeGreaterThan(0.9);
  });

  it('manages Gemini API key storage and persistence safely', () => {
    expect(getSavedApiKey()).toBe('');

    saveApiKey('AIzaSyD-fake-test-key-12345');
    expect(getSavedApiKey()).toBe('AIzaSyD-fake-test-key-12345');

    saveApiKey('');
    expect(getSavedApiKey()).toBe('');
  });

  it('returns helpful error guidance when scanning custom image without API key', async () => {
    const customData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
    const result = await scanFormulaImage(customData, 'image/png');

    expect(result.status).toBe('error');
    expect(result.errorMessage).toContain('Gemini API key is not configured');
  });

  it('matches offline uploaded test files by filename when testing without an API key', async () => {
    const customData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
    
    // Test sigmoid file
    const resSigmoid = await scanFormulaImage(customData, 'image/png', undefined, 'test-sigmoid.png');
    expect(resSigmoid.status).toBe('success');
    expect(resSigmoid.latex).toContain('\\sigma');
    expect(resSigmoid.detectedPattern).toBe('sigmoid');

    // Test MSE file
    const resMse = await scanFormulaImage(customData, 'image/png', undefined, 'my-mse-formula.jpg');
    expect(resMse.status).toBe('success');
    expect(resMse.latex).toContain('MSE');
    expect(resMse.detectedPattern).toBe('mean_squared_error');

    // Test ReLU file
    const resRelu = await scanFormulaImage(customData, 'image/png', undefined, 'relu_notes.svg');
    expect(resRelu.status).toBe('success');
    expect(resRelu.detectedPattern).toBe('relu');
  });
});
