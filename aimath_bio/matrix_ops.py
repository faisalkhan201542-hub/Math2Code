"""Matrix operations for aimath_bio."""

from typing import Union
import numpy as np


def matrix_multiply(
    A: Union[np.ndarray, list],
    B: Union[np.ndarray, list]
) -> np.ndarray:
    """Compute matrix multiplication C = A @ B.

    Mathematical notation:
        C_{ij} = \\sum_{k=1}^K A_{ik} B_{kj}

    Parameters
    ----------
    A : np.ndarray or array-like
        Left operand matrix with shape (M, K).
    B : np.ndarray or array-like
        Right operand matrix with shape (K, N).

    Returns
    -------
    np.ndarray
        Matrix product C with shape (M, N).

    Raises
    ------
    ValueError
        If operands are not 2-dimensional matrices or inner dimensions do not match.
    """
    A_arr = np.asarray(A, dtype=float)
    B_arr = np.asarray(B, dtype=float)

    if A_arr.ndim != 2 or B_arr.ndim != 2:
        raise ValueError(
            f"Both A and B must be 2D matrices. Got A.ndim={A_arr.ndim}, B.ndim={B_arr.ndim}."
        )

    M, K_a = A_arr.shape
    K_b, N = B_arr.shape

    if K_a != K_b:
        raise ValueError(
            f"Incompatible inner matrix dimensions: A has {K_a} columns, but B has {K_b} rows."
        )

    return A_arr @ B_arr


def dot_product(
    x: Union[np.ndarray, list],
    w: Union[np.ndarray, list]
) -> float:
    """Compute the algebraic dot product (inner product) of two 1D vectors.

    Mathematical notation:
        x \\cdot w = \\sum_{i=1}^n x_i w_i

    Parameters
    ----------
    x : np.ndarray or array-like
        First coordinate vector of shape (n,).
    w : np.ndarray or array-like
        Second coordinate vector of shape (n,).

    Returns
    -------
    float
        Scalar inner product.

    Raises
    ------
    ValueError
        If inputs are not 1-dimensional, have differing dimensions, or are empty.
    """
    x_arr = np.asarray(x, dtype=float)
    w_arr = np.asarray(w, dtype=float)

    if x_arr.ndim != 1 or w_arr.ndim != 1:
        raise ValueError(
            f"Both inputs must be 1D vectors. Got x.ndim={x_arr.ndim}, w.ndim={w_arr.ndim}."
        )

    if x_arr.size == 0 or w_arr.size == 0:
        raise ValueError("Cannot compute dot product of empty vectors.")

    if x_arr.shape != w_arr.shape:
        raise ValueError(
            f"Vector dimensions must match. Got x shape {x_arr.shape} vs w shape {w_arr.shape}."
        )

    return float(np.dot(x_arr, w_arr))
