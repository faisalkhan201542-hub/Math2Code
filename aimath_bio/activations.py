"""Activation functions for aimath_bio."""

from typing import Union
import numpy as np


def sigmoid(z: Union[float, int, np.ndarray, list]) -> Union[float, np.ndarray]:
    """Compute the numerically stable logistic sigmoid activation function.

    Mathematical notation:
        \\sigma(z) = \\frac{1}{1 + e^{-z}}

    Stabilization strategy:
        Uses dual-branch formulation to eliminate IEEE-754 exponent overflow:
        - For z >= 0: 1.0 / (1.0 + exp(-z))
        - For z < 0:  exp(z) / (1.0 + exp(z))

    Parameters
    ----------
    z : float, int, or array-like
        Input logit(s).

    Returns
    -------
    float or np.ndarray
        Sigmoid activation values in open interval (0.0, 1.0).
    """
    is_scalar = isinstance(z, (int, float)) or (isinstance(z, np.ndarray) and z.ndim == 0)
    z_arr = np.asarray(z, dtype=float)

    pos_mask = (z_arr >= 0)
    result = np.empty_like(z_arr, dtype=float)

    # Branch 1: z >= 0
    result[pos_mask] = 1.0 / (1.0 + np.exp(-z_arr[pos_mask]))

    # Branch 2: z < 0
    exp_z = np.exp(z_arr[~pos_mask])
    result[~pos_mask] = exp_z / (1.0 + exp_z)

    if is_scalar:
        return float(result.item())
    return result


def relu(x: Union[float, int, np.ndarray, list]) -> Union[float, np.ndarray]:
    """Compute the Rectified Linear Unit (ReLU) activation function.

    Mathematical notation:
        \\operatorname{ReLU}(x) = \\max(0, x)

    Parameters
    ----------
    x : float, int, or array-like
        Input values.

    Returns
    -------
    float or np.ndarray
        Rectified values with negative inputs set to 0.0 and positive inputs unchanged.
    """
    is_scalar = isinstance(x, (int, float)) or (isinstance(x, np.ndarray) and x.ndim == 0)
    arr = np.asarray(x, dtype=float)
    res = np.maximum(0.0, arr)
    if is_scalar:
        return float(res.item())
    return res


def relu_subgradient(
    x: Union[float, int, np.ndarray, list],
    subgradient_at_zero: float = 0.0
) -> Union[float, np.ndarray]:
    """Compute ReLU derivative / subgradient.

    Mathematical notation:
        \\frac{d}{dx}\\operatorname{ReLU}(x) = \\begin{cases} 1 & x > 0 \\\\ 0 & x < 0 \\\\ [0, 1] & x = 0 \\end{cases}

    Parameters
    ----------
    x : float, int, or array-like
        Input values.
    subgradient_at_zero : float, default=0.0
        Convention chosen at the non-differentiable corner point x = 0 (standard DL default is 0.0).

    Returns
    -------
    float or np.ndarray
        Derivative / subgradient evaluated at x.
    """
    is_scalar = isinstance(x, (int, float)) or (isinstance(x, np.ndarray) and x.ndim == 0)
    arr = np.asarray(x, dtype=float)
    res = np.where(arr > 0.0, 1.0, np.where(arr < 0.0, 0.0, float(subgradient_at_zero)))
    if is_scalar:
        return float(res.item())
    return res


def softmax(
    z: Union[np.ndarray, list],
    axis: int = -1
) -> np.ndarray:
    """Compute numerically stable Softmax probability distribution.

    Mathematical notation:
        p_i = \\frac{e^{z_i - \\max(z)}}{\\sum_{j=1}^K e^{z_j - \\max(z)}}

    Stabilization strategy:
        Subtracts the maximum logit along the specified axis to prevent floating-point
        overflow in exp().

    Parameters
    ----------
    z : np.ndarray or array-like
        Unconstrained input logits.
    axis : int, default=-1
        Axis along which softmax normalization is computed.

    Returns
    -------
    np.ndarray
        Array of probabilities strictly in [0.0, 1.0] summing to 1.0 along the axis.

    Raises
    ------
    ValueError
        If z is empty.
    """
    arr = np.asarray(z, dtype=float)
    if arr.size == 0:
        raise ValueError("Cannot compute softmax on an empty array.")

    shifted_z = arr - np.max(arr, axis=axis, keepdims=True)
    exp_z = np.exp(shifted_z)
    sum_exp = np.sum(exp_z, axis=axis, keepdims=True)
    return exp_z / sum_exp
