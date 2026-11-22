"""Continuous statistical probability distributions for aimath_bio."""

from typing import Union
import numpy as np


def gaussian_pdf(
    x: Union[float, int, np.ndarray, list],
    mu: float = 0.0,
    sigma: float = 1.0
) -> Union[float, np.ndarray]:
    """Compute Gaussian (Normal) probability density function.

    Mathematical notation:
        f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\exp\\left(-\\frac{(x - \\mu)^2}{2\\sigma^2}\\right)

    Parameters
    ----------
    x : float or array-like
        Evaluation coordinate(s).
    mu : float, optional
        Mean / center of distribution (default is 0.0).
    sigma : float, optional
        Standard deviation (default is 1.0, must be strictly positive > 0.0).

    Returns
    -------
    float or np.ndarray
        Evaluated probability density value(s).

    Raises
    ------
    ValueError
        If sigma is non-positive (<= 0.0).
    """
    if float(sigma) <= 0.0:
        raise ValueError(
            f"Standard deviation sigma must be strictly positive (> 0.0). Got {sigma}."
        )

    is_scalar = isinstance(x, (int, float)) or (isinstance(x, np.ndarray) and x.ndim == 0)
    x_arr = np.asarray(x, dtype=float)

    z = (x_arr - float(mu)) / float(sigma)
    norm_const = 1.0 / (float(sigma) * np.sqrt(2.0 * np.pi))
    pdf = norm_const * np.exp(-0.5 * (z ** 2))

    if is_scalar:
        return float(pdf.item())
    return pdf


def variance(
    x: Union[np.ndarray, list],
    ddof: int = 0
) -> float:
    """Compute population (ddof=0) or sample (ddof=1) variance.

    Mathematical notation:
        \\sigma^2 = \\frac{1}{N} \\sum_{i=1}^N (x_i - \\mu)^2 \\quad (\\text{ddof}=0)
        s^2 = \\frac{1}{n-1} \\sum_{i=1}^n (x_i - \\bar{x})^2 \\quad (\\text{ddof}=1)

    Parameters
    ----------
    x : np.ndarray or array-like
        1-dimensional data array.
    ddof : int, default=0
        Delta degrees of freedom (0 for population, 1 for sample).

    Returns
    -------
    float
        Non-negative variance.

    Raises
    ------
    ValueError
        If array size is <= ddof or array is empty.
    """
    arr = np.asarray(x, dtype=float)
    if arr.size == 0:
        raise ValueError("Cannot compute variance of an empty array.")
    if arr.size <= ddof:
        raise ValueError(
            f"Degrees of freedom error: array size {arr.size} must exceed ddof {ddof}."
        )
    return float(np.var(arr, ddof=ddof))


def covariance(
    x: Union[np.ndarray, list],
    y: Union[np.ndarray, list],
    ddof: int = 0
) -> float:
    """Compute population (ddof=0) or sample (ddof=1) covariance between two variables.

    Mathematical notation:
        \\operatorname{Cov}(X, Y) = \\frac{1}{n - \\text{ddof}} \\sum_{i=1}^n (x_i - \\bar{x})(y_i - \\bar{y})

    Parameters
    ----------
    x : np.ndarray or array-like
        First coordinate vector of shape (n,).
    y : np.ndarray or array-like
        Second coordinate vector of shape (n,).
    ddof : int, default=0
        Delta degrees of freedom (0 for population, 1 for sample).

    Returns
    -------
    float
        Covariance measure.

    Raises
    ------
    ValueError
        If inputs are empty, have differing lengths, or n <= ddof.
    """
    x_arr = np.asarray(x, dtype=float)
    y_arr = np.asarray(y, dtype=float)

    if x_arr.size == 0 or y_arr.size == 0:
        raise ValueError("Inputs cannot be empty.")
    if x_arr.shape != y_arr.shape or x_arr.ndim != 1:
        raise ValueError(
            f"Inputs must be 1D vectors of equal length. Got x {x_arr.shape} vs y {y_arr.shape}."
        )
    n = x_arr.size
    if n <= ddof:
        raise ValueError(
            f"Sample size {n} must exceed ddof {ddof}."
        )

    x_dev = x_arr - np.mean(x_arr)
    y_dev = y_arr - np.mean(y_arr)
    return float(np.sum(x_dev * y_dev) / (n - ddof))


def pearson_correlation(
    x: Union[np.ndarray, list],
    y: Union[np.ndarray, list]
) -> float:
    """Compute Pearson correlation coefficient r between two vectors.

    Mathematical notation:
        r = \\frac{\\sum_{i=1}^n (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum_{i=1}^n (x_i - \\bar{x})^2 \\sum_{i=1}^n (y_i - \\bar{y})^2}}

    Parameters
    ----------
    x : np.ndarray or array-like
        First coordinate vector of shape (n,).
    y : np.ndarray or array-like
        Second coordinate vector of shape (n,).

    Returns
    -------
    float
        Correlation coefficient strictly in [-1.0, 1.0].

    Raises
    ------
    ValueError
        If vectors are empty, unequal length, or have zero standard deviation (constant vector).
    """
    x_arr = np.asarray(x, dtype=float)
    y_arr = np.asarray(y, dtype=float)

    if x_arr.size == 0 or y_arr.size == 0:
        raise ValueError("Inputs cannot be empty.")
    if x_arr.shape != y_arr.shape or x_arr.ndim != 1:
        raise ValueError(
            f"Inputs must be 1D vectors of equal length. Got x {x_arr.shape} vs y {y_arr.shape}."
        )
    if x_arr.size < 2:
        raise ValueError("Pearson correlation requires at least 2 observations.")

    x_dev = x_arr - np.mean(x_arr)
    y_dev = y_arr - np.mean(y_arr)

    ss_x = np.sum(x_dev ** 2)
    ss_y = np.sum(y_dev ** 2)

    if ss_x == 0.0 or ss_y == 0.0:
        raise ValueError(
            "Pearson correlation is undefined for constant vectors with zero variance."
        )

    r = np.sum(x_dev * y_dev) / np.sqrt(ss_x * ss_y)
    # Clip numerical float error slightly outside [-1, 1]
    return float(np.clip(r, -1.0, 1.0))


def z_score(
    x: Union[float, int, np.ndarray, list],
    mu: Union[float, None] = None,
    sigma: Union[float, None] = None,
    ddof: int = 0
) -> Union[float, np.ndarray]:
    """Compute z-score standardization z = (x - mu) / sigma.

    Parameters
    ----------
    x : float, int, or array-like
        Values to standardize.
    mu : float, optional
        Mean. If None, computed as np.mean(x).
    sigma : float, optional
        Standard deviation. If None, computed as np.std(x, ddof=ddof).
    ddof : int, default=0
        Degrees of freedom used if sigma is computed from x.

    Returns
    -------
    float or np.ndarray
        Standardized z-scores with mean 0 and standard deviation 1.

    Raises
    ------
    ValueError
        If sigma is zero or computed standard deviation is zero.
    """
    is_scalar = isinstance(x, (int, float)) or (isinstance(x, np.ndarray) and x.ndim == 0)
    arr = np.asarray(x, dtype=float)

    if arr.size == 0:
        raise ValueError("Cannot compute z-score of an empty array.")

    mean_val = float(mu) if mu is not None else float(np.mean(arr))

    if sigma is not None:
        std_val = float(sigma)
    else:
        if arr.size <= ddof:
            raise ValueError(f"Array size {arr.size} must exceed ddof {ddof} to compute std.")
        std_val = float(np.std(arr, ddof=ddof))

    if std_val <= 0.0:
        raise ValueError(
            f"Standard deviation is zero or negative ({std_val}); z-score standardization is undefined."
        )

    res = (arr - mean_val) / std_val
    if is_scalar:
        return float(res.item())
    return res
