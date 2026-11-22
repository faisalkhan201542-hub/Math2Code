"""Unit tests for bioinformatics algorithms and sequence analysis in aimath_bio."""

import pytest
import numpy as np
from aimath_bio import (
    calculate_gc_content,
    sequence_hamming_distance,
    pairwise_sequence_identity,
    log2_fold_change,
)


class TestGcContent:
    def test_pure_gc_sequence(self):
        assert np.isclose(calculate_gc_content("GCGC"), 100.0)

    def test_pure_at_sequence(self):
        assert np.isclose(calculate_gc_content("ATAT"), 0.0)

    def test_balanced_sequence(self):
        # 2 G/C out of 4 = 50.0%
        assert np.isclose(calculate_gc_content("ACGT"), 50.0)

    def test_case_insensitivity_and_whitespace(self):
        assert np.isclose(calculate_gc_content("  a c g t \n"), 50.0)

    def test_empty_sequence_raises(self):
        with pytest.raises(ValueError, match="zero valid DNA bases"):
            calculate_gc_content("")

    def test_non_dna_sequence_raises(self):
        with pytest.raises(ValueError, match="zero valid DNA bases"):
            calculate_gc_content("XYZ123")

    def test_non_string_type_raises(self):
        with pytest.raises(TypeError, match="Sequence must be a string"):
            calculate_gc_content(12345)


class TestHammingDistance:
    def test_identical_sequences(self):
        assert sequence_hamming_distance("ACGT", "ACGT") == 0

    def test_single_substitution(self):
        assert sequence_hamming_distance("ACGT", "ACTT") == 1

    def test_complete_mismatch(self):
        assert sequence_hamming_distance("AAAA", "TTTT") == 4

    def test_case_insensitivity(self):
        assert sequence_hamming_distance("acgt", "ACGT") == 0

    def test_unequal_lengths_raises(self):
        with pytest.raises(ValueError, match="Sequences must have equal length"):
            sequence_hamming_distance("ACG", "ACGT")

    def test_non_string_raises(self):
        with pytest.raises(TypeError, match="must be strings"):
            sequence_hamming_distance("ACG", 123)


class TestPairwiseSequenceIdentity:
    def test_identical_alignment(self):
        assert np.isclose(pairwise_sequence_identity("ACGT", "ACGT"), 100.0)

    def test_half_identical_alignment(self):
        assert np.isclose(pairwise_sequence_identity("ACGT", "AGTT"), 50.0)

    def test_gap_handling(self):
        # 'A-GT' vs 'A-GT': matching non-gap is 3 out of 4 = 75.0%
        assert np.isclose(pairwise_sequence_identity("A-GT", "A-GT"), 75.0)

    def test_empty_alignment_raises(self):
        with pytest.raises(ValueError, match="non-empty"):
            pairwise_sequence_identity("", "")

    def test_length_mismatch_raises(self):
        with pytest.raises(ValueError, match="identical length"):
            pairwise_sequence_identity("AC", "ACG")


class TestLog2FoldChange:
    def test_symmetric_doubling(self):
        # treatment = 3, control = 1, pseudocount = 1: log2((3+1)/(1+1)) = log2(4/2) = 1.0
        val = log2_fold_change(3.0, 1.0, pseudocount=1.0)
        assert np.isclose(val, 1.0)

    def test_symmetric_halving(self):
        # treatment = 1, control = 3, pseudocount = 1: log2((1+1)/(3+1)) = log2(2/4) = -1.0
        val = log2_fold_change(1.0, 3.0, pseudocount=1.0)
        assert np.isclose(val, -1.0)

    def test_zero_expression_counts_stabilized_by_pseudocount(self):
        # treatment = 0, control = 0, pseudocount = 1: log2(1/1) = 0.0
        val = log2_fold_change(0.0, 0.0, pseudocount=1.0)
        assert np.isclose(val, 0.0)

    def test_vectorized_array_calculation(self):
        t = np.array([3.0, 1.0, 0.0])
        c = np.array([1.0, 3.0, 0.0])
        res = log2_fold_change(t, c, pseudocount=1.0)
        expected = np.array([1.0, -1.0, 0.0])
        assert np.allclose(res, expected)

    def test_non_positive_pseudocount_raises(self):
        with pytest.raises(ValueError, match="strictly positive"):
            log2_fold_change(2.0, 1.0, pseudocount=0.0)
        with pytest.raises(ValueError, match="strictly positive"):
            log2_fold_change(2.0, 1.0, pseudocount=-0.5)

    def test_negative_counts_raise(self):
        with pytest.raises(ValueError, match="cannot be negative"):
            log2_fold_change(-1.0, 2.0)
        with pytest.raises(ValueError, match="cannot be negative"):
            log2_fold_change(2.0, -2.0)
