import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Camera,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Key,
  Layers,
  ArrowRight,
  FileText
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { MathRenderer } from './MathRenderer';
import {
  SAMPLE_FORMULA_IMAGES,
  scanFormulaImage,
  getSavedApiKey,
  type OcrScanResult,
  type SampleFormulaImage
} from '../../services/formulaOcrService';
import { ApiKeyModal } from './ApiKeyModal';

interface FormulaScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyLatex: (latex: string) => void;
}

export const FormulaScannerModal: React.FC<FormulaScannerModalProps> = ({
  isOpen,
  onClose,
  onApplyLatex
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<OcrScanResult | null>(null);
  const [hasApiKey, setHasApiKey] = useState(Boolean(getSavedApiKey()));
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'samples'>('samples');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const executeScan = async (imageData: string, mime: string, fileName?: string) => {
    setIsScanning(true);
    setScanResult(null);

    try {
      const result = await scanFormulaImage(imageData, mime, undefined, fileName);
      setScanResult(result);
    } catch (err) {
      setScanResult({
        status: 'error',
        latex: '',
        confidence: 0,
        source: 'local_ocr',
        errorMessage: err instanceof Error ? err.message : 'Unknown OCR scan failure'
      });
    } finally {
      setIsScanning(false);
    }
  };

  const readImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setSelectedImage(base64);
      await executeScan(base64, file.type || 'image/png', file.name);
    };
    reader.readAsDataURL(file);
  };

  // Listen for paste events when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            readImageFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      readImageFile(file);
    }
  };

  const handleSelectSample = async (sample: SampleFormulaImage) => {
    setSelectedImage(sample.svgDataUri);
    await executeScan(sample.svgDataUri, 'image/svg+xml');
  };

  const handleApply = () => {
    if (scanResult?.status === 'success' && scanResult.latex) {
      onApplyLatex(scanResult.latex);
      onClose();
    }
  };

  const resetScanner = () => {
    setSelectedImage(null);
    setScanResult(null);
    setIsScanning(false);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Formula Scanner (Vision OCR)"
        description="Convert handwritten math notes and textbook screenshots directly to LaTeX equation & code."
        maxWidth="xl"
      >
        <div className="space-y-4">
          {/* Top API Key Info Bar */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                Vision Engine:
              </span>
              {hasApiKey ? (
                <Badge variant="teal" size="sm">Gemini 2.5 Flash Active</Badge>
              ) : (
                <Badge variant="amber" size="sm">Sample Mode (Zero-Key)</Badge>
              )}
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/test-formulas/Math_Formula_Test_Sheet.html"
                target="_blank"
                rel="noreferrer"
                className="text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 flex items-center gap-1 font-medium text-xs"
              >
                <FileText className="w-3 h-3" />
                Test Sheet Document
              </a>
              <button
                type="button"
                onClick={() => setIsKeyModalOpen(true)}
                className="text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-medium text-xs cursor-pointer"
              >
                <Key className="w-3 h-3" />
                {hasApiKey ? 'Change API Key' : 'Add Gemini API Key'}
              </button>
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg text-xs border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('samples')}
              className={`flex-1 py-1.5 px-3 rounded-md font-medium transition-all ${
                activeTab === 'samples'
                  ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Test with 8 Sample Formulas (Instant)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-1.5 px-3 rounded-md font-medium transition-all ${
                activeTab === 'upload'
                  ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Upload Image / Camera / Paste
            </button>
          </div>

          {/* Tab 1: Built-in Sample Formulas */}
          {activeTab === 'samples' && !selectedImage && (
            <div className="space-y-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click any handwritten note or textbook snapshot below to test the Vision OCR extractor immediately:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SAMPLE_FORMULA_IMAGES.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className="p-2 text-left rounded-lg border border-slate-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-500 bg-white dark:bg-slate-900/60 transition-all hover:shadow-xs group cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 truncate">
                          {sample.category}
                        </span>
                        <Badge variant={sample.type === 'handwritten' ? 'blue' : 'emerald'} size="sm">
                          {sample.type === 'handwritten' ? 'Handwritten' : 'Textbook'}
                        </Badge>
                      </div>
                      <div className="w-full h-12 rounded border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-1 mb-1.5">
                        <img
                          src={sample.svgDataUri}
                          alt={sample.name}
                          className="w-full h-full object-contain pointer-events-none"
                        />
                      </div>
                      <div className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">
                        {sample.name}
                      </div>
                    </div>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 flex items-center gap-1 mt-1 font-medium group-hover:translate-x-0.5 transition-transform">
                      Scan Formula <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Custom Image Upload / Camera / Dropzone */}
          {activeTab === 'upload' && !selectedImage && (
            <div className="space-y-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) readImageFile(file);
                }}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/40 cursor-pointer transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-1">
                  Drag & Drop formula image, or click to browse
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-3">
                  Upload photos of notes, whiteboard equations, or screenshots (PNG, JPG, WEBP). You can also press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono text-[10px]">Ctrl+V</kbd> to paste.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    leftIcon={<Upload className="w-3.5 h-3.5" />}
                  >
                    Select File
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      cameraInputRef.current?.click();
                    }}
                    leftIcon={<Camera className="w-3.5 h-3.5" />}
                  >
                    Take Photo
                  </Button>
                </div>
              </div>

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          {/* Selected Image & OCR Result Display */}
          {selectedImage && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Image Preview Box */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <span>Source Formula Image</span>
                    <button
                      type="button"
                      onClick={resetScanner}
                      className="text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-medium capitalize cursor-pointer text-xs"
                    >
                      <RotateCcw className="w-3 h-3" /> Change Image
                    </button>
                  </div>
                  <div className="relative rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 overflow-hidden flex items-center justify-center min-h-[140px] max-h-[180px] p-2">
                    <img
                      src={selectedImage}
                      alt="Formula to scan"
                      className="max-h-full max-w-full object-contain rounded"
                    />
                    {isScanning && (
                      <div className="absolute inset-0 bg-teal-950/40 backdrop-blur-2xs flex flex-col items-center justify-center gap-2">
                        <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs text-teal-200 font-medium animate-pulse">
                          Scanning with Vision AI...
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Extracted Math Formula Box */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <span>Extracted KaTeX Formula</span>
                    {scanResult?.status === 'success' && (
                      <Badge variant="emerald" size="sm">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {(scanResult.confidence * 100).toFixed(0)}% Confidence
                      </Badge>
                    )}
                  </div>

                  <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 min-h-[140px] flex flex-col justify-center items-center text-center">
                    {isScanning ? (
                      <div className="text-xs text-slate-400 animate-pulse">
                        Analyzing visual strokes & math notation...
                      </div>
                    ) : scanResult?.status === 'success' ? (
                      <div className="space-y-2 w-full">
                        <div className="overflow-x-auto py-2">
                          <MathRenderer math={scanResult.latex} displayMode={true} />
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-1.5 rounded border border-slate-200 dark:border-slate-800 break-all">
                          {scanResult.latex}
                        </div>
                      </div>
                    ) : scanResult?.status === 'error' ? (
                      <div className="space-y-2 text-rose-600 dark:text-rose-400 text-xs">
                        <AlertTriangle className="w-6 h-6 mx-auto text-amber-500" />
                        <p className="font-semibold">Formula Not Recognized</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs">
                          {scanResult.errorMessage}
                        </p>
                        {!hasApiKey && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setIsKeyModalOpen(true)}
                            className="mt-1"
                            leftIcon={<Key className="w-3.5 h-3.5" />}
                          >
                            Add Free Gemini API Key
                          </Button>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                <Button type="button" variant="outline" size="sm" onClick={resetScanner}>
                  Pick Another Image
                </Button>

                <div className="flex items-center gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                    Close
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    disabled={scanResult?.status !== 'success'}
                    onClick={handleApply}
                    leftIcon={<Layers className="w-4 h-4" />}
                  >
                    Insert Into Equation Input
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onKeySaved={(hasKey) => setHasApiKey(hasKey)}
      />
    </>
  );
};
