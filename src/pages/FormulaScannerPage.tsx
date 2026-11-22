import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  Upload,
  Sparkles,
  Key,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Code2,
  LineChart,
  GraduationCap,
  Copy,
  Check,
  Layers,
  FileImage,
  FileText
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CodePanel } from '../components/ui/CodePanel';
import { MathRenderer } from '../components/math/MathRenderer';
import { ApiKeyModal } from '../components/math/ApiKeyModal';
import { FormulaTestSheetModal } from '../components/math/FormulaTestSheetModal';
import {
  SAMPLE_FORMULA_IMAGES,
  scanFormulaImage,
  getSavedApiKey,
  type OcrScanResult,
  type SampleFormulaImage
} from '../services/formulaOcrService';
import { convertEquationToPython, type ConversionResult } from '../engine';

export const FormulaScannerPage: React.FC = () => {
  const navigate = useNavigate();

  // Selected image state
  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_FORMULA_IMAGES[0].svgDataUri);
  const [selectedSampleId, setSelectedSampleId] = useState<string>(SAMPLE_FORMULA_IMAGES[0].id);
  const [mimeType, setMimeType] = useState<string>('image/svg+xml');
  const [imageFileName, setImageFileName] = useState<string>('sample-sigmoid-notes.svg');

  // OCR scanning state
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<OcrScanResult | null>({
    status: 'success',
    latex: SAMPLE_FORMULA_IMAGES[0].latex,
    confidence: 0.99,
    detectedPattern: 'sigmoid',
    source: 'sample_match',
    equationName: SAMPLE_FORMULA_IMAGES[0].name
  });

  // Extracted LaTeX state (editable by user)
  const [extractedLatex, setExtractedLatex] = useState<string>(SAMPLE_FORMULA_IMAGES[0].latex);
  const [isCopiedLatex, setIsCopiedLatex] = useState(false);

  // API Key state
  const [hasApiKey, setHasApiKey] = useState(Boolean(getSavedApiKey()));
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [isTestSheetOpen, setIsTestSheetOpen] = useState(false);

  // Gallery filter
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'handwritten' | 'textbook'>('all');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Live compilation of extracted LaTeX into Python code
  const compiledCode: ConversionResult = useMemo(() => {
    if (!extractedLatex.trim()) {
      return {
        status: 'invalid_input',
        pattern: 'unsupported',
        equationName: 'Empty Formula',
        code: '',
        errorMessage: 'Enter or scan a formula to synthesize code.'
      };
    }
    return convertEquationToPython(extractedLatex);
  }, [extractedLatex]);

  const executeScan = useCallback(async (imageData: string, mime: string, fileName?: string) => {
    setIsScanning(true);
    setScanResult(null);

    try {
      const result = await scanFormulaImage(imageData, mime, undefined, fileName || imageFileName);
      setScanResult(result);
      if (result.status === 'success') {
        setExtractedLatex(result.latex);
      }
    } catch (err) {
      setScanResult({
        status: 'error',
        latex: '',
        confidence: 0,
        source: 'local_ocr',
        errorMessage: err instanceof Error ? err.message : 'Unknown scanning error'
      });
    } finally {
      setIsScanning(false);
    }
  }, [imageFileName]);

  const readImageFile = useCallback((file: File) => {
    setImageFileName(file.name);
    setSelectedSampleId('');
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setSelectedImage(base64);
      setMimeType(file.type || 'image/png');
      await executeScan(base64, file.type || 'image/png', file.name);
    };
    reader.readAsDataURL(file);
  }, [executeScan]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readImageFile(file);
  };

  const handleSelectSample = async (sample: SampleFormulaImage) => {
    setSelectedSampleId(sample.id);
    setImageFileName(`${sample.id}.svg`);
    setSelectedImage(sample.svgDataUri);
    setMimeType('image/svg+xml');
    await executeScan(sample.svgDataUri, 'image/svg+xml', `${sample.id}.svg`);
  };

  // Clipboard paste listener
  useEffect(() => {
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
  }, [readImageFile]);

  const handleCopyLatex = async () => {
    if (!extractedLatex) return;
    await navigator.clipboard.writeText(extractedLatex);
    setIsCopiedLatex(true);
    setTimeout(() => setIsCopiedLatex(false), 2000);
  };

  const filteredSamples = SAMPLE_FORMULA_IMAGES.filter((sample) => {
    if (galleryFilter === 'all') return true;
    return sample.type === galleryFilter;
  });

  return (
    <div className="space-y-6">
      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Image Input & Sample Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileImage className="w-4 h-4 text-teal-500" />
                  Formula Image Source
                </CardTitle>
                <CardDescription className="mt-0.5">
                  Drag & drop any math image, paste from clipboard (<kbd className="text-[10px]">Ctrl+V</kbd>), or pick from the sample gallery below.
                </CardDescription>
              </div>
              <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0 flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTestSheetOpen(true)}
                  className="text-xs h-8 text-teal-700 dark:text-teal-300 border-teal-300/80 dark:border-teal-700"
                  leftIcon={<FileText className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
                >
                  Test Sheet
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsKeyModalOpen(true)}
                  className="text-xs h-8"
                  leftIcon={<Key className="w-3.5 h-3.5 text-teal-500" />}
                >
                  {hasApiKey ? 'API Key Active' : 'API Key'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => cameraInputRef.current?.click()}
                  title="Take Photo with Camera"
                  leftIcon={<Camera className="w-3.5 h-3.5" />}
                >
                  Camera
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload File"
                  leftIcon={<Upload className="w-3.5 h-3.5" />}
                >
                  Upload
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Image Preview Box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) readImageFile(file);
                }}
                className="relative group rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 bg-slate-50/80 dark:bg-slate-950/70 overflow-hidden flex flex-col items-center justify-center p-3 min-h-[190px] cursor-pointer transition-all"
              >
                {selectedImage ? (
                  <div className="relative w-full flex flex-col items-center">
                    <img
                      src={selectedImage}
                      alt="Selected formula"
                      className="max-h-[160px] max-w-full object-contain rounded shadow-xs"
                    />
                    <div className="absolute top-1 right-1 flex items-center gap-1">
                      <span className="px-2 py-0.5 rounded bg-white/90 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-700/80 backdrop-blur-xs text-[10px] text-slate-700 dark:text-slate-300 font-mono shadow-xs">
                        {imageFileName}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Click to upload or drag image here</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Supports PNG, JPG, WEBP, SVG</p>
                  </div>
                )}

                {/* Scanning overlay */}
                {isScanning && (
                  <div className="absolute inset-0 bg-white/85 dark:bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center gap-2.5 z-20">
                    <div className="relative w-12 h-12">
                      <div className="w-12 h-12 rounded-full border-2 border-teal-500/20 border-t-teal-500 animate-spin" />
                      <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400 absolute inset-0 m-auto animate-pulse" />
                    </div>
                    <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">
                      Vision AI analyzing equation strokes...
                    </span>
                  </div>
                )}
              </div>

              {/* Quick actions for image */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                <span className="text-slate-500 dark:text-slate-400">
                  Tip: Copy any screenshot and hit <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px]">Ctrl+V</kbd>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsTestSheetOpen(true)}
                    className="text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <FileText className="w-3 h-3" />
                    Test Document
                  </button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => executeScan(selectedImage, mimeType, imageFileName)}
                    isLoading={isScanning}
                    leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                  >
                    Rescan
                  </Button>
                </div>
              </div>

              {/* Hidden input elements */}
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
            </CardContent>
          </Card>

          {/* Sample Gallery Card */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  Sample Formula Gallery (8 Built-In)
                </CardTitle>
                <CardDescription className="mt-0.5">
                  Select realistic handwritten notes or printed snippets to test Vision OCR instantly:
                </CardDescription>
              </div>
              <div className="flex items-center gap-1 p-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] self-end sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setGalleryFilter('all')}
                  className={`px-2 py-0.5 rounded font-medium ${
                    galleryFilter === 'all'
                      ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 font-semibold'
                      : 'text-slate-500'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setGalleryFilter('handwritten')}
                  className={`px-2 py-0.5 rounded font-medium ${
                    galleryFilter === 'handwritten'
                      ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 font-semibold'
                      : 'text-slate-500'
                  }`}
                >
                  Handwritten
                </button>
                <button
                  type="button"
                  onClick={() => setGalleryFilter('textbook')}
                  className={`px-2 py-0.5 rounded font-medium ${
                    galleryFilter === 'textbook'
                      ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 font-semibold'
                      : 'text-slate-500'
                  }`}
                >
                  Textbook
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
                {filteredSamples.map((sample) => {
                  const isSelected = selectedSampleId === sample.id;
                  return (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleSelectSample(sample)}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 ring-1 ring-teal-500'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60'
                      }`}
                    >
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-semibold text-slate-500 truncate">
                            {sample.category}
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                              sample.type === 'handwritten'
                                ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                                : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            }`}
                          >
                            {sample.type === 'handwritten' ? 'Handwritten' : 'Textbook'}
                          </span>
                        </div>
                        <div className="w-full h-10 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-0.5 mb-1 overflow-hidden">
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
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: OCR Extracted Formula & Code Synthesis (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Extracted KaTeX Formula Card */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-500" />
                  Extracted Mathematical Formula
                </CardTitle>
                <CardDescription className="mt-0.5">
                  KaTeX rendered formula extracted from your visual source. You can edit the LaTeX directly below.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                {scanResult?.status === 'success' && (
                  <Badge variant="emerald" size="sm">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {(scanResult.confidence * 100).toFixed(0)}% Confidence
                  </Badge>
                )}
                {scanResult?.source === 'gemini_vision' && (
                  <Badge variant="teal" size="sm">Gemini AI Vision</Badge>
                )}
                {scanResult?.source === 'sample_match' && (
                  <Badge variant="blue" size="sm">Sample Pattern Verified</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* KaTeX Live Render Box */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 min-h-[90px] flex items-center justify-center text-center overflow-x-auto">
                {isScanning ? (
                  <div className="text-xs text-slate-400 animate-pulse flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-500 animate-spin" />
                    Extracting mathematical notation...
                  </div>
                ) : extractedLatex.trim() ? (
                  <MathRenderer math={extractedLatex} displayMode={true} />
                ) : (
                  <span className="text-xs text-slate-400 italic">No formula extracted yet.</span>
                )}
              </div>

              {/* Editable LaTeX Textarea */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  <span>LaTeX Representation</span>
                  <button
                    type="button"
                    onClick={handleCopyLatex}
                    className="text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-medium capitalize cursor-pointer text-xs"
                  >
                    {isCopiedLatex ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {isCopiedLatex ? 'Copied' : 'Copy LaTeX'}
                  </button>
                </div>
                <textarea
                  value={extractedLatex}
                  onChange={(e) => setExtractedLatex(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                  placeholder="e.g. \sigma(z) = \frac{1}{1 + e^{-z}}"
                />
              </div>

              {/* Error Callout if applicable */}
              {scanResult?.status === 'error' && (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold">Formula Recognition Notice</p>
                    <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                      {scanResult.errorMessage}
                    </p>
                    {!hasApiKey && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsKeyModalOpen(true)}
                        className="mt-1"
                        leftIcon={<Key className="w-3 h-3" />}
                      >
                        Enter Gemini API Key
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Synthesized Python Code Card */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-500" />
                  Synthesized Vectorized Python Code
                </CardTitle>
                <CardDescription className="mt-0.5">
                  Real-time AST-validated implementation synthesized from the scanned mathematical equation.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                {compiledCode.status === 'success' && (
                  <Badge variant="teal" size="sm">
                    {compiledCode.metadata?.category || 'NumPy Vectorized'}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {compiledCode.status === 'success' ? (
                <>
                  <CodePanel
                    code={compiledCode.code}
                    language="Python 3.11"
                    title="Synthesized NumPy Code"
                  />

                  {/* Operational Controls / Flow Through */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        navigate(`/equation-to-code?latex=${encodeURIComponent(extractedLatex)}`)
                      }
                      leftIcon={<Code2 className="w-3.5 h-3.5" />}
                    >
                      Open in Equation → Code
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/derivation/${compiledCode.pattern}`)
                      }
                      leftIcon={<GraduationCap className="w-3.5 h-3.5" />}
                    >
                      Step-by-Step Proof
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/graph-plotter')}
                      leftIcon={<LineChart className="w-3.5 h-3.5" />}
                    >
                      Plot Function
                    </Button>
                  </div>
                </>
              ) : (
                <div className="p-4 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300">
                  <p className="font-semibold mb-1">Equation Parser Feedback</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    {compiledCode.errorMessage ||
                      'The current formula syntax has not matched an automatic code template. You can refine the LaTeX string above.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onKeySaved={(hasKey) => setHasApiKey(hasKey)}
      />

      <FormulaTestSheetModal
        isOpen={isTestSheetOpen}
        onClose={() => setIsTestSheetOpen(false)}
        onSelectFormula={handleSelectSample}
      />
    </div>
  );
};
