import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('public', 'test-formulas');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function escapeXml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function createSvg(title, mathFormulaText, style) {
  let bgDef = '';
  let textColor = '#1e293b';
  let fontStyle = 'font-family: "Courier New", monospace;';

  if (style === 'ruled_notebook') {
    bgDef = `
      <rect width="500" height="240" fill="#fdfbf7"/>
      <line x1="0" y1="50" x2="500" y2="50" stroke="#dbeafe" stroke-width="1.5"/>
      <line x1="0" y1="100" x2="500" y2="100" stroke="#dbeafe" stroke-width="1.5"/>
      <line x1="0" y1="150" x2="500" y2="150" stroke="#dbeafe" stroke-width="1.5"/>
      <line x1="0" y1="200" x2="500" y2="200" stroke="#dbeafe" stroke-width="1.5"/>
      <line x1="60" y1="0" x2="60" y2="240" stroke="#fecdd3" stroke-width="1.5"/>
    `;
    textColor = '#1d4ed8';
    fontStyle = 'font-family: "Segoe Print", "Bradley Hand", "Comic Sans MS", cursive; font-style: italic;';
  } else if (style === 'grid_notebook') {
    bgDef = `
      <rect width="500" height="240" fill="#f8fafc"/>
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="500" height="240" fill="url(#grid)"/>
    `;
    textColor = '#334155';
    fontStyle = 'font-family: "Segoe Print", "Chalkboard", cursive;';
  } else if (style === 'whiteboard') {
    bgDef = `
      <rect width="500" height="240" fill="#f1f5f9"/>
      <rect x="6" y="6" width="488" height="228" rx="8" fill="#ffffff" stroke="#94a3b8" stroke-width="3"/>
    `;
    textColor = '#0f172a';
    fontStyle = 'font-family: "Segoe Script", cursive; font-weight: bold;';
  } else {
    bgDef = `
      <rect width="500" height="240" fill="#ffffff"/>
      <rect x="12" y="12" width="476" height="216" fill="#ffffff" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4 4"/>
    `;
    textColor = '#0f172a';
    fontStyle = 'font-family: "Times New Roman", Times, serif;';
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="500" height="240" viewBox="0 0 500 240">
  ${bgDef}
  <text x="80" y="42" font-size="11" fill="#64748b" font-family="sans-serif" font-weight="600" letter-spacing="1">${escapeXml(title.toUpperCase())}</text>
  <text x="80" y="130" font-size="24" fill="${textColor}" style="${fontStyle}">${escapeXml(mathFormulaText)}</text>
  <text x="420" y="215" font-size="10" fill="#94a3b8" font-family="sans-serif">Math2Code Vision</text>
</svg>`;
}

const samples = [
  {
    filename: 'test-sigmoid.svg',
    title: 'Lecture Notes: Logistic Sigmoid',
    formula: 'σ(z) = 1 / (1 + e^-z)',
    style: 'ruled_notebook',
    name: 'Sigmoid Activation',
    latex: '\\sigma(z) = \\frac{1}{1 + e^{-z}}',
    category: 'Machine Learning'
  },
  {
    filename: 'test-mse.svg',
    title: 'Eq. 4.2 — Regression Loss Metric',
    formula: 'MSE = (1/n) Σ (y_i - ŷ_i)²',
    style: 'textbook_print',
    name: 'Mean Squared Error (MSE)',
    latex: '\\operatorname{MSE} = \\frac{1}{n}\\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2',
    category: 'Statistics'
  },
  {
    filename: 'test-relu.svg',
    title: 'Deep Net Activations: ReLU',
    formula: 'ReLU(x) = max(0, x)',
    style: 'grid_notebook',
    name: 'ReLU Activation',
    latex: '\\operatorname{ReLU}(x) = \\max(0, x)',
    category: 'Deep Learning'
  },
  {
    filename: 'test-softmax.svg',
    title: 'Eq. 8.15 — Categorical Softmax',
    formula: 'p_i = e^(z_i) / Σ e^(z_j)',
    style: 'textbook_print',
    name: 'Softmax Distribution',
    latex: 'p_i = \\frac{e^{z_i}}{\\sum_{j=1}^{K} e^{z_j}}',
    category: 'Deep Learning'
  },
  {
    filename: 'test-euclidean.svg',
    title: 'Metric Geometry: L2 Distance',
    formula: 'd(x, y) = √Σ (x_i - y_i)²',
    style: 'ruled_notebook',
    name: 'Euclidean Distance',
    latex: 'd(\\mathbf{x}, \\mathbf{y}) = \\sqrt{\\sum_{i=1}^{n} (x_i - y_i)^2}',
    category: 'Linear Algebra'
  },
  {
    filename: 'test-gradient-descent.svg',
    title: 'Optimization: Steepest Descent',
    formula: 'θ_(t+1) = θ_t - η ∇J(θ_t)',
    style: 'whiteboard',
    name: 'Gradient Descent Update Rule',
    latex: '\\theta_{t+1} = \\theta_t - \\eta \\nabla J(\\theta_t)',
    category: 'Optimization'
  },
  {
    filename: 'test-bce.svg',
    title: 'Eq. 9.4 — Binary Cross-Entropy Loss',
    formula: 'L = -1/n Σ [y log(p) + (1-y) log(1-p)]',
    style: 'textbook_print',
    name: 'Binary Cross-Entropy Loss',
    latex: 'L = -\\frac{1}{n}\\sum_{i=1}^{n} [y_i \\log(p_i) + (1-y_i) \\log(1-p_i)]',
    category: 'Deep Learning'
  },
  {
    filename: 'test-zscore.svg',
    title: 'Data Normalization: Z-Score',
    formula: 'z = (x - μ) / σ',
    style: 'ruled_notebook',
    name: 'Z-Score Standardization',
    latex: 'z = \\frac{x - \\mu}{\\sigma}',
    category: 'Statistics'
  }
];

// Write individual SVGs
for (const s of samples) {
  const svgContent = createSvg(s.title, s.formula, s.style);
  fs.writeFileSync(path.join(outDir, s.filename), svgContent, 'utf-8');
  console.log('Created:', s.filename);
}

// Generate the printable HTML test sheet
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Math2Code — Formula Scanner Test Document</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"
    onload="renderMathInElement(document.body, {delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}]});"></script>
  <style>
    :root {
      --primary: #0d9488;
      --primary-dark: #0f766e;
      --bg: #f8fafc;
      --text: #0f172a;
      --text-muted: #64748b;
      --card-bg: #ffffff;
      --border: #e2e8f0;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
      padding: 24px;
    }
    .container { max-width: 1100px; margin: 0 auto; }
    .header {
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
      color: white;
      padding: 32px;
      border-radius: 16px;
      margin-bottom: 24px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.2);
    }
    .header-badge {
      display: inline-flex;
      align-items: center;
      background: rgba(13, 148, 136, 0.25);
      border: 1px solid rgba(45, 212, 191, 0.4);
      color: #2dd4bf;
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }
    .header h1 { font-size: 28px; font-weight: 800; margin-bottom: 8px; }
    .header p { color: #cbd5e1; font-size: 14px; max-width: 800px; }
    .header-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 20px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: white;
      color: #0f172a;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      border: 1px solid var(--border);
      transition: all 0.2s;
    }
    .btn:hover { background: #f1f5f9; transform: translateY(-1px); }
    .btn-primary { background: var(--primary); color: white; border-color: var(--primary); }
    .btn-primary:hover { background: var(--primary-dark); }

    .instructions {
      background: white;
      border: 1px solid var(--border);
      border-left: 4px solid var(--primary);
      padding: 18px 24px;
      border-radius: 12px;
      margin-bottom: 24px;
    }
    .instructions h2 { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
    .instructions ol { padding-left: 20px; font-size: 13px; color: var(--text-muted); }
    .instructions li { margin-bottom: 6px; }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
      gap: 20px;
    }
    @media (max-width: 600px) {
      .grid { grid-template-columns: 1fr; }
    }

    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      display: flex;
      flex-col;
      gap: 14px;
    }
    .card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 10px;
    }
    .card-title { font-size: 15px; font-weight: 700; color: #1e293b; }
    .card-cat {
      font-size: 11px;
      font-weight: 600;
      color: var(--primary);
      background: #ccfbf1;
      padding: 2px 8px;
      border-radius: 6px;
    }

    .image-container {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 180px;
      position: relative;
    }
    .image-container img {
      width: 100%;
      height: auto;
      max-height: 200px;
      object-fit: contain;
      display: block;
    }

    .latex-box {
      background: #f1f5f9;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
      font-size: 16px;
    }

    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 10px;
      border-top: 1px solid #f1f5f9;
      gap: 8px;
    }
    .card-footer-buttons {
      display: flex;
      gap: 6px;
    }
    .btn-sm {
      font-size: 11px;
      padding: 5px 10px;
      border-radius: 6px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      color: #334155;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .btn-sm:hover { background: #e2e8f0; }

    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #0f172a;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      display: none;
      z-index: 1000;
    }

    @media print {
      body { background: white; padding: 0; }
      .header-actions, .instructions, .btn-sm { display: none !important; }
      .card { page-break-inside: avoid; border: 1px solid #999; margin-bottom: 20px; }
      .header { background: #1e293b !important; -webkit-print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-badge">✨ Math2Code Vision OCR Test Document</div>
      <h1>Official Math Formula Test Sheet</h1>
      <p>
        Use this printable and interactive test sheet to test Math2Code's Vision OCR engine.
        Each card below contains a verified mathematical formula in handwritten or textbook style.
        You can copy the image directly to your clipboard (hit <strong>Ctrl+V</strong> in Math2Code), download as PNG/SVG, or print this sheet for mobile camera scanning!
      </p>
      <div class="header-actions">
        <button class="btn btn-primary" onclick="window.print()">🖨️ Print / Save as PDF</button>
        <a class="btn" href="/formula-scanner">🚀 Back to Formula Scanner</a>
        <a class="btn" href="/equations">📚 View 26 Equations</a>
      </div>
    </div>

    <div class="instructions">
      <h2>How to Test Formula Scanner (5 Easy Ways):</h2>
      <ol>
        <li><strong>Clipboard Paste (Fastest):</strong> Click "📋 Copy Image to Clipboard" on any card below, go back to Math2Code (<a href="/formula-scanner">/formula-scanner</a>), and press <kbd>Ctrl+V</kbd>.</li>
        <li><strong>Download & Drag:</strong> Click "📥 Download File" on any card, then drag the file directly onto the Math2Code upload zone.</li>
        <li><strong>Sample Gallery (In-App):</strong> On the Formula Scanner page, simply click any of the 8 cards in the built-in sample gallery.</li>
        <li><strong>Mobile Camera:</strong> Print this document (or open on your phone/tablet) and use the "Camera" button to snap a photo!</li>
        <li><strong>Live Gemini Vision:</strong> Add a free Google Gemini API key to scan any custom handwritten notes or textbook pages.</li>
      </ol>
    </div>

    <div class="grid">
` +
  samples
    .map(
      (s, index) => `
      <div class="card" id="card-${index}">
        <div class="card-head">
          <span class="card-title">#${index + 1} — ${escapeXml(s.name)}</span>
          <span class="card-cat">${escapeXml(s.category)}</span>
        </div>
        <div class="image-container">
          <img id="img-${index}" src="./${s.filename}" alt="${escapeXml(s.name)}" />
        </div>
        <div class="latex-box">
          $$${s.latex}$$
        </div>
        <div class="card-footer">
          <span style="font-size: 11px; color: #64748b; font-family: monospace;">${escapeXml(s.filename)}</span>
          <div class="card-footer-buttons">
            <button class="btn-sm" onclick="copyImageToClipboard('img-${index}', '${escapeXml(s.name)}')">📋 Copy Image</button>
            <button class="btn-sm" onclick="copyLatex('${escapeXml(s.latex)}')">Copy LaTeX</button>
            <a class="btn-sm" href="./${s.filename}" download="${s.filename}">📥 Download</a>
          </div>
        </div>
      </div>
    `
    )
    .join('') +
  `
    </div>
  </div>

  <div id="toast" class="toast">Image copied to clipboard! Switch to Math2Code and press Ctrl+V</div>

  <script>
    function showToast(msg) {
      const toast = document.getElementById('toast');
      toast.textContent = msg;
      toast.style.display = 'block';
      setTimeout(() => { toast.style.display = 'none'; }, 3000);
    }

    async function copyImageToClipboard(imgId, name) {
      try {
        const img = document.getElementById(imgId);
        const canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 240;
        const ctx = canvas.getContext('2d');

        // Draw image onto canvas
        const tempImg = new Image();
        tempImg.crossOrigin = 'anonymous';
        tempImg.onload = () => {
          ctx.drawImage(tempImg, 0, 0, 500, 240);
          canvas.toBlob(async (blob) => {
            if (!blob) return;
            try {
              await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
              ]);
              showToast('✓ ' + name + ' image copied! Switch to Math2Code & press Ctrl+V');
            } catch (err) {
              // Fallback
              showToast('Download the file and drag it into Math2Code.');
            }
          }, 'image/png');
        };
        tempImg.src = img.src;
      } catch (err) {
        showToast('Clipboard write failed. Please use Download button.');
      }
    }

    function copyLatex(latex) {
      navigator.clipboard.writeText(latex);
      showToast('✓ LaTeX copied to clipboard!');
    }
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(outDir, 'Math_Formula_Test_Sheet.html'), htmlContent, 'utf-8');
console.log('Successfully created Math_Formula_Test_Sheet.html in', outDir);
