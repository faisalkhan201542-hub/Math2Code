from typing import Union
import numpy as np


def bayes_posterior(
    prior: Union[float, int],
    likelihood: Union[float, int],
    marginal: Union[float, int]
) -> float:
    """Compute posterior probability P(A|B) using Bayes' Theorem.

    Mathematical notation:
        P(A\\mid B) = \\frac{P(B\\mid A) P(A)}{P(B)}

    Parameters
    ----------
    prior : float
        Prior probability P(A) of hypothesis A, in [0.0, 1.0].
    likelihood : float
        Likelihood P(B|A) of observing evidence B given A, in [0.0, 1.0].
    marginal : float
        Marginal evidence probability P(B), strictly in (0.0, 1.0].

    Returns
    -------
    float
        Posterior probability P(A|B) in [0.0, 1.0].

    Raises
    ------
    TypeError
        If inputs are not numeric.
    ValueError
        If probabilities are outside [0.0, 1.0], marginal is <= 0.0,
        or joint probability exceeds marginal probability.
    """
    for name, val in [("prior P(A)", prior), ("likelihood P(B|A)", likelihood), ("marginal P(B)", marginal)]:
        if not isinstance(val, (int, float)):
            raise TypeError(f"{name} must be numeric. Got {type(val).__name__}.")
        if not (0.0 <= val <= 1.0):
            raise ValueError(f"{name} must be in [0.0, 1.0]. Got {val}.")

    if marginal <= 0.0:
        raise ValueError("Marginal probability P(B) must be strictly positive (> 0.0).")

    joint = float(likelihood) * float(prior)
    if joint > float(marginal) + 1e-9:
        raise ValueError(
            f"Inconsistent probabilities: joint probability P(A, B) = {joint:.4f} "
            f"cannot exceed marginal evidence P(B) = {marginal:.4f}."
        )

    posterior = joint / float(marginal)
    return min(1.0, max(0.0, float(posterior)))


def shannon_entropy(
    p: Union[np.ndarray, list],
    base: float = 2.0
) -> float:
    """Compute Shannon Entropy of a discrete probability distribution.

    Mathematical notation:
        H(X) = -\\sum_{i=1}^K p_i \\log_{\\text{base}}(p_i)

    Convention:
        0 * log(0) = 0 by continuity since \\lim_{p \\to 0^+} p \\log(p) = 0.

    Parameters
    ----------
    p : np.ndarray or array-like
        Discrete probability vector summing to 1.0.
    base : float, default=2.0
        Logarithm base (2.0 for bits/shannons, e for nats, 10 for dits).

    Returns
    -------
    float
        Non-negative entropy value.

    Raises
    ------
    ValueError
        If probabilities are negative, empty, or do not sum to 1.0 (within 1e-5 tolerance).
    """
    p_arr = np.asarray(p, dtype=float)
    if p_arr.size == 0:
        raise ValueError("Cannot compute entropy of an empty distribution.")
    if np.any(p_arr < 0.0):
        raise ValueError("Probabilities must be non-negative (>= 0.0).")
    total = float(np.sum(p_arr))
    if not (0.999 <= total <= 1.001):
        raise ValueError(f"Probabilities must sum to 1.0. Got sum={total:.6f}.")

    # Mask strictly positive probabilities
    pos = p_arr > 0.0
    p_pos = p_arr[pos]
    log_p = np.log(p_pos) / np.log(base)
    h = -float(np.sum(p_pos * log_p))
    return max(0.0, h)


def kl_divergence(
    p: Union[np.ndarray, list],
    q: Union[np.ndarray, list],
    base: float = 2.718281828459045
) -> float:
    """Compute Kullback-Leibler (KL) Divergence D_KL(P || Q).

    Mathematical notation:
        D_{\\text{KL}}(P \\parallel Q) = \\sum_{i=1}^K p_i \\log_{\\text{base}}\\left(\\frac{p_i}{q_i}\\right)

    Important Properties:
        - Non-symmetric: D_KL(P || Q) != D_KL(Q || P)
        - Not a distance metric (fails triangle inequality and symmetry)
        - Absolute continuity / Support condition: if p_i > 0 and q_i = 0, D_KL is infinite (returns float('inf')).
        - If p_i = 0, the term contributes 0 regardless of q_i.

    Parameters
    ----------
    p : np.ndarray or array-like
        True reference probability distribution.
    q : np.ndarray or array-like
        Approximating model probability distribution.
    base : float, default=e
        Logarithm base (e for nats, 2.0 for bits).

    Returns
    -------
    float
        Non-negative divergence, or float('inf') if support condition is violated.

    Raises
    ------
    ValueError
        If inputs have differing shapes, negative values, or do not sum to 1.0.
    """
    p_arr = np.asarray(p, dtype=float)
    q_arr = np.asarray(q, dtype=float)

    if p_arr.shape != q_arr.shape or p_arr.ndim != 1:
        raise ValueError("P and Q must be 1D probability vectors of equal length.")
    if p_arr.size == 0:
        raise ValueError("Distributions cannot be empty.")
    if np.any(p_arr < 0.0) or np.any(q_arr < 0.0):
        raise ValueError("Probabilities must be non-negative.")

    sum_p = float(np.sum(p_arr))
    sum_q = float(np.sum(q_arr))
    if not (0.999 <= sum_p <= 1.001) or not (0.999 <= sum_q <= 1.001):
        raise ValueError(f"Both distributions must sum to 1.0. Got sum(P)={sum_p:.5f}, sum(Q)={sum_q:.5f}.")

    # Support condition check: p_i > 0 and q_i == 0 implies infinite divergence
    violates_support = (p_arr > 0.0) & (q_arr == 0.0)
    if np.any(violates_support):
        return float('inf')

    # Non-zero terms where p_i > 0 (p_i == 0 contributes 0)
    pos_p = p_arr > 0.0
    terms = p_arr[pos_p] * (np.log(p_arr[pos_p] / q_arr[pos_p]) / np.log(base))
    kl = float(np.sum(terms))
    return max(0.0, kl)


def binary_cross_entropy(
    y_true: Union[np.ndarray, list],
    y_pred: Union[np.ndarray, list],
    eps: float = 1e-15
) -> float:
    """Compute Binary Cross-Entropy (Log Loss) between binary targets and predicted probabilities.

    Mathematical notation:
        J = -\\frac{1}{n} \\sum_{i=1}^n \\left[ y_i \\ln(p_i) + (1 - y_i) \\ln(1 - p_i) \\right]

    Parameters
    ----------
    y_true : np.ndarray or array-like
        Ground truth binary labels (must contain only 0 or 1).
    y_pred : np.ndarray or array-like
        Predicted probabilities in [0.0, 1.0].
    eps : float, default=1e-15
        Probability clipping threshold to prevent log(0) numerical instability.

    Returns
    -------
    float
        Average binary cross-entropy loss.

    Raises
    ------
    ValueError
        If inputs have unequal shapes, empty arrays, non-binary y_true, or y_pred outside [0, 1].
    """
    yt = np.asarray(y_true, dtype=float)
    yp = np.asarray(y_pred, dtype=float)

    if yt.size == 0 or yp.size == 0:
        raise ValueError("Input arrays must not be empty.")
    if yt.shape != yp.shape:
        raise ValueError(f"Shape mismatch: y_true {yt.shape} vs y_pred {yp.shape}.")
    if not np.all((yt == 0.0) | (yt == 1.0)):
        raise ValueError("y_true elements must be binary values in {0, 1}.")
    if np.any(yp < 0.0) or np.any(yp > 1.0):
        raise ValueError("y_pred values must be valid probabilities in [0.0, 1.0].")

    p_clipped = np.clip(yp, eps, 1.0 - eps)
    sample_losses = -(yt * np.log(p_clipped) + (1.0 - yt) * np.log(1.0 - p_clipped))
    return float(np.mean(sample_losses))
