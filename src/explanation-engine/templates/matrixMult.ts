import type { PatternDerivation } from '../types';

export const matrixMultDerivation: PatternDerivation = {
  id: 'matrix_multiplication',
  pattern: 'matrix_multiplication',
  title: 'Matrix Multiplication',
  subtitle: 'Inner Contraction of Row Vectors with Column Vectors',
  category: 'Linear Algebra',
  catalogueId: 'matrix-multiplication',
  isEngineSupported: true,
  difficulty: 'Foundational',
  tags: ['linear algebra', 'matrices', 'matmul', 'composition'],
  summary:
    'Matrix multiplication composes two linear transformations by computing the inner product (dot product) between each row of the left matrix and each column of the right matrix.',
  canonicalFormulaLatex: 'C = AB \\quad \\Longleftrightarrow \\quad C_{ij} = \\sum_{r=1}^{k} A_{ir} B_{rj}',
  targetWhatItCalculates:
    'Computes the composite linear operator representation C in R^(m x n) resulting from applying transformation B in R^(k x n) followed by transformation A in R^(m x k).',
  symbols: [
    {
      symbol: 'A',
      name: 'Left Transformation Matrix',
      mathDomain: 'A \\in \\mathbb{R}^{m \\times k}',
      role: 'First linear transformation mapping from k-dimensional space to m-dimensional space.'
    },
    {
      symbol: 'B',
      name: 'Right Transformation Matrix',
      mathDomain: 'B \\in \\mathbb{R}^{k \\times n}',
      role: 'Second linear transformation mapping from n-dimensional space to k-dimensional space.'
    },
    {
      symbol: 'C',
      name: 'Resulting Product Matrix',
      mathDomain: 'C \\in \\mathbb{R}^{m \\times n}',
      role: 'Composite operator mapping from n-dimensional space directly to m-dimensional space.'
    },
    {
      symbol: 'i, j, r',
      name: 'Indexing Subscripts',
      mathDomain: '1 \\le i \\le m, \\; 1 \\le j \\le n, \\; 1 \\le r \\le k',
      role: 'i indexes rows of A and C; j indexes columns of B and C; r indexes the contracted inner dimension.'
    }
  ],
  assumptions: [
    'Matrices A and B must both be two-dimensional arrays.',
    'Inner dimension contract: the number of columns in A must strictly equal the number of rows in B (columns(A) == rows(B) == k).',
    'Matrix multiplication is associative ((AB)C = A(BC)) and distributive (A(B + C) = AB + AC), but NOT commutative in general (AB != BA).'
  ],
  steps: [
    {
      id: 'step-1-dimensions',
      stepNumber: 1,
      title: 'Define Matrix Dimensions and Vector Spaces',
      latex: 'A \\in \\mathbb{R}^{m \\times k}, \\quad B \\in \\mathbb{R}^{k \\times n}',
      explanation:
        'A matrix product represents the composition of two linear maps. The right matrix B maps vectors from R^n to R^k, and the left matrix A maps vectors from R^k to R^m.',
      pythonSnippet: 'assert A.ndim == 2 and B.ndim == 2, "Both operands must be 2D matrices"',
      pythonExplanation: 'Verify dimensionality before computing: both arrays must have ndim == 2.',
      keyTakeaway: 'The output matrix dimensions will be (rows of A) x (columns of B) = (m x n).'
    },
    {
      id: 'step-2-compatibility',
      stepNumber: 2,
      title: 'Verify Inner Dimension Compatibility',
      latex: '\\text{columns}(A) = k = \\text{rows}(B)',
      explanation:
        'The shared inner dimension k is contracted during multiplication. If columns(A) != rows(B), each row of A has a different number of elements than each column of B, making dot products impossible.',
      pythonSnippet: 'if A.shape[1] != B.shape[0]:\n    raise ValueError(f"Incompatible inner dimensions: {A.shape[1]} != {B.shape[0]}")',
      pythonExplanation: 'Check that A.shape[1] == B.shape[0]. This is the core shape contract.',
      keyTakeaway: 'Inner dimensions must match; outer dimensions determine the final output shape.'
    },
    {
      id: 'step-3-element-derivation',
      stepNumber: 3,
      title: 'Derive Each Output Element via Dot Product',
      latex: 'C_{ij} = \\text{row}_i(A) \\cdot \\text{col}_j(B) = \\sum_{r=1}^{k} A_{ir} B_{rj}',
      explanation:
        'The scalar entry C_ij in row i, column j is the Euclidean dot product of the i-th row of A and the j-th column of B. It requires k scalar multiplications followed by k - 1 additions.',
      pythonSnippet: '# Conceptually equivalent to:\nC_ij = sum(A[i, r] * B[r, j] for r in range(k))',
      pythonExplanation: 'Each entry contracts over index r from 0 to k - 1.',
      keyTakeaway: 'Row i sweeps horizontally across A while column j sweeps vertically down B.'
    },
    {
      id: 'step-4-numpy-mapping',
      stepNumber: 4,
      title: 'Map the Equation to NumPy Operators',
      latex: 'C = A @ B \\quad \\neq \\quad A * B',
      explanation:
        'NumPy uses the @ operator (or np.matmul) for matrix multiplication. In Python, the asterisk (*) operator computes an element-wise Hadamard product, which requires identical shapes and is mathematically distinct.',
      pythonSnippet: 'C = A @ B  # Fast BLAS-accelerated matrix multiplication',
      pythonExplanation: 'Always use @ or np.matmul for matrix products, never *.',
      keyTakeaway: '@ performs matrix multiplication; * performs element-wise multiplication.'
    },
    {
      id: 'step-5-output-dimensions',
      stepNumber: 5,
      title: 'Determine Output Dimensions and Computational Cost',
      latex: 'C \\in \\mathbb{R}^{m \\times n}, \\quad \\text{FLOPs} = 2mkn',
      explanation:
        'The output matrix C inherits m rows from A and n columns from B. Standard naive multiplication requires m * n entries, each taking k multiplies and k adds, totaling approximately 2mkn floating-point operations.',
      pythonSnippet: 'print(f"Result shape: {C.shape}")  # Evaluates to (m, n)',
      pythonExplanation: 'The resulting matrix C has shape (m, n).',
      keyTakeaway: 'Time complexity is O(m * k * n); space complexity is O(m * n).'
    }
  ],
  workedExample: {
    title: 'Numerical Demonstration: 2x2 Matrix Multiplication',
    description: 'Multiply two 2x2 matrices with small integers to verify each step explicitly.',
    inputs: [
      {
        name: 'A',
        value: '[[1, 2], [3, 4]]',
        representation: 'A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix} \\in \\mathbb{R}^{2 \\times 2}'
      },
      {
        name: 'B',
        value: '[[5, 6], [7, 8]]',
        representation: 'B = \\begin{pmatrix} 5 & 6 \\\\ 7 & 8 \\end{pmatrix} \\in \\mathbb{R}^{2 \\times 2}'
      }
    ],
    stepByStepComputation: [
      {
        step: 'Compute C_11 (Row 1 of A . Col 1 of B)',
        computation: 'C_{11} = (1)(5) + (2)(7) = 5 + 14',
        result: '19'
      },
      {
        step: 'Compute C_12 (Row 1 of A . Col 2 of B)',
        computation: 'C_{12} = (1)(6) + (2)(8) = 6 + 16',
        result: '22'
      },
      {
        step: 'Compute C_21 (Row 2 of A . Col 1 of B)',
        computation: 'C_{21} = (3)(5) + (4)(7) = 15 + 28',
        result: '43'
      },
      {
        step: 'Compute C_22 (Row 2 of A . Col 2 of B)',
        computation: 'C_{22} = (3)(6) + (4)(8) = 18 + 32',
        result: '50'
      }
    ],
    finalOutput: {
      name: 'C = A @ B',
      value: '[[19, 22], [43, 50]]',
      interpretation: 'C = \\begin{pmatrix} 19 & 22 \\\\ 43 & 50 \\end{pmatrix}'
    },
    verifiedNote: 'Independently verified against NumPy 2.5 np.matmul([[1,2],[3,4]], [[5,6],[7,8]]).'
  },
  commonMistakes: [
    'Writing A * B in Python and expecting matrix multiplication instead of element-wise multiplication.',
    'Assuming matrix multiplication commutes: AB == BA is generally FALSE unless matrices commute.',
    'Attempting to multiply matrices where A.shape[1] != B.shape[0].',
    'Flattening a 2D matrix to 1D, which causes vector dot products instead of matrix projections.'
  ],
  numericalStabilityNotes: [
    'Matrix multiplication of very large matrices can accumulate round-off error across the summation axis.',
    'Modern BLAS libraries (OpenBLAS, Intel MKL) employ pairwise summation and cache-blocking to minimize numerical error.'
  ],
  limitations: [
    'Applies to 2D matrices over the real field; batched 3D+ tensors require generalized tensor contraction or einsum.'
  ]
};
