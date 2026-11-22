"""Unit test suite for aimath_bio mathematical models."""

import pytest
import numpy as np
from aimath_bio import (
    matrix_multiply,
    vector_l2_norm,
    sigmoid,
    bayes_posterior,
    predict_linear_regression,
    gaussian_pdf,
)


class TestMatrixMultiply:
    def test_valid_multiplication(self):
        A = np.array([[1.0, 2.0], [3.0, 4.0]])
        B = np.array([[2.0, 0.0], [1.0, 2.0]])
        expected = np.array([[4.0, 4.0], [10.0, 8.0]])
        result = matrix_multiply(A, B)
        assert np.allclose(result, expected)

    def test_incompatible_dimensions(self):
        A = np.zeros((2, 3))
        B = np.zeros((4, 2))
        with pytest.raises(ValueError, match="Incompatible inner matrix dimensions"):
            matrix_multiply(A, B)

    def test_non_2d_input(self):
        A = np.array([1.0, 2.0, 3.0])
        B = np.zeros((3, 3))
        with pytest.raises(ValueError, match="Both A and B must be 2D matrices"):
            matrix_multiply(A, B)


class TestVectorL2Norm:
    def test_known_pythagorean_norm(self):
        x = np.array([3.0, 4.0])
        assert np.isclose(vector_l2_norm(x), 5.0)

    def test_zero_vector(self):
        x = np.array([0.0, 0.0, 0.0])
        assert np.isclose(vector_l2_norm(x), 0.0)

    def test_empty_vector_raises(self):
        with pytest.raises(ValueError, match="Cannot compute Euclidean norm of an empty vector"):
            vector_l2_norm(np.array([]))

    def test_2d_input_raises(self):
        with pytest.raises(ValueError, match="must be 1-dimensional"):
            vector_l2_norm(np.zeros((2, 2)))


class TestSigmoid:
    def test_zero_evaluation(self):
        assert np.isclose(sigmoid(0.0), 0.5)

    def test_extreme_positive_no_overflow(self):
        val = sigmoid(1000.0)
        assert np.isclose(val, 1.0)
        assert np.isfinite(val)

    def test_extreme_negative_no_overflow(self):
        val = sigmoid(-1000.0)
        assert np.isclose(val, 0.0)
        assert np.isfinite(val)

    def test_array_evaluation(self):
        z = np.array([-2.0, 0.0, 2.0])
        res = sigmoid(z)
        assert len(res) == 3
        assert np.all((res > 0.0) & (res < 1.0))
        assert np.isclose(res[1], 0.5)


class TestBayesPosterior:
    def test_valid_bayes_calculation(self):
        # P(Disease)=0.01, P(+|Disease)=0.95, P(+)=0.05
        # Posterior = 0.01 * 0.95 / 0.05 = 0.19
        result = bayes_posterior(0.01, 0.95, 0.05)
        assert np.isclose(result, 0.19)

    def test_zero_marginal_raises(self):
        with pytest.raises(ValueError, match="strictly positive"):
            bayes_posterior(0.5, 0.5, 0.0)

    def test_negative_probability_raises(self):
        with pytest.raises(ValueError, match="must be in"):
            bayes_posterior(-0.1, 0.5, 0.5)

    def test_greater_than_one_probability_raises(self):
        with pytest.raises(ValueError, match="must be in"):
            bayes_posterior(1.5, 0.5, 0.5)

    def test_inconsistent_joint_exceeds_marginal(self):
        # likelihood * prior = 0.8 * 0.8 = 0.64 > marginal = 0.2
        with pytest.raises(ValueError, match="Inconsistent probabilities"):
            bayes_posterior(0.8, 0.8, 0.2)


class TestLinearRegression:
    def test_valid_prediction(self):
        X = np.array([[1.0, 2.0], [3.0, 4.0]])
        w = np.array([0.5, 1.0])
        b = 2.0
        # row 0: 1*0.5 + 2*1.0 + 2 = 0.5 + 2 + 2 = 4.5
        # row 1: 3*0.5 + 4*1.0 + 2 = 1.5 + 4 + 2 = 7.5
        expected = np.array([4.5, 7.5])
        pred = predict_linear_regression(X, w, b)
        assert np.allclose(pred, expected)

    def test_dimension_mismatch(self):
        X = np.zeros((5, 3))
        w = np.zeros(4)
        with pytest.raises(ValueError, match="Dimension mismatch"):
            predict_linear_regression(X, w)

    def test_non_2d_matrix(self):
        X = np.zeros(5)
        w = np.zeros(5)
        with pytest.raises(ValueError, match="must be 2D"):
            predict_linear_regression(X, w)


class TestGaussianPdf:
    def test_peak_at_mean(self):
        # At x=0, mu=0, sigma=1: f(0) = 1 / sqrt(2*pi) ~= 0.39894228
        val = gaussian_pdf(0.0, mu=0.0, sigma=1.0)
        expected = 1.0 / np.sqrt(2.0 * np.pi)
        assert np.isclose(val, expected)

    def test_non_positive_sigma_raises(self):
        with pytest.raises(ValueError, match="strictly positive"):
            gaussian_pdf(0.0, mu=0.0, sigma=0.0)
        with pytest.raises(ValueError, match="strictly positive"):
            gaussian_pdf(0.0, mu=0.0, sigma=-1.0)

    def test_array_evaluation(self):
        x = np.array([-1.0, 0.0, 1.0])
        densities = gaussian_pdf(x, mu=0.0, sigma=1.0)
        assert len(densities) == 3
        assert np.all(densities > 0.0)
        assert np.isclose(densities[0], densities[2])  # Symmetry about mean
