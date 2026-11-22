# Math2Code 🧮⚡

> **Bidirectional Mathematical Synthesis, Formal KaTeX Rendering & In-Browser CPython WebAssembly Execution**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4.0-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Pyodide WebAssembly](https://img.shields.io/badge/Pyodide-CPython_3.12_WASM-3776AB.svg?logo=python&logoColor=white)](https://pyodide.org/)
[![KaTeX](https://img.shields.io/badge/KaTeX-v0.19-00D8A4.svg)](https://katex.org/)
[![Tests](https://img.shields.io/badge/Vitest-250%2F250_Passed-4BB543.svg?logo=vitest&logoColor=white)](https://vitest.dev/)

---

## 🔬 Project Overview

**Math2Code** is an academic-grade mathematical software platform designed to bridge the gap between formal mathematical notation and production-ready numerical computation. 

It synthesizes verified, vectorized **Python (NumPy / SciPy)** code directly from **LaTeX equations**, decompiles Python ASTs back into formal LaTeX representations, provides interactive pedagogical proofs, and executes code in real-time inside the client's browser via **Pyodide WebAssembly** with zero backend infrastructure.

---

## ✨ Key Capabilities & System Architecture

### 1. 🔄 Bidirectional Equation ⇄ Code Engine
* **Equation → Code Synthesis:** Translates LaTeX mathematical formulations into high-performance, vectorized NumPy routines with full numerical stabilization (IEEE-754 overflow handling, log-sum-exp stabilization, L1/L2 penalties, activation gradients).
* **Code → Equation Decompilation:** Reverses Python source code through an Abstract Syntax Tree (AST) parser to reconstruct clean, formal KaTeX mathematical expressions.

### 2. ⚡ Live In-Browser Python Runtime (Pyodide / WebAssembly)
* Executes authentic **CPython 3.12 and NumPy 1.26** directly inside client browser threads using WebAssembly (WASM).
* Captures standard output (`stdout`), standard error (`stderr`), and execution metrics (ms) with zero server latency and 100% offline privacy.
* Features a high-precision deterministic client simulation fallback for restricted network environments.

### 3. 📐 Mathematical Result & Tensor Visualizer
* Displays computational outputs not just as raw code strings, but as **formal KaTeX mathematical typography**:
  * Matrix products formatted with academic brackets: $\mathbf{A} \times \mathbf{B} \implies \mathbf{C}$
  * Step-by-step inner product summation traces ($C_{i,j} = \sum A_{ik} B_{kj}$)
  * Automated invariant verification: Dimension conformability, full rank, matrix determinants, and symmetry checks.

### 4. 🎓 Step-by-Step Mathematical Derivations
* Rigorous proof sequences decomposing 26+ foundational machine learning and scientific algorithms into incremental mathematical stages:
  * Logistic Sigmoid derivation & derivative identity $\sigma'(z) = \sigma(z)(1 - \sigma(z))$
  * Softmax probability normalization & shift-invariance
  * Matrix multiplication dimension theorems
  * Mean Squared Error (MSE) vs. Mean Absolute Error (MAE) loss comparisons
  * Gradient Descent parameter contraction dynamics

### 5. 📈 Scientific 2D Graph Plotter
* Real-time multi-curve function plotter with dynamic grid scaling, parameter sliders ($a, b, c$), singularity detection, and export capabilities.

---

## 📂 Repository Structure

```text
math2code/
├── src/
│   ├── components/
│   │   ├── layout/          # Sidebar, Navbar, AppLayout, GlobalSearch
│   │   ├── math/            # MathRenderer, EquationInput, MathematicalResultView
│   │   └── ui/              # Button, Card, Badge, Modal, CodePanel, PythonTerminal
│   ├── data/                # Verified academic equations, derivations & presets
│   ├── engine/              # Symbolic compiler, AST parser, reverse engine
│   ├── plot-engine/         # Mathematical curve tokenizer and graph evaluator
│   ├── services/            # Pyodide WebAssembly service & execution manager
│   ├── test/                # Comprehensive Vitest test suite (250 tests)
│   ├── App.tsx              # Application router and entry layout
│   └── main.tsx             # React 19 application bootstrapping
├── index.html               # Main HTML entry with KaTeX CSS
├── package.json             # Dependencies and build scripts
├── vite.config.ts           # Vite + TailwindCSS v4 build configuration
└── tsconfig.json            # Strict TypeScript configuration
```

---

## 🚀 Getting Started Locally

### Prerequisites
* **Node.js** v18+ or v20+
* **npm** or **pnpm**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/faisalkhan201542-hub/Math2Code.git
   cd Math2Code
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Run Unit & Integration Test Suite:**
   ```bash
   npm test
   ```
   *Expected Output: 250 / 250 tests passing (100% test coverage across all 10 test suites).*

5. **Run Linting:**
   ```bash
   npm run lint
   ```

6. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 🧪 Verified Test Suite Summary

| Test Suite | Tests | Status |
| :--- | :---: | :---: |
| `derivationEnginePhase9.test.ts` | 71 | ✅ Passed |
| `explanationEngine.test.ts` | 42 | ✅ Passed |
| `reverseEngine.test.ts` | 26 | ✅ Passed |
| `plotEngine.test.ts` | 25 | ✅ Passed |
| `integrationAudit.test.ts` | 25 | ✅ Passed |
| `engine.test.ts` | 20 | ✅ Passed |
| `expandedBidirectionalEngines.test.ts` | 15 | ✅ Passed |
| `equationLibrary.test.ts` | 14 | ✅ Passed |
| `pyodideService.test.ts` | 6 | ✅ Passed |
| `formulaOcrService.test.ts` | 6 | ✅ Passed |
| **Total Test Suite** | **250** | **✅ 100% Pass** |

---

## 📜 License & Academic Integrity

Developed for educational and computational mathematics research. 
Open source under the [MIT License](LICENSE).
