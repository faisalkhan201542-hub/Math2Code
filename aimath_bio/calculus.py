"""Calculus and differentiation routines for aimath_bio."""

from typing import Tuple, Union
import numpy as np


def chain_rule_power_example(
    x: Union[float, int, np.ndarray, list],
    a: float = 3.0,
    b: float = 1.0,
    n: int = 2
) -> Tuple[Union[float, np.ndarray], Union[float, np.ndarray]]:
    """Evaluate composite power function y = (a*x + b)^n and its analytical derivative via the Chain Rule.

    Decomposition:
        Inner function: u = g(x) = a*x + b   => du/dx = a
        Outer function: y = f(u) = u^n       => dy/du = n * u^(n - 1)
        Chain Rule:     dy/dx = (dy/du) * (du/dx) = n * (a*x + b)^(n - 1) * a

    Worked example with default values (a=3, b=1, n=2):
        y = (3x + 1)^2
        dy/dx = 2 * (3x + 1) * 3 = 6 * (3x + 1) = 18x + 6

    Parameters
    ----------
    x : float or array-like
        Evaluation point(s).
    a : float, default=3.0
        Inner linear coefficient.
    b : float, default=1.0
        Inner intercept.
    n : int, default=2
        Outer polynomial exponent.

    Returns
    -------
    tuple of (y, dy_dx)
        Function value y and analytical derivative dy_dx evaluated at x.
    """
    is_scalar = isinstance(x, (int, float)) or (isinstance(x, np.ndarray) and x.ndim == 0)
    x_arr = np.asarray(x, dtype=float)

    # Step 1: Evaluate inner function u = g(x)
    u = a * x_arr + b
    du_dx = float(a)

    # Step 2: Evaluate outer function y = f(u) and outer derivative dy/du
    y = u ** n
    dy_du = n * (u ** (n - 1))

    # Step 3: Multiply derivatives via Chain Rule
    dy_dx = dy_du * du_dx

    if is_scalar:
        return float(y.item()), float(dy_dx.item())
    return y, dy_dx
