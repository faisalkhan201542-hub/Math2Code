import type { PatternDerivation } from '../types';

export const linearRegressionDerivation: PatternDerivation = {
  id: 'linear_regression',
  pattern: 'linear_regression',
  title: 'Multivariate Linear Regression Prediction',
  subtitle: 'Affine Hyperplane Projection Combining Features with Weights and Bias',
  category: 'Machine Learning / Statistics',
  catalogueId: 'linear-regression',
  isEngineSupported: true,
  difficulty: 'Foundational',
  tags: ['machine learning', 'regression', 'statistics', 'linear-model'],
  summary:
    'Linear regression models the relationship between multiple quantitative explanatory features and a continuous target response variable through an affine linear combination.',
  canonicalFormulaLatex: '\\hat{y} = Xw + b \\quad \\Longleftrightarrow \\quad \\hat{y}_i = \\sum_{j=1}^{D} X_{ij} w_j + b',
  targetWhatItCalculates:
    'Computes the predicted continuous target vector y_hat in R^N for N observation instances, each having D feature dimensions.',
  symbols: [
    {
      symbol: 'X',
      name: 'Feature Design Matrix',
      mathDomain: 'X \\in \\mathbb{R}^{N \\times D}',
      role: 'Matrix where each row i is an observation sample and each column j is an explanatory feature.'
    },
    {
      symbol: 'w',
      name: 'Parameter Weight Vector',
      mathDomain: 'w \\in \\mathbb{R}^{D}',
      role: 'Regression slope coefficients measuring expected change in response per unit change in feature j.'
    },
    {
      symbol: 'b',
      name: 'Intercept Bias Scalar / Vector',
      mathDomain: 'b \\in \\mathbb{R}',
      role: 'Baseline offset value of response when all explanatory features X are zero.'
    },
    {
      symbol: '\\hat{y}',
      name: 'Predicted Target Response',
      mathDomain: '\\hat{y} \\in \\mathbb{R}^{N}',
      role: 'Model prediction vector representing the conditional mean E[y|X].'
    }
  ],
  assumptions: [
    'The number of columns in design matrix X must equal the length of weight vector w (X.shape[1] == w.shape[0] == D).',
    'Linearity: the underlying relationship between features and target response is assumed additive and linear.',
    'Broadcastability: the intercept scalar b is broadcast uniformly across all N sample observations.'
  ],
  steps: [
    {
      id: 'step-1-matrix-vector-dimensions',
      stepNumber: 1,
      title: 'Establish Dimension Contracts for Features and Weights',
      latex: 'X \\in \\mathbb{R}^{N \\times D}, \\quad w \\in \\mathbb{R}^{D}, \\quad b \\in \\mathbb{R}',
      explanation:
        'Each of the N observations consists of D features. The parameter vector w contains D weights corresponding 1-to-1 with the features. The inner dimension D contracts during multiplication.',
      pythonSnippet: 'assert X.ndim == 2, "Feature matrix X must be 2D"\nassert w.ndim == 1, "Weight vector w must be 1D"\nassert X.shape[1] == w.shape[0], f"Feature dimension mismatch: {X.shape[1]} != {w.shape[0]}"',
      pythonExplanation: 'Verify that columns of X match the size of w.',
      keyTakeaway: 'The dot product requires exactly one weight per feature column.'
    },
    {
      id: 'step-2-linear-combination',
      stepNumber: 2,
      title: 'Compute Linear Projection via Matrix-Vector Multiplication',
      latex: 'z = Xw \\in \\mathbb{R}^{N}, \\quad z_i = X_{i,:} \\cdot w = \\sum_{j=1}^{D} X_{ij} w_j',
      explanation:
        'The matrix-vector product X @ w computes the linear combination of features for every sample in parallel. In NumPy, this uses the @ infix operator.',
      pythonSnippet: 'z = X @ w  # Matrix-vector dot product (shape: N,)',
      pythonExplanation: 'Contracts the inner dimension D across all N rows.',
      keyTakeaway: '@ computes matrix-vector multiplication; * would attempt invalid element-wise broadcasting.'
    },
    {
      id: 'step-3-affine-bias-addition',
      stepNumber: 3,
      title: 'Shift by the Intercept Bias',
      latex: '\\hat{y} = z + b = Xw + b \\mathbf{1}',
      explanation:
        'Adding the scalar intercept b shifts the hyper-plane away from the origin. In linear algebra, this transforms the linear subspace into an affine space. In NumPy, the scalar b broadcasts automatically across the N elements.',
      pythonSnippet: 'y_hat = z + float(b)  # Broadcast scalar across all N rows',
      pythonExplanation: 'Adds intercept scalar to each observation prediction.',
      keyTakeaway: 'Allows the regression plane to have a non-zero intercept at X = 0.'
    },
    {
      id: 'step-4-geometric-interpretation',
      stepNumber: 4,
      title: 'Interpret the Resulting Hyperplane',
      latex: '\\hat{y}_i = w_1 X_{i1} + w_2 X_{i2} + \\dots + w_D X_{iD} + b',
      explanation:
        'For each individual observation i, the predicted response is the dot product of that sample\'s feature values with the weight vector plus the intercept.',
      pythonSnippet: '# Prediction for observation i:\ny_hat_i = np.dot(X[i], w) + b',
      pythonExplanation: 'Each sample prediction lies directly on the fitted regression plane.',
      keyTakeaway: 'The model represents an optimal least-squares hyperplane in (D+1)-dimensional space.'
    }
  ],
  workedExample: {
    title: 'Numerical Demonstration: 2-Feature Linear Regression',
    description: 'Predict targets for N=2 samples with D=2 features, weights w=[0.5, 1.5], and bias b=1.0.',
    inputs: [
      {
        name: 'X',
        value: '[[1.0, 2.0], [3.0, 4.0]]',
        representation: 'X = \\begin{pmatrix} 1.0 & 2.0 \\\\ 3.0 & 4.0 \\end{pmatrix} \\in \\mathbb{R}^{2 \\times 2}'
      },
      {
        name: 'w',
        value: '[0.5, 1.5]',
        representation: 'w = \\begin{pmatrix} 0.5 \\\\ 1.5 \\end{pmatrix} \\in \\mathbb{R}^{2}'
      },
      {
        name: 'b',
        value: '1.0',
        representation: 'b = 1.0'
      }
    ],
    stepByStepComputation: [
      {
        step: 'Compute Sample 1 Linear Projection (z_1)',
        computation: 'z_1 = (1.0)(0.5) + (2.0)(1.5) = 0.5 + 3.0',
        result: '3.5'
      },
      {
        step: 'Compute Sample 2 Linear Projection (z_2)',
        computation: 'z_2 = (3.0)(0.5) + (4.0)(1.5) = 1.5 + 6.0',
        result: '7.5'
      },
      {
        step: 'Add Bias b=1.0 to Sample 1',
        computation: '\\hat{y}_1 = 3.5 + 1.0',
        result: '4.5'
      },
      {
        step: 'Add Bias b=1.0 to Sample 2',
        computation: '\\hat{y}_2 = 7.5 + 1.0',
        result: '8.5'
      }
    ],
    finalOutput: {
      name: 'y_hat',
      value: '[4.5, 8.5]',
      interpretation: '\\hat{y} = \\begin{pmatrix} 4.5 \\\\ 8.5 \\end{pmatrix} \\in \\mathbb{R}^{2}'
    },
    verifiedNote: 'Independently verified against NumPy (np.array([[1,2],[3,4]]) @ np.array([0.5, 1.5]) + 1.0).'
  },
  commonMistakes: [
    'Using X * w instead of X @ w: asterisk attempts element-wise multiplication and fails unless dimensions match by chance.',
    'Mismatched dimensions: passing w with size != X.shape[1].',
    'Confusing prediction (y_hat = X @ w + b) with parameter estimation (w = (X^T X)^(-1) X^T y).'
  ],
  numericalStabilityNotes: [
    'When training weights via normal equations, compute via QR decomposition or SVD (np.linalg.lstsq) rather than direct matrix inversion to prevent numerical singularity with collinear features.'
  ],
  limitations: [
    'Assumes linear, additive feature relationships; non-linear phenomena require polynomial basis expansion or kernel methods.'
  ]
};
