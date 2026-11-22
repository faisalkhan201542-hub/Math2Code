import { describe, it, expect } from 'vitest';
import {
  pyodideService,
  runSimulatedPython
} from '../services/pyodideService';

describe('In-Browser Live Python Execution Service (Pyodide & Simulator)', () => {
  it('initializes with idle status and provides status subscriptions', () => {
    const status = pyodideService.getStatus();
    expect(status.status).toBeDefined();

    let observedStatus = '';
    const unsubscribe = pyodideService.subscribe((newStatus) => {
      observedStatus = newStatus;
    });

    expect(observedStatus).toBe(status.status);
    unsubscribe();
  });

  it('rejects empty Python code with a descriptive error', async () => {
    const res = await pyodideService.runPython('   ');
    expect(res.status).toBe('error');
    expect(res.stderr).toContain('No Python code provided');
    expect(res.executionTimeMs).toBe(0);
  });

  it('simulates sigmoid activation with high numerical fidelity', () => {
    const code = `
def sigmoid(z):
    return 1 / (1 + np.exp(-z))
`;
    const result = runSimulatedPython(code);
    expect(result.status).toBe('success');
    expect(result.stdout).toContain('Sigmoid:');
    expect(result.stdout).toContain('Assertion Passed');
    expect(result.executionTimeMs).toBeGreaterThan(0);
    expect(result.engine).toBe('simulated_fallback');
  });

  it('simulates softmax probability distribution', () => {
    const code = `
def softmax(logits):
    return np.exp(logits) / np.sum(np.exp(logits))
`;
    const result = runSimulatedPython(code);
    expect(result.status).toBe('success');
    expect(result.stdout).toContain('Softmax:');
    expect(result.stdout).toContain('Sum(p):');
  });

  it('simulates MSE and residuals computation correctly', () => {
    const code = `
def mean_squared_error(y_true, y_pred):
    return np.mean((y_true - y_pred) ** 2)
`;
    const result = runSimulatedPython(code);
    expect(result.status).toBe('success');
    expect(result.stdout).toContain('MSE:');
    expect(result.stdout).toContain('Residuals:');
  });

  it('simulates matrix multiplication dimensions and outputs', () => {
    const code = `
def matrix_multiply(A, B):
    return np.matmul(A, B)
`;
    const result = runSimulatedPython(code);
    expect(result.status).toBe('success');
    expect(result.stdout).toContain('Matrix A');
    expect(result.stdout).toContain('Product C');
  });
});
