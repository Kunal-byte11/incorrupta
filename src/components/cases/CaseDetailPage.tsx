import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Scale,
  Calendar,
  ArrowRightLeft,
  Download,
  Plus,
  Layers,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CasesService } from '../../services/casesService';
import { EvidenceService } from '../../services/evidenceService';
import type { CaseRow, EvidenceRow, EvidenceHashRow, ChainOfCustodyRow } from '../../services/seedData';
import { VerificationModal } from '../verification/VerificationModal';
import { CustodyTransferModal } from '../custody/CustodyTransferModal';
import { CustodyTimeline } from '../custody/CustodyTimeline';
import { downloadBsa63Certificate } from '../../lib/pdf/bsa63Certificate';

interface CaseDetailPageProps {
  caseId: string;
  onBack: () => void;
  onNavigateToIngestion: (caseId: string) => void;
}

export const CaseDetailPage: React.FC<CaseDetailPageProps> = ({
  caseId,
  onBack,
  onNavigateToIngestion,
}) => {
  const { officer, language } = useAuth();
  const [caseData, setCaseData] = useState<CaseRow | null>(null);
  const [evidenceList, setEvidenceList] = useState<EvidenceRow[]>([]);
  const [activeTab, setActiveTab] = useState<'muddemal' | 'custody'>('muddemal');

  // Modal states
  const [verifyingEvidence, setVerifyingEvidence] = useState<{
    evidence: EvidenceRow;
    hashRecord?: EvidenceHashRow;
  } | null>(null);

  const [transferringEvidence, setTransferringEvidence] = useState<EvidenceRow | null>(null);
  const [selectedEvidenceForTimeline, setSelectedEvidenceForTimeline] = useState<string | null>(null);
  const [custodyEvents, setCustodyEvents] = useState<ChainOfCustodyRow[]>([]);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<string | null>(null);

  const reloadData = () => {
    const c = CasesService.getCaseById(caseId);
    setCaseData(c);
    if (c) {
      const evi = EvidenceService.getEvidenceForCase(c.id);
      setEvidenceList(evi);
      if (evi.length > 0 && !selectedEvidenceForTimeline) {
        setSelectedEvidenceForTimeline(evi[0].id);
      }
    }
  };

  useEffect(() => {
    reloadData();
  }, [caseId]);

  useEffect(() => {
    if (selectedEvidenceForTimeline) {
      const events = EvidenceService.getCustodyEventsForEvidence(selectedEvidenceForTimeline);
      setCustodyEvents(events);
    }
  }, [selectedEvidenceForTimeline]);

  if (!officer || !caseData) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>{language === 'mr' ? 'गुन्ह्याची माहिती उपलब्ध नाही' : 'Case details not found.'}</p>
        <button
          onClick={onBack}
          className="mt-3 px-4 py-2 bg-police-elevated rounded text-xs text-white"
        >
          {language === 'mr' ? 'मागे जा' : 'Back to Dashboard'}
        </button>
      </div>
    );
  }

  const handleDownloadCertificate = async (evidence: EvidenceRow) => {
    setIsGeneratingPdf(evidence.id);
    try {
      const hashes = EvidenceService.getHashesForEvidence(evidence.id);
      const hashRecord = hashes[0] || {
        id: 'mock-hash',
        evidence_id: evidence.id,
        sha256_hash: '9f83c605d4c82b3e925b139d404100e2ee196e0ab9a0280ec5738c611f12019e',
        blake3_hash: '7a84e5b9812678c1873dc682490b411d73918a93bc71d4400e93a7494f6f8bb1',
        calculated_at: new Date().toISOString(),
        calculated_by: officer.id,
        verification_passed: true,
        hashing_event_stage: 'SCENE_SEIZURE_PANCHNAMA',
      };

      await downloadBsa63Certificate({
        caseData,
        evidence,
        hashRecord,
        officer,
      });
    } catch (e) {
      console.error('PDF generation failed:', e);
    } finally {
      setIsGeneratingPdf(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button and breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-accent-cyan transition-colors"
        >
          <ArrowLeft size={16} />
          <span>{language === 'mr' ? 'गुन्हा नोंदवही कडे परत' : 'Back to Station Registry'}</span>
        </button>

        <button
          onClick={() => onNavigateToIngestion(caseData.id)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-cyan hover:bg-accent-cyan/90 text-police-navy font-bold text-xs shadow-md shadow-accent-cyan/20 transition-all"
        >
          <Plus size={16} />
          <span>
            {language === 'mr'
              ? 'कलम १०५ BNSS डिजिटल जप्ती (Ingest Evidence)'
              : 'BNSS 105 Digital Seizure'}
          </span>
        </button>
      </div>

      {/* Case Header Card */}
      <div className="bg-police-slate border border-police-border rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-mono text-sm font-bold text-accent-gold px-2.5 py-0.5 rounded bg-police-navy border border-accent-gold/40">
                {caseData.cr_number}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-police-elevated text-slate-300 border border-police-border">
                {caseData.police_station}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-accent-cyan/15 text-accent-cyan font-semibold border border-accent-cyan/30">
                {caseData.status.replace(/_/g, ' ')}
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-white mt-2">{caseData.title}</h1>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {caseData.description}
            </p>

            {/* Case Particulars */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-slate-400 border-t border-police-border/60 pt-3">
              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-accent-gold" />
                <span>
                  FIR Date:{' '}
                  {new Date(caseData.fir_date).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}{' '}
                  (IST)
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Scale size={13} className="text-accent-cyan" />
                <span>Court: {caseData.designated_court}</span>
              </div>
            </div>

            {/* Penal Sections Tags */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              <span className="text-xs text-slate-400 font-semibold mr-1">
                {language === 'mr' ? 'लागू कलमे:' : 'Penal Sections:'}
              </span>
              {caseData.penal_sections.map((sec) => (
                <span
                  key={sec}
                  className="px-2 py-0.5 rounded bg-police-navy border border-police-border text-xs font-mono text-slate-200"
                >
                  {sec}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-police-border">
        <button
          onClick={() => setActiveTab('muddemal')}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'muddemal'
              ? 'border-accent-cyan text-accent-cyan'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers size={16} />
          <span>
            {language === 'mr'
              ? `मुद्देमाल रजिस्टर (${evidenceList.length})`
              : `Muddemal Property Register (${evidenceList.length})`}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('custody')}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'custody'
              ? 'border-accent-gold text-accent-gold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock size={16} />
          <span>
            {language === 'mr'
              ? 'अखंडित ताबा साखळी (Chain of Custody)'
              : 'Cryptographic Custody Ledger'}
          </span>
        </button>
      </div>

      {/* Tab 1: Muddemal Property Register */}
      {activeTab === 'muddemal' && (
        <div className="bg-police-slate border border-police-border rounded-xl overflow-hidden shadow-lg">
          {evidenceList.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              <ShieldCheck size={36} className="mx-auto mb-2 text-slate-500 opacity-60" />
              <p>
                {language === 'mr'
                  ? 'या गुन्ह्यात अद्याप कोणतीही डिजिटल जप्ती नोंदवलेली नाही.'
                  : 'No digital evidence items registered under this CR number yet.'}
              </p>
              <button
                onClick={() => onNavigateToIngestion(caseData.id)}
                className="mt-3 px-4 py-2 bg-accent-cyan text-police-navy rounded font-bold text-xs"
              >
                {language === 'mr' ? 'पहिली जप्ती नोंदवा (BNSS 105)' : 'Start First Ingestion'}
              </button>
            </div>
          ) : (
            <div className="divide-y divide-police-border/60">
              {evidenceList.map((item) => {
                const hashes = EvidenceService.getHashesForEvidence(item.id);
                const baselineHash = hashes[0]?.sha256_hash || '';

                return (
                  <div
                    key={item.id}
                    className="p-5 hover:bg-police-elevated/40 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-accent-gold px-2 py-0.5 rounded bg-police-navy border border-police-border">
                          {item.muddemal_number}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-police-elevated text-slate-300 font-mono">
                          Panchnama: {item.panchnama_reference}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                            item.status === 'INGESTED_PRISTINE'
                              ? 'bg-status-pristine/20 text-status-pristine border border-status-pristine/30'
                              : item.status === 'IN_POLICE_MALKHANA'
                              ? 'bg-accent-gold/20 text-accent-gold border border-accent-gold/30'
                              : 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30'
                          }`}
                        >
                          {item.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white">{item.title}</h3>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                        <span>Category: {item.category.replace(/_/g, ' ')}</span>
                        <span>•</span>
                        <span>
                          Size: {(item.file_size_bytes / (1024 * 1024)).toFixed(2)} MB ({item.mime_type})
                        </span>
                        {item.malkhana_shelf_location && (
                          <>
                            <span>•</span>
                            <span className="text-accent-gold">
                              Location: {item.malkhana_shelf_location}
                            </span>
                          </>
                        )}
                        {item.dfsl_kalina_acknowledgement_no && (
                          <>
                            <span>•</span>
                            <span className="text-accent-cyan">
                              FSL Ref: {item.dfsl_kalina_acknowledgement_no}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Cryptographic Baseline Hash */}
                      <div className="pt-1 flex items-center gap-2 text-[10px] font-mono">
                        <span className="text-slate-500">SHA-256:</span>
                        <span className="text-status-pristine truncate max-w-md">
                          {baselineHash || 'Calculating...'}
                        </span>
                        <CheckCircle2 size={12} className="text-status-pristine shrink-0" />
                      </div>
                    </div>

                    {/* Operational Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setVerifyingEvidence({ evidence: item, hashRecord: hashes[0] });
                        }}
                        className="px-3 py-1.5 rounded bg-police-elevated hover:bg-police-border border border-police-border text-xs text-status-pristine font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <ShieldCheck size={14} />
                        <span>{language === 'mr' ? 'हॅश पडताळा' : 'Verify Integrity'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTransferringEvidence(item)}
                        className="px-3 py-1.5 rounded bg-police-elevated hover:bg-police-border border border-police-border text-xs text-accent-gold font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <ArrowRightLeft size={14} />
                        <span>{language === 'mr' ? 'ताबा हस्तांतरण' : 'Transfer Custody'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadCertificate(item)}
                        disabled={isGeneratingPdf === item.id}
                        className="px-3 py-1.5 rounded bg-accent-cyan hover:bg-accent-cyan/90 text-police-navy text-xs font-bold flex items-center gap-1.5 shadow transition-all disabled:opacity-50"
                      >
                        <Download size={14} />
                        <span>
                          {isGeneratingPdf === item.id
                            ? language === 'mr'
                              ? 'तयार होत आहे...'
                              : 'Generating...'
                            : language === 'mr'
                            ? 'कलम ६३ प्रमाणपत्र'
                            : 'Section 63 BSA'}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Full Chain of Custody Ledger */}
      {activeTab === 'custody' && (
        <div className="bg-police-slate border border-police-border rounded-xl p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-police-border">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock size={16} className="text-accent-gold" />
                <span>
                  {language === 'mr'
                    ? 'अखंडित ताबा साखळी इतिहास (Merkle Chained Events)'
                    : 'Unbroken Custody Timeline & Dual Passkey Attestations'}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'mr'
                  ? 'घटनास्थळापासून ते मालखाना व कलिना FSL पर्यंतचा प्रत्येक हस्तांतरण ब्लॉक'
                  : 'Every transfer secured with timestamp, previous hash, and officer biometric signature.'}
              </p>
            </div>

            {/* Select Muddemal Item */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">
                {language === 'mr' ? 'मुद्देमाल निवडा:' : 'Select Muddemal:'}
              </span>
              <select
                value={selectedEvidenceForTimeline || ''}
                onChange={(e) => setSelectedEvidenceForTimeline(e.target.value)}
                className="px-3 py-1.5 rounded bg-police-navy border border-police-border text-white text-xs font-mono"
              >
                {evidenceList.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.muddemal_number} — {e.title.slice(0, 30)}...
                  </option>
                ))}
              </select>
            </div>
          </div>

          <CustodyTimeline events={custodyEvents} language={language} />
        </div>
      )}

      {/* Modals */}
      {verifyingEvidence && (
        <VerificationModal
          isOpen={!!verifyingEvidence}
          onClose={() => setVerifyingEvidence(null)}
          evidence={verifyingEvidence.evidence}
          hashRecord={verifyingEvidence.hashRecord}
          language={language}
        />
      )}

      {transferringEvidence && (
        <CustodyTransferModal
          isOpen={!!transferringEvidence}
          onClose={() => setTransferringEvidence(null)}
          onTransferred={reloadData}
          evidence={transferringEvidence}
          currentOfficer={officer}
          language={language}
        />
      )}
    </div>
  );
};
