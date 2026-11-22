"""
aimath_bio — Scientific Computing & Mathematical Conversion Library.

Phase 9 Expanded Mathematical Engine with 26 Verified Implementations:
- Linear Algebra: matrix_multiply, vector_l2_norm, dot_product, euclidean_distance
- Statistics & Dispersion: variance, covariance, pearson_correlation, z_score
- Regression & Evaluation: predict_linear_regression, mean_squared_error, mean_absolute_error
- Probability & Information Theory: bayes_posterior, gaussian_pdf, shannon_entropy, kl_divergence
- Classification & Metrics: precision_score, recall_score, f1_score, binary_cross_entropy
- Optimization: gradient_descent_step, run_gradient_descent_1d, l1_regularization_penalty, l2_regularization_penalty
- Deep Learning & Activations: sigmoid, relu, relu_subgradient, softmax
- Calculus: chain_rule_power_example
- Bioinformatics: calculate_gc_content, sequence_hamming_distance, pairwise_sequence_identity, log2_fold_change
"""

from .matrix_ops import matrix_multiply, dot_product
from .norms import vector_l2_norm, euclidean_distance
from .activations import sigmoid, relu, relu_subgradient, softmax
from .probability import (
    bayes_posterior,
    shannon_entropy,
    kl_divergence,
    binary_cross_entropy,
)
from .regression import (
    predict_linear_regression,
    mean_squared_error,
    mean_absolute_error,
)
from .distributions import (
    gaussian_pdf,
    variance,
    covariance,
    pearson_correlation,
    z_score,
)
from .metrics import precision_score, recall_score, f1_score
from .optimization import (
    gradient_descent_step,
    run_gradient_descent_1d,
    l1_regularization_penalty,
    l1_subgradient,
    l2_regularization_penalty,
    l2_gradient,
)
from .calculus import chain_rule_power_example
from .bioinformatics import (
    calculate_gc_content,
    sequence_hamming_distance,
    pairwise_sequence_identity,
    log2_fold_change,
)

__version__ = "0.9.0"

__all__ = [
    # Original 6 canonical patterns
    "matrix_multiply",
    "vector_l2_norm",
    "sigmoid",
    "bayes_posterior",
    "predict_linear_regression",
    "gaussian_pdf",
    # Phase 9 expanded mathematical routines
    "dot_product",
    "euclidean_distance",
    "mean_squared_error",
    "mean_absolute_error",
    "variance",
    "covariance",
    "pearson_correlation",
    "z_score",
    "gradient_descent_step",
    "run_gradient_descent_1d",
    "precision_score",
    "recall_score",
    "f1_score",
    "chain_rule_power_example",
    "l1_regularization_penalty",
    "l1_subgradient",
    "l2_regularization_penalty",
    "l2_gradient",
    "shannon_entropy",
    "kl_divergence",
    "softmax",
    "relu",
    "relu_subgradient",
    "binary_cross_entropy",
    # Bioinformatics routines
    "calculate_gc_content",
    "sequence_hamming_distance",
    "pairwise_sequence_identity",
    "log2_fold_change",
]
