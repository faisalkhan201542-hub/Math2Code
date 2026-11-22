"""Classification evaluation metrics for aimath_bio."""

from typing import Union, Optional


def precision_score(
    tp: Union[int, float],
    fp: Union[int, float],
    zero_division: float = 0.0
) -> float:
    """Compute precision score TP / (TP + FP).

    Mathematical notation:
        \\operatorname{Precision} = \\frac{TP}{TP + FP}

    Parameters
    ----------
    tp : int or float
        Number of true positive predictions (must be non-negative >= 0).
    fp : int or float
        Number of false positive predictions (must be non-negative >= 0).
    zero_division : float, default=0.0
        Value returned when denominator (TP + FP) equals zero.

    Returns
    -------
    float
        Precision score in [0.0, 1.0].

    Raises
    ------
    ValueError
        If tp or fp are negative.
    """
    if tp < 0 or fp < 0:
        raise ValueError(f"Counts must be non-negative. Got TP={tp}, FP={fp}.")

    denom = float(tp + fp)
    if denom == 0.0:
        return float(zero_division)

    return float(tp / denom)


def recall_score(
    tp: Union[int, float],
    fn: Union[int, float],
    zero_division: float = 0.0
) -> float:
    """Compute recall (sensitivity) score TP / (TP + FN).

    Mathematical notation:
        \\operatorname{Recall} = \\frac{TP}{TP + FN}

    Parameters
    ----------
    tp : int or float
        Number of true positive predictions (must be non-negative >= 0).
    fn : int or float
        Number of false negative predictions (must be non-negative >= 0).
    zero_division : float, default=0.0
        Value returned when denominator (TP + FN) equals zero.

    Returns
    -------
    float
        Recall score in [0.0, 1.0].

    Raises
    ------
    ValueError
        If tp or fn are negative.
    """
    if tp < 0 or fn < 0:
        raise ValueError(f"Counts must be non-negative. Got TP={tp}, FN={fn}.")

    denom = float(tp + fn)
    if denom == 0.0:
        return float(zero_division)

    return float(tp / denom)


def f1_score(
    tp: Optional[Union[int, float]] = None,
    fp: Optional[Union[int, float]] = None,
    fn: Optional[Union[int, float]] = None,
    precision: Optional[float] = None,
    recall: Optional[float] = None,
    zero_division: float = 0.0
) -> float:
    """Compute harmonic mean F1-score from confusion matrix counts or precision/recall.

    Mathematical notation:
        F_1 = 2 \\cdot \\frac{\\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}}
            = \\frac{2 TP}{2 TP + FP + FN}

    Parameters
    ----------
    tp : int or float, optional
        True positive count.
    fp : int or float, optional
        False positive count.
    fn : int or float, optional
        False negative count.
    precision : float, optional
        Pre-computed precision score.
    recall : float, optional
        Pre-computed recall score.
    zero_division : float, default=0.0
        Value returned when denominator equals zero.

    Returns
    -------
    float
        F1-score in [0.0, 1.0].

    Raises
    ------
    ValueError
        If negative counts are provided or neither counts nor (precision, recall) are supplied.
    """
    if precision is not None and recall is not None:
        if precision < 0.0 or recall < 0.0 or precision > 1.0 or recall > 1.0:
            raise ValueError(
                f"Precision and recall must be in [0, 1]. Got precision={precision}, recall={recall}."
            )
        denom = precision + recall
        if denom == 0.0:
            return float(zero_division)
        return float(2.0 * (precision * recall) / denom)

    if tp is not None and fp is not None and fn is not None:
        if tp < 0 or fp < 0 or fn < 0:
            raise ValueError(f"Counts must be non-negative. Got TP={tp}, FP={fp}, FN={fn}.")
        denom = float(2 * tp + fp + fn)
        if denom == 0.0:
            return float(zero_division)
        return float((2.0 * tp) / denom)

    raise ValueError(
        "f1_score requires either (tp, fp, fn) or (precision, recall) arguments."
    )
