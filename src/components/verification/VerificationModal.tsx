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
      // Compare against true baseline
      const baseline = hashRecord?.sha256_hash || '';
      const outcome = EvidenceService.verifyIntegrity(evidence.id, baseline);
      setResult(outcome);
      setIsVerifying(false);
    }, 600);
  };

  const handleSimulateTamper = () => {
    setIsVerifying(true);
    setTimeout(() => {
      // Simulate altered bit in storage
      const tamperedHash = 'deadbeef'.repeat(8);
      const outcome = EvidenceService.verifyIntegrity(evidence.id, tamperedHash);
      setResult(outcome);
      setIsVerifying(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-police-slate border border-police-border rounded-xl max-w-lg w-full shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded hover:bg-police-elevated"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-4 border-b border-police-border pb-3">
          <ShieldCheck size={24} className="text-accent-cyan" />
          <div>
            <h2 className="text-base font-bold text-white">
              {language === 'mr'
                ? 'डिजिटल अखंडता व हॅश पडताळणी'
                : 'Cryptographic Integrity Verification'}
            </h2>
            <p className="text-xs text-slate-400 font-mono">{evidence.muddemal_number}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-police-navy p-3.5 rounded-lg border border-police-border text-xs">
            <div className="text-slate-400 mb-1">
              {language === 'mr' ? 'मूळ जप्ती हॅश (Baseline SHA-256):' : 'Seizure Baseline SHA-256 Digest:'}
            </div>
            <div className="font-mono text-status-pristine break-all text-[11px]">
              {hashRecord?.sha256_hash || 'No baseline hash on record'}
            </div>
          </div>

          {result && (
            <div
              className={`p-4 rounded-lg border text-xs ${
                result.match
                  ? 'bg-status-pristine/10 border-status-pristine/40 text-status-pristine'
                  : 'bg-status-tamper/15 border-status-tamper/40 text-status-tamper'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm mb-2">
                {result.match ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
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
                <div className="text-slate-400 mt-2">
                  Verified at: {new Date(result.timestamp).toLocaleTimeString('en-IN')} (IST)
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleSimulateTamper}
              className="text-[11px] text-slate-500 hover:text-status-tamper transition-colors"
            >
              [Test Tamper Simulation]
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded bg-police-elevated hover:bg-police-border text-slate-300 text-xs"
              >
                {language === 'mr' ? 'बंद करा' : 'Close'}
              </button>
              <button
                type="button"
                onClick={handleRunVerification}
                disabled={isVerifying}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-accent-cyan hover:bg-accent-cyan/90 text-police-navy font-bold text-xs shadow-md disabled:opacity-50"
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
