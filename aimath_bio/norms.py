"""Vector norm operations for aimath_bio."""

from typing import Union
import numpy as np


def vector_l2_norm(x: Union[np.ndarray, list]) -> float:
    """Compute the Euclidean L2 norm of a 1D vector.

    Mathematical notation:
        \\|x\\|_2 = \\sqrt{\\sum_{i=1}^N x_i^2}

    Parameters
    ----------
    x : np.ndarray or array-like
        1-dimensional coordinate vector.

    Returns
    -------
    float
        Non-negative Euclidean distance / length.

    Raises
    ------
    ValueError
        If x is empty or not 1-dimensional.
    """
    x_arr = np.asarray(x, dtype=float)

    if x_arr.ndim != 1:
        raise ValueError(
            f"Input vector x must be 1-dimensional. Got ndim={x_arr.ndim} with shape {x_arr.shape}."
        )

    if x_arr.size == 0:
        raise ValueError("Cannot compute Euclidean norm of an empty vector.")

    # LAPACK-backed dnrm2 via np.linalg.norm prevents intermediate overflow
    return float(np.linalg.norm(x_arr, ord=2))


def euclidean_distance(
    x: Union[np.ndarray, list],
    y: Union[np.ndarray, list]
) -> float:
    """Compute Euclidean distance between two coordinate vectors.

    Mathematical notation:
        d(x, y) = \\|x - y\\|_2 = \\sqrt{\\sum_{i=1}^n (x_i - y_i)^2}

    Parameters
    ----------
    x : np.ndarray or array-like
        First coordinate vector of shape (n,).
    y : np.ndarray or array-like
        Second coordinate vector of shape (n,).

    Returns
    -------
    float
        Non-negative Euclidean distance.

    Raises
    ------
    ValueError
        If inputs are not 1-dimensional, have differing dimensions, or are empty.
    """
    x_arr = np.asarray(x, dtype=float)
    y_arr = np.asarray(y, dtype=float)

    if x_arr.ndim != 1 or y_arr.ndim != 1:
        raise ValueError(
            f"Both inputs must be 1D vectors. Got x.ndim={x_arr.ndim}, y.ndim={y_arr.ndim}."
        )

    if x_arr.size == 0 or y_arr.size == 0:
        raise ValueError("Cannot compute distance of empty vectors.")

    if x_arr.shape != y_arr.shape:
        raise ValueError(
            f"Vector shapes must match. Got x shape {x_arr.shape} vs y shape {y_arr.shape}."
        )

    return float(np.linalg.norm(x_arr - y_arr, ord=2))
