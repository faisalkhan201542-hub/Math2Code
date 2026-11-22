"""Regression estimators for aimath_bio."""

from typing import Union
import numpy as np


def predict_linear_regression(
    X: Union[np.ndarray, list],
    w: Union[np.ndarray, list],
    b: Union[float, int, np.ndarray] = 0.0
) -> np.ndarray:
    """Compute multivariate linear regression predictions y_hat = X @ w + b.

    Mathematical notation:
        \\hat{y} = Xw + b

    Parameters
    ----------
    X : np.ndarray or array-like
        Design matrix with shape (N, D).
    w : np.ndarray or array-like
        Weight parameter vector of length D.
    b : float or array-like, optional
        Intercept / bias parameter (default is 0.0).

    Returns
    -------
    np.ndarray
        Prediction vector of shape (N,).

    Raises
    ------
    ValueError
        If X is not 2-dimensional or feature dimension does not match len(w).
    """
    X_arr = np.asarray(X, dtype=float)
    w_arr = np.asarray(w, dtype=float)

    if X_arr.ndim != 2:
        raise ValueError(
            f"Design matrix X must be 2D with shape (N, D). Got ndim={X_arr.ndim}."
        )

    if w_arr.ndim == 2 and w_arr.shape[1] == 1:
        w_arr = w_arr.ravel()
    elif w_arr.ndim != 1:
        raise ValueError(
            f"Weight vector w must be 1D of length D. Got ndim={w_arr.ndim} with shape {w_arr.shape}."
        )

    N, D = X_arr.shape
    if w_arr.shape[0] != D:
        raise ValueError(
            f"Dimension mismatch: X has {D} features per sample, but w has length {w_arr.shape[0]}."
        )

    y_hat = (X_arr @ w_arr) + float(b)
    return y_hat


def mean_squared_error(
    y_true: Union[np.ndarray, list],
    y_pred: Union[np.ndarray, list]
) -> float:
    """Compute Mean Squared Error (MSE) between actual and predicted values.

    Mathematical notation:
        \\operatorname{MSE} = \\frac{1}{n} \\sum_{i=1}^n (y_i - \\hat{y}_i)^2

    Parameters
    ----------
    y_true : np.ndarray or array-like
        Ground truth target values.
    y_pred : np.ndarray or array-like
        Predicted values from estimator.

    Returns
    -------
    float
        Non-negative average squared residual.

    Raises
    ------
    ValueError
        If inputs are empty or have incompatible shapes.
    """
    yt = np.asarray(y_true, dtype=float)
    yp = np.asarray(y_pred, dtype=float)

    if yt.size == 0 or yp.size == 0:
        raise ValueError("Inputs cannot be empty.")

    if yt.shape != yp.shape:
        raise ValueError(
            f"Shape mismatch: y_true {yt.shape} vs y_pred {yp.shape}."
        )

    residuals = yt - yp
    return float(np.mean(residuals ** 2))


def mean_absolute_error(
    y_true: Union[np.ndarray, list],
    y_pred: Union[np.ndarray, list]
) -> float:
    """Compute Mean Absolute Error (MAE) between actual and predicted values.

    Mathematical notation:
        \\operatorname{MAE} = \\frac{1}{n} \\sum_{i=1}^n |y_i - \\hat{y}_i|

    Parameters
    ----------
    y_true : np.ndarray or array-like
        Ground truth target values.
    y_pred : np.ndarray or array-like
        Predicted values from estimator.

    Returns
    -------
    float
        Non-negative average absolute residual.

    Raises
    ------
    ValueError
        If inputs are empty or have incompatible shapes.
    """
    yt = np.asarray(y_true, dtype=float)
    yp = np.asarray(y_pred, dtype=float)

    if yt.size == 0 or yp.size == 0:
        raise ValueError("Inputs cannot be empty.")

    if yt.shape != yp.shape:
        raise ValueError(
            f"Shape mismatch: y_true {yt.shape} vs y_pred {yp.shape}."
        )

    return float(np.mean(np.abs(yt - yp)))
