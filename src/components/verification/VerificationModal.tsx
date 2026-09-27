import React, { useState } from 'react';
import { X, ShieldCheck, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import type { EvidenceRow, EvidenceHashRow } from '../../services/seedData';
import { EvidenceService } from '../../services/evidenceService';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  evidence: EvidenceRow;
  hashRecord?: EvidenceHashRow;
  language: 'en' | 'mr';
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  evidence,
  hashRecord,
  language,
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<{
    match: boolean;
    baselineHash: string;
    computedHash: string;
    timestamp: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleRunVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const baseline = hashRecord?.sha256_hash || '';
      const outcome = EvidenceService.verifyIntegrity(evidence.id, baseline);
      setResult(outcome);
      setIsVerifying(false);
    }, 600);
  };

  const handleSimulateTamper = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const tamperedHash = 'deadbeef'.repeat(8);
      const outcome = EvidenceService.verifyIntegrity(evidence.id, tamperedHash);
      setResult(outcome);
      setIsVerifying(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-3">
          <ShieldCheck size={24} className="text-sovereign-navy" />
          <div>
            <h2 className="text-base font-bold text-slate-900 font-mono">
              {language === 'mr'
                ? 'डिजिटल अखंडता व हॅश पडताळणी'
                : 'Cryptographic Integrity Verification'}
            </h2>
            <p className="text-xs text-slate-500 font-mono font-medium">{evidence.muddemal_number}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
            <div className="text-slate-600 font-bold mb-1 font-mono uppercase text-[10px]">
              {language === 'mr' ? 'मूळ जप्ती हॅश (Baseline SHA-256):' : 'Seizure Baseline SHA-256 Digest:'}
            </div>
            <div className="font-mono text-emerald-800 font-bold break-all text-[11px]">
              {hashRecord?.sha256_hash || 'No baseline hash on record'}
            </div>
          </div>

          {result && (
            <div
              className={`p-4 rounded-lg border text-xs ${
                result.match
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-red-50 border-red-300 text-red-900'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm mb-2 font-mono">
                {result.match ? <CheckCircle2 size={18} className="text-emerald-700" /> : <AlertTriangle size={18} className="text-red-700" />}
                <span>
                  {result.match
                    ? language === 'mr'
                      ? 'अखंडता सिद्ध: १००% अपरिवर्तित'
                      : 'PRISTINE MATCH: 100% UNALTERED'
                    : language === 'mr'
                    ? 'धोका: हॅश विसंगती / छेडछाड आढळली'
                    : 'CRITICAL ALERT: CRYPTOGRAPHIC HASH MISMATCH'}
                </span>
              </div>
              <div className="space-y-1 font-mono text-[10px] break-all">
                <div>Computed: {result.computedHash}</div>
                <div>Baseline: {result.baselineHash}</div>
                <div className="text-slate-500 mt-2 font-medium">
                  Verified at: {new Date(result.timestamp).toLocaleTimeString('en-IN')} (IST)
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleSimulateTamper}
              className="text-[11px] text-slate-500 hover:text-red-700 transition-colors font-mono font-medium"
            >
              [Test Tamper Simulation]
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold shadow-xs"
              >
                {language === 'mr' ? 'बंद करा' : 'Close'}
              </button>
              <button
                type="button"
                onClick={handleRunVerification}
                disabled={isVerifying}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-sovereign-navy hover:bg-sovereign-navyHover text-white font-bold text-xs shadow-sm disabled:opacity-50 font-mono uppercase tracking-wider"
              >
                <RefreshCw size={13} className={isVerifying ? 'animate-spin' : ''} />
                <span>
                  {isVerifying
                    ? language === 'mr'
                      ? 'तपासत आहे...'
                      : 'Verifying...'
                    : language === 'mr'
                    ? 'आता पडताळा'
                    : 'Verify Integrity'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
