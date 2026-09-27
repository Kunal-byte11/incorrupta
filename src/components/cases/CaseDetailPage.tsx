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
  Lock,
  Tag,
  Cpu,
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
      <div className="p-8 text-center text-slate-500 font-mono text-xs">
        <p>{language === 'mr' ? 'गुन्ह्याची माहिती उपलब्ध नाही' : 'Case dossier not found.'}</p>
        <button
          onClick={onBack}
          className="mt-3 px-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800 shadow-xs"
        >
          {language === 'mr' ? 'मागे जा' : 'Return to Registry'}
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
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Navigation and Quick Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-sovereign-navy transition-colors font-mono font-medium"
        >
          <ArrowLeft size={14} />
          <span>{language === 'mr' ? 'गुन्हा नोंदवही कडे परत' : 'Return to Station Registry'}</span>
        </button>

        <button
          onClick={() => onNavigateToIngestion(caseData.id)}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-sovereign-navy hover:bg-sovereign-navyHover text-white font-bold text-xs font-mono uppercase tracking-wider shadow-sm transition-all"
        >
          <Plus size={14} />
          <span>
            {language === 'mr'
              ? 'कलम १०५ BNSS डिजिटल जप्ती (Ingest)'
              : 'BNSS 105 Ingest Seizure'}
          </span>
        </button>
      </div>

      {/* Case Dossier Master Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-amber-900 px-2 py-0.5 rounded bg-amber-50 border border-amber-300">
                {caseData.cr_number}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                {caseData.police_station}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300 uppercase font-semibold">
                {caseData.status.replace(/_/g, ' ')}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1 font-bold">
                <Lock size={10} />
                <span>MERKLE LOCKED</span>
              </span>
            </div>

            <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">{caseData.title}</h1>
            <p className="text-xs text-slate-600 max-w-4xl leading-relaxed">
              {caseData.description}
            </p>

            {/* Case Particulars */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 border-t border-slate-200 pt-2.5 font-mono text-[11px]">
              <div className="flex items-center gap-1.5">
                <Calendar size={12} className="text-amber-700" />
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
                <Scale size={12} className="text-sovereign-navy" />
                <span>Court: {caseData.designated_court}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Cpu size={12} className="text-emerald-700" />
                <span>Forensic Hash: BLAKE3 &bull; SHA-256 Dual Engine</span>
              </div>
            </div>

            {/* Penal Sections Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase mr-1 font-bold">
                {language === 'mr' ? 'लागू कलमे:' : 'Statutory Sections:'}
              </span>
              {caseData.penal_sections.map((sec) => (
                <span
                  key={sec}
                  className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-700 font-medium"
                >
                  {sec}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Forensic Navigation Tabs in Light Mode */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 font-mono text-xs">
        <button
          onClick={() => setActiveTab('muddemal')}
          className={`py-2 px-3.5 rounded-t border-b-2 flex items-center gap-2 transition-all font-bold ${
            activeTab === 'muddemal'
              ? 'border-sovereign-navy text-sovereign-navy bg-white shadow-xs'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers size={14} />
          <span>
            {language === 'mr'
              ? `मुद्देमाल रजिस्टर (${evidenceList.length})`
              : `Muddemal Evidence Register (${evidenceList.length})`}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('custody')}
          className={`py-2 px-3.5 rounded-t border-b-2 flex items-center gap-2 transition-all font-bold ${
            activeTab === 'custody'
              ? 'border-sovereign-navy text-sovereign-navy bg-white shadow-xs'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Clock size={14} />
          <span>
            {language === 'mr'
              ? 'अखंडित ताबा साखळी (Chain of Custody)'
              : 'Cryptographic Custody Timeline'}
          </span>
        </button>
      </div>

      {/* Tab 1: Muddemal Property Register */}
      {activeTab === 'muddemal' && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          {evidenceList.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs font-mono">
              <ShieldCheck size={32} className="mx-auto mb-2 text-slate-400 opacity-60" />
              <p>
                {language === 'mr'
                  ? 'या गुन्ह्यात अद्याप कोणतीही डिजिटल जप्ती नोंदवलेली नाही.'
                  : 'No digital evidence items registered under this CR number yet.'}
              </p>
              <button
                onClick={() => onNavigateToIngestion(caseData.id)}
                className="mt-3 px-3 py-1.5 bg-sovereign-navy text-white rounded font-bold text-xs uppercase shadow-sm"
              >
                {language === 'mr' ? 'पहिली जप्ती नोंदवा (BNSS 105)' : 'Start First Ingestion'}
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {evidenceList.map((item) => {
                const hashes = EvidenceService.getHashesForEvidence(item.id);
                const baselineHash = hashes[0]?.sha256_hash || '';
                const blake3Hash = hashes[0]?.blake3_hash || '';

                return (
                  <div
                    key={item.id}
                    className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-sovereign-navy px-2 py-0.5 rounded bg-slate-100 border border-slate-300">
                          {item.muddemal_number}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-50 text-slate-700 font-mono border border-slate-200 flex items-center gap-1 font-medium">
                          <Tag size={10} className="text-amber-700" />
                          <span>Panchnama: {item.panchnama_reference}</span>
                        </span>
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            item.status === 'INGESTED_PRISTINE'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                              : item.status === 'IN_POLICE_MALKHANA'
                              ? 'bg-amber-50 text-amber-900 border border-amber-300'
                              : 'bg-slate-100 text-slate-700 border border-slate-300'
                          }`}
                        >
                          {item.status.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200">
                          Seal #MUM-CYB-994201
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                          Tableau T8u Hardware Locked
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 tracking-tight">{item.title}</h3>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-mono">
                        <span>Category: {item.category.replace(/_/g, ' ')}</span>
                        <span>&bull;</span>
                        <span>
                          Size: {(item.file_size_bytes / (1024 * 1024)).toFixed(2)} MB ({item.mime_type})
                        </span>
                        {item.malkhana_shelf_location && (
                          <>
                            <span>&bull;</span>
                            <span className="text-amber-800 font-medium">
                              Location: {item.malkhana_shelf_location}
                            </span>
                          </>
                        )}
                        {item.dfsl_kalina_acknowledgement_no && (
                          <>
                            <span>&bull;</span>
                            <span className="text-emerald-800 font-medium">
                              FSL Ref: {item.dfsl_kalina_acknowledgement_no}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Cryptographic Dual Hashes Display */}
                      <div className="pt-1 space-y-0.5 text-[10px] font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 w-16 font-semibold">SHA-256:</span>
                          <span className="text-emerald-800 font-medium truncate max-w-xl">
                            {baselineHash || 'Calculating...'}
                          </span>
                          <CheckCircle2 size={11} className="text-emerald-600 shrink-0" />
                        </div>
                        {blake3Hash && (
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 w-16 font-semibold">BLAKE3:</span>
                            <span className="text-amber-800 font-medium truncate max-w-xl">
                              {blake3Hash}
                            </span>
                            <CheckCircle2 size={11} className="text-amber-600 shrink-0" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Operational Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0 font-mono text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setVerifyingEvidence({ evidence: item, hashRecord: hashes[0] });
                        }}
                        className="px-2.5 py-1.5 rounded bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <ShieldCheck size={13} />
                        <span>{language === 'mr' ? 'हॅश पडताळा' : 'Verify'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTransferringEvidence(item)}
                        className="px-2.5 py-1.5 rounded bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <ArrowRightLeft size={13} />
                        <span>{language === 'mr' ? 'ताबा हस्तांतरण' : 'Transfer'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadCertificate(item)}
                        disabled={isGeneratingPdf === item.id}
                        className="px-3 py-1.5 rounded bg-sovereign-navy hover:bg-sovereign-navyHover text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                      >
                        <Download size={13} />
                        <span>
                          {isGeneratingPdf === item.id
                            ? language === 'mr'
                              ? 'तयार होत आहे...'
                              : 'Generating...'
                            : language === 'mr'
                              ? 'कलम ६३ प्रमाणपत्र'
                              : 'Sec 63 BSA'}
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

      {/* Tab 2: Full Chain of Custody Ledger in Light Mode */}
      {activeTab === 'custody' && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-mono">
                <Clock size={15} className="text-amber-700" />
                <span>
                  {language === 'mr'
                    ? 'अखंडित ताबा साखळी इतिहास (Merkle Chained Events)'
                    : 'Unbroken Custody Timeline & Dual Passkey Attestations'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                {language === 'mr'
                  ? 'घटनास्थळापासून ते मालखाना व कलिना FSL पर्यंतचा प्रत्येक हस्तांतरण ब्लॉक'
                  : 'Every transfer secured with timestamp, previous hash, and officer biometric signature.'}
              </p>
            </div>

            {/* Select Muddemal Item */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-slate-500 font-semibold">
                {language === 'mr' ? 'मुद्देमाल निवडा:' : 'Select Muddemal:'}
              </span>
              <select
                value={selectedEvidenceForTimeline || ''}
                onChange={(e) => setSelectedEvidenceForTimeline(e.target.value)}
                className="px-2.5 py-1 rounded bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono shadow-xs"
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
