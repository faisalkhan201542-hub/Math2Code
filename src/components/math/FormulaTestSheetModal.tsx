import React, { useState } from 'react';
import {
  FileText,
  ExternalLink,
  Download,
  Copy,
  Check,
  Zap,
  Printer,
  Sparkles
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { MathRenderer } from './MathRenderer';
import {
  SAMPLE_FORMULA_IMAGES,
  type SampleFormulaImage
} from '../../services/formulaOcrService';

interface FormulaTestSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFormula?: (sample: SampleFormulaImage) => void;
}

export const FormulaTestSheetModal: React.FC<FormulaTestSheetModalProps> = ({
  isOpen,
  onClose,
  onSelectFormula
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<'image' | 'latex' | null>(null);

  const handleCopyLatex = async (sample: SampleFormulaImage) => {
    try {
      await navigator.clipboard.writeText(sample.latex);
      setCopiedId(sample.id);
      setCopiedType('latex');
      setTimeout(() => {
        setCopiedId(null);
        setCopiedType(null);
      }, 2000);
    } catch {
      // ignore
    }
  };

  const handleCopyImage = async (sample: SampleFormulaImage) => {
    try {
      // Create offscreen canvas to convert SVG data URI to PNG blob for clipboard
      const canvas = document.createElement('canvas');
      canvas.width = 500;
      canvas.height = 240;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = async () => {
        ctx.drawImage(img, 0, 0, 500, 240);
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            setCopiedId(sample.id);
            setCopiedType('image');
            setTimeout(() => {
              setCopiedId(null);
              setCopiedType(null);
            }, 2500);
          } catch {
            // ClipboardItem write failed
          }
        }, 'image/png');
      };
      img.src = sample.svgDataUri;
    } catch {
      // ignore
    }
  };

  const handleSelect = (sample: SampleFormulaImage) => {
    if (onSelectFormula) {
      onSelectFormula(sample);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Math Formula Test Sheet & Document"
      description="Interactive formulas and printable sheets to test Math2Code Vision OCR with clipboard paste, file drag-and-drop, or mobile camera."
      maxWidth="xl"
      footer={
        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Tip: Click &quot;Copy Image&quot; on any card below, then hit <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">Ctrl+V</kbd> in Math2Code.
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.open('/test-formulas/Math_Formula_Test_Sheet.html', '_blank')}
              leftIcon={<Printer className="w-3.5 h-3.5" />}
            >
              Open Printable HTML / PDF
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 max-h-[68vh] overflow-y-auto pr-1">
        {/* Instructions banner */}
        <div className="p-3.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 flex items-start justify-between gap-3 text-xs">
          <div className="space-y-1">
            <span className="font-semibold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-500" />
              How to Test Formula Scanner:
            </span>
            <p className="text-teal-800 dark:text-teal-300">
              1. <strong>Direct Clipboard:</strong> Click <em>&quot;Copy Image&quot;</em> below &rarr; switch to Math2Code &rarr; hit <kbd className="font-mono bg-teal-200/50 dark:bg-teal-900 px-1 rounded">Ctrl+V</kbd>.<br />
              2. <strong>One-Click Test:</strong> Click <em>&quot;Test in Scanner&quot;</em> to load and scan the formula immediately.<br />
              3. <strong>Download File:</strong> Download any SVG file and drag it onto the upload dropzone.
            </p>
          </div>
          <a
            href="/test-formulas/Math_Formula_Test_Sheet.html"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 p-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold flex items-center gap-1 text-[11px] transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            Full Test Sheet
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </div>

        {/* Grid of 8 test formulas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {SAMPLE_FORMULA_IMAGES.map((sample, idx) => {
            const isImageCopied = copiedId === sample.id && copiedType === 'image';
            const isLatexCopied = copiedId === sample.id && copiedType === 'latex';

            return (
              <div
                key={sample.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between gap-3 shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                      #{idx + 1} — {sample.name}
                    </span>
                    <Badge variant={sample.type === 'handwritten' ? 'blue' : 'emerald'} size="sm">
                      {sample.type === 'handwritten' ? 'Handwritten' : 'Textbook'}
                    </Badge>
                  </div>

                  {/* Rendered Preview Image */}
                  <div className="w-full h-24 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-1 overflow-hidden relative group">
                    <img
                      src={sample.svgDataUri}
                      alt={sample.name}
                      className="w-full h-full object-contain pointer-events-none"
                    />
                  </div>

                  {/* KaTeX formula preview */}
                  <div className="mt-2 p-1.5 rounded-md bg-slate-50 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 text-center overflow-x-auto">
                    <MathRenderer math={sample.latex} displayMode={false} />
                  </div>
                </div>

                {/* Footer action buttons */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopyImage(sample)}
                      className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Copy formula image to clipboard (Ctrl+V)"
                    >
                      {isImageCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-500" />
                          <span>Copy Image</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyLatex(sample)}
                      className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Copy KaTeX LaTeX string"
                    >
                      {isLatexCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <span>LaTeX</span>
                      )}
                    </button>

                    <a
                      href={`/test-formulas/test-${sample.id.replace('sample-', '')}.svg`}
                      download={`formula-${sample.id.replace('sample-', '')}.svg`}
                      className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                      title="Download SVG file"
                    >
                      <Download className="w-3 h-3" />
                    </a>
                  </div>

                  {onSelectFormula && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSelect(sample)}
                      className="text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950 text-xs py-1 px-2 h-auto"
                      rightIcon={<Zap className="w-3 h-3" />}
                    >
                      Test in Scanner
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
