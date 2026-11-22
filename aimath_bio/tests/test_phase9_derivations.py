"""
Comprehensive pytest suite for Phase 9 mathematical derivations in aimath_bio.
Verifies correct numerical outputs, mathematical invariants, stability, and edge cases.
"""

import math
import pytest
import numpy as np

from aimath_bio import (
    dot_product,
    euclidean_distance,
    mean_squared_error,
    mean_absolute_error,
    variance,
    covariance,
    pearson_correlation,
    z_score,
    gradient_descent_step,
    run_gradient_descent_1d,
    precision_score,
    recall_score,
    f1_score,
    chain_rule_power_example,
    l1_regularization_penalty,
    l1_subgradient,
    l2_regularization_penalty,
    l2_gradient,
    shannon_entropy,
    kl_divergence,
    softmax,
    relu,
    relu_subgradient,
    binary_cross_entropy,
)


class TestDotProduct:
    def test_numerical_example(self):
        x = [1.0, 2.0, 3.0]
        w = [4.0, -1.0, 2.0]
        # 1*4 + 2*(-1) + 3*2 = 4 - 2 + 6 = 8.0
        assert dot_product(x, w) == pytest.approx(8.0)

    def test_orthogonal_vectors(self):
        # Orthogonal: dot product is 0.0
        assert dot_product([1.0, 0.0], [0.0, 5.0]) == pytest.approx(0.0)

    def test_empty_input_raises(self):
        with pytest.raises(ValueError, match="Cannot compute dot product of empty vectors"):
            dot_product([], [])

    def test_shape_mismatch_raises(self):
        with pytest.raises(ValueError, match="Vector dimensions must match"):
            dot_product([1.0, 2.0], [1.0, 2.0, 3.0])

    def test_non_1d_input_raises(self):
        with pytest.raises(ValueError, match="Both inputs must be 1D vectors"):
            dot_product([[1.0, 2.0]], [[2.0, 3.0]])


class TestEuclideanDistance:
    def test_pythagorean_distance(self):
        # 3-4-5 triangle
        assert euclidean_distance([0.0, 0.0], [3.0, 4.0]) == pytest.approx(5.0)

    def test_identical_points(self):
        assert euclidean_distance([1.5, 2.5], [1.5, 2.5]) == pytest.approx(0.0)

    def test_shape_mismatch_raises(self):
        with pytest.raises(ValueError, match="Vector shapes must match"):
            euclidean_distance([1.0], [1.0, 2.0])

    def test_empty_input_raises(self):
        with pytest.raises(ValueError, match="Cannot compute distance of empty vectors"):
            euclidean_distance([], [])


class TestRegressionMetrics:
    def test_mse_calculation(self):
        y_true = np.array([3.0, -0.5, 2.0, 7.0])
        y_pred = np.array([2.5, 0.0, 2.0, 8.0])
        # Residuals: [0.5, -0.5, 0.0, -1.0] -> squared: [0.25, 0.25, 0.0, 1.0] -> mean = 1.5 / 4 = 0.375
        assert mean_squared_error(y_true, y_pred) == pytest.approx(0.375)

    def test_mae_calculation(self):
        y_true = np.array([3.0, -0.5, 2.0, 7.0])
        y_pred = np.array([2.5, 0.0, 2.0, 8.0])
        # Absolute residuals: [0.5, 0.5, 0.0, 1.0] -> mean = 2.0 / 4 = 0.5
        assert mean_absolute_error(y_true, y_pred) == pytest.approx(0.5)

    def test_empty_inputs_raise(self):
        with pytest.raises(ValueError, match="Inputs cannot be empty"):
            mean_squared_error([], [])
        with pytest.raises(ValueError, match="Inputs cannot be empty"):
            mean_absolute_error([], [])

    def test_shape_mismatch_raises(self):
        with pytest.raises(ValueError, match="Shape mismatch"):
            mean_squared_error([1.0, 2.0], [1.0])


class TestVarianceAndCovariance:
    def test_population_vs_sample_variance(self):
        data = [2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0]
        # Sum of squared deviations = 32.0. Population (ddof=0): 32/8 = 4.0. Sample (ddof=1): 32/7 = 4.5714...
        pop_var = variance(data, ddof=0)
        samp_var = variance(data, ddof=1)
        assert pop_var == pytest.approx(4.0)
        assert samp_var == pytest.approx(32.0 / 7.0)
        assert samp_var > pop_var  # Sample variance has Bessel's correction

    def test_variance_ddof_error(self):
        with pytest.raises(ValueError, match="must exceed ddof"):
            variance([4.0], ddof=1)

    def test_covariance_population_and_sample(self):
        x = [1.0, 2.0, 3.0]
        y = [2.0, 4.0, 6.0]
        # Perfect alignment: Cov(X, Y) = 2 * Var(X)
        # Var(X, ddof=0) = 2/3 => Cov = 4/3 ~ 1.3333
        assert covariance(x, y, ddof=0) == pytest.approx(4.0 / 3.0)
        assert covariance(x, y, ddof=1) == pytest.approx(2.0)

    def test_covariance_inverted_sign(self):
        x = [1.0, 2.0, 3.0]
        y = [6.0, 4.0, 2.0]
        assert covariance(x, y, ddof=0) < 0.0


class TestPearsonCorrelation:
    def test_perfect_correlations(self):
        x = [1.0, 2.0, 3.0, 4.0]
        y_pos = [2.0, 4.0, 6.0, 8.0]
        y_neg = [8.0, 6.0, 4.0, 2.0]
        assert pearson_correlation(x, y_pos) == pytest.approx(1.0)
        assert pearson_correlation(x, y_neg) == pytest.approx(-1.0)

    def test_constant_vector_raises_undefined(self):
        # Constant vector has variance = 0, correlation denominator is 0
        with pytest.raises(ValueError, match="Pearson correlation is undefined for constant vectors"):
            pearson_correlation([5.0, 5.0, 5.0], [1.0, 2.0, 3.0])

    def test_length_mismatch_raises(self):
        with pytest.raises(ValueError, match="Inputs must be 1D vectors of equal length"):
            pearson_correlation([1.0, 2.0], [1.0, 2.0, 3.0])


class TestZScore:
    def test_standardization(self):
        data = [10.0, 20.0, 30.0]
        z = z_score(data, ddof=0)
        assert np.mean(z) == pytest.approx(0.0)
        assert np.std(z, ddof=0) == pytest.approx(1.0)

    def test_zero_variance_raises(self):
        with pytest.raises(ValueError, match="Standard deviation is zero"):
            z_score([4.0, 4.0, 4.0])

    def test_explicit_mu_sigma(self):
        # x = 25, mu = 20, sigma = 5 => z = 1.0
        assert z_score(25.0, mu=20.0, sigma=5.0) == pytest.approx(1.0)


class TestOptimization:
    def test_gradient_descent_step(self):
        # theta = 5.0, grad = 2.0, lr = 0.1 => 5.0 - 0.2 = 4.8
        assert gradient_descent_step(5.0, 2.0, lr=0.1) == pytest.approx(4.8)

    def test_gradient_descent_trajectory(self):
        # Minimize f(theta) = theta^2 with dJ/dtheta = 2*theta
        traj = run_gradient_descent_1d(theta_init=10.0, grad_fn=lambda t: 2.0 * t, lr=0.1, steps=3)
        assert traj[0] == 10.0
        assert traj[1] == pytest.approx(8.0)
        assert traj[2] == pytest.approx(6.4)
        assert traj[3] == pytest.approx(5.12)

    def test_invalid_learning_rate(self):
        with pytest.raises(ValueError, match="strictly positive"):
            gradient_descent_step(1.0, 1.0, lr=-0.05)


class TestRegularization:
    def test_l1_penalty_and_subgradient(self):
        w = [1.5, -2.0, 0.0]
        # |1.5| + |-2.0| + |0.0| = 3.5; lambda = 2.0 => 7.0
        assert l1_regularization_penalty(w, lambda_param=2.0) == pytest.approx(7.0)
        subgrad = l1_subgradient(w, subgradient_at_zero=0.0)
        np.testing.assert_allclose(subgrad, [1.0, -1.0, 0.0])

    def test_l2_penalty_conventions(self):
        w = [1.0, 2.0]  # sum of squares = 1 + 4 = 5.0
        lambda_val = 0.4
        # Standard: lambda * sum(w^2) = 0.4 * 5 = 2.0
        assert l2_regularization_penalty(w, lambda_param=lambda_val, factor_half=False) == pytest.approx(2.0)
        # 1/2 convention: (lambda/2) * sum(w^2) = 0.2 * 5 = 1.0
        assert l2_regularization_penalty(w, lambda_param=lambda_val, factor_half=True) == pytest.approx(1.0)

    def test_l2_gradients(self):
        w = np.array([1.0, 2.0])
        # Standard: 2 * lambda * w = 2 * 0.5 * w = w
        np.testing.assert_allclose(l2_gradient(w, lambda_param=0.5, factor_half=False), [1.0, 2.0])
        # 1/2 convention: lambda * w = 0.5 * w
        np.testing.assert_allclose(l2_gradient(w, lambda_param=0.5, factor_half=True), [0.5, 1.0])


class TestClassificationMetrics:
    def test_precision(self):
        assert precision_score(tp=80, fp=20) == pytest.approx(0.8)
        assert precision_score(tp=0, fp=0, zero_division=0.0) == 0.0

    def test_recall(self):
        assert recall_score(tp=80, fn=20) == pytest.approx(0.8)
        assert recall_score(tp=0, fn=0, zero_division=0.0) == 0.0

    def test_f1_score(self):
        # Harmonic mean of 0.8 and 0.8 is 0.8
        assert f1_score(precision=0.8, recall=0.8) == pytest.approx(0.8)
        # From counts: 2*80 / (2*80 + 20 + 20) = 160 / 200 = 0.8
        assert f1_score(tp=80, fp=20, fn=20) == pytest.approx(0.8)
        assert f1_score(tp=0, fp=0, fn=0, zero_division=0.0) == 0.0


class TestChainRule:
    def test_power_example(self):
        # y = (3x + 1)^2 at x = 1: u = 4, y = 16, dy/dx = 6*(3x+1) = 24
        val, grad = chain_rule_power_example(x=1.0, a=3.0, b=1.0, n=2)
        assert val == pytest.approx(16.0)
        assert grad == pytest.approx(24.0)

        # Numerical gradient verification: (f(x+h) - f(x-h)) / (2h)
        h = 1e-6
        f_plus, _ = chain_rule_power_example(1.0 + h, 3.0, 1.0, 2)
        f_minus, _ = chain_rule_power_example(1.0 - h, 3.0, 1.0, 2)
        numerical_grad = (f_plus - f_minus) / (2.0 * h)
        assert grad == pytest.approx(numerical_grad, rel=1e-5)


class TestInformationTheory:
    def test_entropy_fair_coin(self):
        # Uniform binary distribution: H = 1.0 bit
        assert shannon_entropy([0.5, 0.5], base=2.0) == pytest.approx(1.0)

    def test_entropy_certain_outcome(self):
        # 0 * log(0) = 0 convention verified
        assert shannon_entropy([1.0, 0.0], base=2.0) == pytest.approx(0.0)

    def test_entropy_unnormalized_raises(self):
        with pytest.raises(ValueError, match="must sum to 1.0"):
            shannon_entropy([0.4, 0.4])

    def test_kl_divergence_properties(self):
        p = [0.6, 0.4]
        q = [0.4, 0.6]
        # Self-divergence is 0
        assert kl_divergence(p, p) == pytest.approx(0.0)
        # Asymmetric: D_KL(P||Q) != D_KL(Q||P) in general distributions
        p_asym = [0.9, 0.1]
        q_asym = [0.5, 0.5]
        kl_pq = kl_divergence(p_asym, q_asym)
        kl_qp = kl_divergence(q_asym, p_asym)
        assert kl_pq > 0.0
        assert kl_qp > 0.0
        assert kl_pq != pytest.approx(kl_qp)

    def test_kl_support_violation_infinite(self):
        # p_2 > 0 but q_2 == 0 => infinite divergence
        p = [0.8, 0.2]
        q = [1.0, 0.0]
        assert kl_divergence(p, q) == float('inf')


class TestDeepLearning:
    def test_softmax_probabilities_and_large_logits(self):
        z = [2.0, 1.0, 0.1]
        probs = softmax(z)
        assert np.sum(probs) == pytest.approx(1.0)
        assert probs[0] > probs[1] > probs[2]

        # Extreme large logits do NOT overflow or produce NaN
        large_z = [1000.0, 1001.0, 1002.0]
        large_probs = softmax(large_z)
        assert not np.any(np.isnan(large_probs))
        assert np.sum(large_probs) == pytest.approx(1.0)

    def test_relu_and_subgradient(self):
        x = np.array([-3.5, 0.0, 2.8])
        np.testing.assert_allclose(relu(x), [0.0, 0.0, 2.8])
        # Default subgradient at 0 is 0.0
        np.testing.assert_allclose(relu_subgradient(x), [0.0, 0.0, 1.0])

    def test_binary_cross_entropy(self):
        y_true = np.array([1, 0, 1])
        y_pred = np.array([0.9, 0.2, 0.4])
        # Analytical: - (ln(0.9) + ln(0.8) + ln(0.4)) / 3 = 1.2448 / 3 ~ 0.4149
        expected = - (math.log(0.9) + math.log(0.8) + math.log(0.4)) / 3.0
        assert binary_cross_entropy(y_true, y_pred) == pytest.approx(expected, rel=1e-4)

    def test_binary_cross_entropy_invalid_inputs(self):
        with pytest.raises(ValueError, match="binary values"):
            binary_cross_entropy([2, 0], [0.5, 0.5])
        with pytest.raises(ValueError, match="valid probabilities"):
            binary_cross_entropy([1, 0], [1.5, 0.5])
