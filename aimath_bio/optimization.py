"""Optimization routines and regularization penalties for aimath_bio."""

from typing import Union, Callable, List
import numpy as np


def gradient_descent_step(
    theta: Union[float, int, np.ndarray, list],
    grad: Union[float, int, np.ndarray, list],
    lr: float
) -> Union[float, np.ndarray]:
    """Perform a single first-order gradient descent parameter update.

    Mathematical notation:
        \\theta_{t+1} = \\theta_t - \\eta \\nabla J(\\theta_t)

    Parameters
    ----------
    theta : float or array-like
        Current parameter value or vector.
    grad : float or array-like
        Evaluated objective gradient vector.
    lr : float
        Learning rate / step size (must be strictly positive > 0.0).

    Returns
    -------
    float or np.ndarray
        Updated parameter(s).

    Raises
    ------
    ValueError
        If learning rate lr <= 0.0 or parameter and gradient shapes do not match.
    """
    if float(lr) <= 0.0:
        raise ValueError(f"Learning rate lr must be strictly positive (> 0.0). Got {lr}.")

    is_scalar = isinstance(theta, (int, float)) or (isinstance(theta, np.ndarray) and theta.ndim == 0)
    theta_arr = np.asarray(theta, dtype=float)
    grad_arr = np.asarray(grad, dtype=float)

    if theta_arr.shape != grad_arr.shape:
        raise ValueError(
            f"Shape mismatch: theta {theta_arr.shape} vs grad {grad_arr.shape}."
        )

    updated = theta_arr - float(lr) * grad_arr
    if is_scalar:
        return float(updated.item())
    return updated


def run_gradient_descent_1d(
    theta_init: float,
    grad_fn: Callable[[float], float],
    lr: float = 0.1,
    steps: int = 5
) -> List[float]:
    """Execute several 1D gradient descent iterations and return parameter trajectory.

    Parameters
    ----------
    theta_init : float
        Starting coordinate.
    grad_fn : callable
        Function returning the derivative dJ/dtheta.
    lr : float, default=0.1
        Learning rate.
    steps : int, default=5
        Number of steps to perform.

    Returns
    -------
    list of float
        Trajectory of theta values starting with theta_init.
    """
    if steps < 1:
        raise ValueError("steps must be >= 1.")
    traj = [float(theta_init)]
    curr = float(theta_init)
    for _ in range(steps):
        g = float(grad_fn(curr))
        curr = float(gradient_descent_step(curr, g, lr))
        traj.append(curr)
    return traj


def l1_regularization_penalty(
    w: Union[np.ndarray, list],
    lambda_param: float
) -> float:
    """Compute L1 (Lasso) regularization loss penalty.

    Mathematical notation:
        \\Omega_{\\text{L1}}(\\mathbf{w}) = \\lambda \\sum_{i=1}^D |w_i|

    Parameters
    ----------
    w : np.ndarray or array-like
        Model weight vector.
    lambda_param : float
        Non-negative regularization strength parameter (\\lambda >= 0).

    Returns
    -------
    float
        Scalar penalty value.

    Raises
    ------
    ValueError
        If lambda_param is negative (< 0.0).
    """
    if float(lambda_param) < 0.0:
        raise ValueError(f"Regularization parameter lambda must be >= 0.0. Got {lambda_param}.")

    w_arr = np.asarray(w, dtype=float)
    return float(lambda_param * np.sum(np.abs(w_arr)))


def l1_subgradient(
    w: Union[np.ndarray, list],
    subgradient_at_zero: float = 0.0
) -> np.ndarray:
    """Compute subgradient of L1 penalty ||w||_1 with respect to w.

    Mathematical notation:
        \\partial |w_i| = \\begin{cases} +1 & w_i > 0 \\\\ -1 & w_i < 0 \\\\ [-1, 1] & w_i = 0 \\end{cases}

    Parameters
    ----------
    w : np.ndarray or array-like
        Weight vector.
    subgradient_at_zero : float, default=0.0
        Chosen subgradient value at the non-differentiable point w = 0 (must be in [-1.0, 1.0]).

    Returns
    -------
    np.ndarray
        Subgradient vector.
    """
    if not (-1.0 <= subgradient_at_zero <= 1.0):
        raise ValueError("subgradient_at_zero must be in [-1.0, 1.0].")
    w_arr = np.asarray(w, dtype=float)
    return np.where(w_arr > 0.0, 1.0, np.where(w_arr < 0.0, -1.0, float(subgradient_at_zero)))


def l2_regularization_penalty(
    w: Union[np.ndarray, list],
    lambda_param: float,
    factor_half: bool = False
) -> float:
    """Compute L2 (Ridge) regularization loss penalty.

    Mathematical notation:
        \\Omega_{\\text{L2}}(\\mathbf{w}) = \\lambda \\sum_{i=1}^D w_i^2 \\quad (\\text{standard})
        \\Omega_{\\text{L2}}(\\mathbf{w}) = \\frac{\\lambda}{2} \\sum_{i=1}^D w_i^2 \\quad (\\text{factor\\_half=True})

    Parameters
    ----------
    w : np.ndarray or array-like
        Model weight vector.
    lambda_param : float
        Non-negative regularization coefficient (\\lambda >= 0).
    factor_half : bool, default=False
        Whether to use the 1/2 convention that simplifies the gradient to \\lambda w.

    Returns
    -------
    float
        Scalar penalty value.

    Raises
    ------
    ValueError
        If lambda_param is negative (< 0.0).
    """
    if float(lambda_param) < 0.0:
        raise ValueError(f"Regularization parameter lambda must be >= 0.0. Got {lambda_param}.")

    w_arr = np.asarray(w, dtype=float)
    coeff = 0.5 * float(lambda_param) if factor_half else float(lambda_param)
    return float(coeff * np.sum(w_arr ** 2))


def l2_gradient(
    w: Union[np.ndarray, list],
    lambda_param: float,
    factor_half: bool = False
) -> np.ndarray:
    """Compute gradient of the L2 penalty term with respect to weights w.

    Mathematical notation:
        \\nabla_w \\Omega = 2 \\lambda \\mathbf{w} \\quad (\\text{standard})
        \\nabla_w \\Omega = \\lambda \\mathbf{w} \\quad (\\text{factor\\_half=True})
    """
    if float(lambda_param) < 0.0:
        raise ValueError("lambda_param must be >= 0.0.")
    w_arr = np.asarray(w, dtype=float)
    scale = float(lambda_param) if factor_half else 2.0 * float(lambda_param)
    return scale * w_arr
