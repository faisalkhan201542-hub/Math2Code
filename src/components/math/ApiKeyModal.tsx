import React, { useState } from 'react';
import { Key, ExternalLink, Check, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { getSavedApiKey, saveApiKey } from '../../services/formulaOcrService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved?: (hasKey: boolean) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeySaved }) => {
  const [keyInput, setKeyInput] = useState(getSavedApiKey());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    saveApiKey(keyInput);
    setSavedSuccess(true);
    onKeySaved?.(Boolean(keyInput.trim()));
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    saveApiKey('');
    setKeyInput('');
    onKeySaved?.(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Google Gemini Vision API Key"
      description="Enable live multimodal OCR for handwritten and textbook formulas."
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="p-3 rounded-lg bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 text-xs text-teal-800 dark:text-teal-300 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Your API Key is kept 100% private in your browser</p>
            <p className="text-teal-700/80 dark:text-teal-300/80">
              The key is stored strictly in your browser's local storage and is sent directly to Google's official Gemini endpoint. No intermediate servers are involved.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Gemini API Key
          </label>
          <div className="relative">
            <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1">
            Don't have a key?{' '}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-0.5 font-medium"
            >
              Get a free Gemini API key from Google AI Studio <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200 mb-1">
            <AlertCircle className="w-3.5 h-3.5 text-indigo-500" />
            Zero-Key Fallback Mode Available
          </div>
          <p className="text-[11px] leading-relaxed">
            Even without an API key, you can test the scanner immediately using our 8 realistic handwritten and textbook sample formulas.
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
          {keyInput ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Remove Key
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSave}
              leftIcon={savedSuccess ? <Check className="w-3.5 h-3.5" /> : undefined}
            >
              {savedSuccess ? 'Saved!' : 'Save Key'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
