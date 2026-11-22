"""Bioinformatics algorithms and sequence analysis metrics for aimath_bio."""

from typing import Union
import numpy as np


def calculate_gc_content(sequence: str) -> float:
    """Calculate GC content percentage from a DNA sequence string.

    Mathematical definition:
        GC% = \\frac{N_G + N_C}{N_A + N_T + N_G + N_C} \\times 100\\%

    Parameters
    ----------
    sequence : str
        Input DNA nucleotide sequence.

    Returns
    -------
    float
        GC content percentage in [0.0, 100.0].

    Raises
    ------
    TypeError
        If sequence is not a string.
    ValueError
        If sequence contains zero canonical DNA bases (A, C, G, T).
    """
    if not isinstance(sequence, str):
        raise TypeError(f"Sequence must be a string. Got {type(sequence).__name__}.")

    clean_seq = sequence.upper().strip()
    g_count = clean_seq.count('G')
    c_count = clean_seq.count('C')
    total_valid = g_count + c_count + clean_seq.count('A') + clean_seq.count('T')

    if total_valid == 0:
        raise ValueError("Sequence contains zero valid DNA bases (A, C, G, T).")

    return float((g_count + c_count) / total_valid * 100.0)


def sequence_hamming_distance(seq1: str, seq2: str) -> int:
    """Compute Hamming substitution distance between two equal-length sequences.

    Mathematical definition:
        D_H(s_1, s_2) = \\sum_{i=1}^L \\mathbb{I}(s_{1,i} \\neq s_{2,i})

    Parameters
    ----------
    seq1 : str
        First biological sequence.
    seq2 : str
        Second biological sequence of equal length.

    Returns
    -------
    int
        Count of point substitutions between seq1 and seq2.

    Raises
    ------
    TypeError
        If either input is not a string.
    ValueError
        If sequence lengths do not match.
    """
    if not isinstance(seq1, str) or not isinstance(seq2, str):
        raise TypeError("Both sequence inputs must be strings.")

    if len(seq1) != len(seq2):
        raise ValueError(
            f"Sequences must have equal length: len(seq1)={len(seq1)} != len(seq2)={len(seq2)}."
        )

    return sum(ch1 != ch2 for ch1, ch2 in zip(seq1.upper(), seq2.upper()))


def pairwise_sequence_identity(aligned_seq1: str, aligned_seq2: str) -> float:
    """Compute pairwise sequence identity score over aligned positions.

    Mathematical definition:
        PID = \\frac{N_{\\text{identical}}}{L_{\\text{alignment}}} \\times 100\\%

    Parameters
    ----------
    aligned_seq1 : str
        First aligned sequence (may contain gap characters '-').
    aligned_seq2 : str
        Second aligned sequence of identical length.

    Returns
    -------
    float
        Percentage of matching non-gap residues in [0.0, 100.0].

    Raises
    ------
    TypeError
        If either input is not a string.
    ValueError
        If alignment lengths differ or strings are empty.
    """
    if not isinstance(aligned_seq1, str) or not isinstance(aligned_seq2, str):
        raise TypeError("Both aligned sequence inputs must be strings.")

    if len(aligned_seq1) != len(aligned_seq2) or len(aligned_seq1) == 0:
        raise ValueError("Aligned sequences must be non-empty and of identical length.")

    identical = sum(
        a == b and a != '-'
        for a, b in zip(aligned_seq1.upper(), aligned_seq2.upper())
    )
    return float(identical / len(aligned_seq1) * 100.0)


def log2_fold_change(
    treatment: Union[float, int, np.ndarray, list],
    control: Union[float, int, np.ndarray, list],
    pseudocount: float = 1.0
) -> Union[float, np.ndarray]:
    """Calculate stabilized log2 fold change with positive pseudocount.

    Mathematical definition:
        \\log_2\\text{FC} = \\log_2\\left(\\frac{T + c}{C + c}\\right)

    Parameters
    ----------
    treatment : float or array-like
        Normalized expression read count in treatment condition (non-negative).
    control : float or array-like
        Normalized expression read count in control baseline (non-negative).
    pseudocount : float, optional
        Positive constant preventing log(0) and stabilizing low counts (default 1.0).

    Returns
    -------
    float or np.ndarray
        Stabilized log2 fold change value(s).

    Raises
    ------
    ValueError
        If pseudocount is <= 0 or any expression counts are negative.
    """
    if float(pseudocount) <= 0.0:
        raise ValueError(
            f"Pseudocount must be strictly positive (> 0.0). Got {pseudocount}."
        )

    is_scalar = (
        isinstance(treatment, (int, float)) and isinstance(control, (int, float))
    )

    t = np.asarray(treatment, dtype=float)
    c = np.asarray(control, dtype=float)

    if np.any(t < 0.0) or np.any(c < 0.0):
        raise ValueError("Expression read counts cannot be negative.")

    lfc = np.log2((t + float(pseudocount)) / (c + float(pseudocount)))

    if is_scalar:
        return float(lfc.item())
    return lfc
