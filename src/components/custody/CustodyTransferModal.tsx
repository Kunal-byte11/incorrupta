import React, { useState } from 'react';
import { X, ArrowRightLeft, Fingerprint, AlertCircle } from 'lucide-react';
import type { EvidenceRow } from '../../services/seedData';
import { EvidenceService } from '../../services/evidenceService';
import { SEEDED_OFFICERS, type OfficerProfile } from '../../context/AuthContext';

interface CustodyTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransferred: () => void;
  evidence: EvidenceRow;
  currentOfficer: OfficerProfile;
  language: 'en' | 'mr';
}

export const CustodyTransferModal: React.FC<CustodyTransferModalProps> = ({
  isOpen,
  onClose,
  onTransferred,
  evidence,
  currentOfficer,
  language,
}) => {
  const [transfereeId, setTransfereeId] = useState('22222222-2222-4222-a222-222222222222'); // Default to HC Ramesh Patil
  const [movementType, setMovementType] = useState<
    'SCENE_SEIZURE_TO_MALKHANA' | 'MALKHANA_TO_KALINA_FSL' | 'KALINA_FSL_TO_MALKHANA' | 'MALKHANA_TO_COURT_EXHIBIT'
  >('SCENE_SEIZURE_TO_MALKHANA');
  const [purposeMemo, setPurposeMemo] = useState('Safe deposit in Station Malkhana vault under sealed custody');
  const [shelfLocation, setShelfLocation] = useState('Rack 2, Bin M-04');
  const [dfslAckNo, setDfslAckNo] = useState('DFSL-KALINA-2026-9811');
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSigning(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      EvidenceService.transferCustody({
        evidenceId: evidence.id,
        transferorId: currentOfficer.id,
        transfereeId,
        movementType,
        purposeMemo: purposeMemo.trim(),
        malkhanaShelfLocation: movementType.includes('MALKHANA') ? shelfLocation.trim() : undefined,
        dfslAcknowledgementNo: movementType.includes('FSL') ? dfslAckNo.trim() : undefined,
      });

      setIsSigning(false);
      onTransferred();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Custody transfer failed');
      setIsSigning(false);
    }
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
          <ArrowRightLeft size={22} className="text-amber-700" />
          <div>
            <h2 className="text-base font-bold text-slate-900 font-mono">
              {language === 'mr' ? 'मुद्देमाल ताबा हस्तांतरण' : 'Muddemal Custody Transfer & Handover'}
            </h2>
            <p className="text-xs text-slate-500 font-mono font-medium">{evidence.muddemal_number}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-mono">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleTransfer} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1 font-mono">
              {language === 'mr' ? 'हस्तांतरण प्रकार (Movement Type)' : 'Movement Category'}
            </label>
            <select
              value={movementType}
              onChange={(e) => setMovementType(e.target.value as typeof movementType)}
              className="w-full px-3 py-2 rounded bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-sovereign-navy shadow-xs font-medium"
            >
              <option value="SCENE_SEIZURE_TO_MALKHANA">
                {language === 'mr' ? 'घटनास्थळ जप्ती -> ठाणे मालखाना' : 'Scene Seizure -> Station Malkhana Deposit'}
              </option>
              <option value="MALKHANA_TO_KALINA_FSL">
                {language === 'mr' ? 'मालखाना -> न्यायवैद्यक प्रयोगशाळा (FSL कलिना)' : 'Station Malkhana -> DFSL Kalina Laboratory'}
              </option>
              <option value="KALINA_FSL_TO_MALKHANA">
                {language === 'mr' ? 'FSL कलिना -> मालखाना परत' : 'DFSL Kalina -> Returned to Malkhana'}
              </option>
              <option value="MALKHANA_TO_COURT_EXHIBIT">
                {language === 'mr' ? 'मालखाना -> न्यायालय पुरावा सादर' : 'Malkhana -> Court Exhibit Production'}
              </option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1 font-mono">
              {language === 'mr' ? 'स्वीकारणारा अधिकारी (Transferee)' : 'Receiving Custodian'}
            </label>
            <select
              value={transfereeId}
              onChange={(e) => setTransfereeId(e.target.value)}
              className="w-full px-3 py-2 rounded bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-sovereign-navy shadow-xs font-medium"
            >
              {Object.values(SEEDED_OFFICERS).map((off) => (
                <option key={off.id} value={off.id}>
                  {off.fullName} ({off.policeRank.replace(/_/g, ' ')}) — {off.policeStation}
                </option>
              ))}
            </select>
          </div>

          {movementType.includes('MALKHANA') && (
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1 font-mono">
                {language === 'mr' ? 'मालखाना कपाट / लॉकर स्थान' : 'Malkhana Shelf / Safe Locker Location'}
              </label>
              <input
                type="text"
                value={shelfLocation}
                onChange={(e) => setShelfLocation(e.target.value)}
                placeholder="e.g. Vault Alpha, Locker 04"
                className="w-full px-3 py-2 rounded bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono shadow-xs"
              />
            </div>
          )}

          {movementType.includes('FSL') && (
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1 font-mono">
                {language === 'mr' ? 'कलिना FSL पावती / संदर्भ क्र.' : 'DFSL Kalina Token / Acknowledgement Ref'}
              </label>
              <input
                type="text"
                value={dfslAckNo}
                onChange={(e) => setDfslAckNo(e.target.value)}
                placeholder="DFSL-KALINA-CYBER-2026-XXXX"
                className="w-full px-3 py-2 rounded bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono shadow-xs"
              />
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1 font-mono">
              {language === 'mr' ? 'हस्तांतरण टिपण / उद्देश' : 'Purpose Memo & Transit Note'}
            </label>
            <textarea
              rows={2}
              value={purposeMemo}
              onChange={(e) => setPurposeMemo(e.target.value)}
              className="w-full px-3 py-2 rounded bg-slate-50 border border-slate-300 text-slate-900 text-xs shadow-xs focus:bg-white focus:border-sovereign-navy"
              required
            />
          </div>

          <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900">
            <span className="font-bold block mb-1 font-mono uppercase">
              {language === 'mr' ? 'दुहेरी बायोमेट्रिक स्वाक्षरी बंधनकारक' : 'Dual Biometric Signoff Required:'}
            </span>
            {language === 'mr'
              ? 'हस्तांतरण करताना देणारा व घेणारा अधिकारी या दोघांच्या सेवायोजन बायोमेट्रिक पासकीने अखंडित साखळी ब्लॉक नोंदवला जाईल.'
              : 'Both Transferor and Transferee passkeys seal this cryptographic Merkle transfer block.'}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold shadow-xs"
            >
              {language === 'mr' ? 'रद्द करा' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSigning}
              className="flex items-center gap-1.5 px-5 py-2 rounded bg-sovereign-navy hover:bg-sovereign-navyHover text-white text-xs font-bold shadow-sm font-mono uppercase tracking-wider disabled:opacity-50"
            >
              <Fingerprint size={16} />
              <span>
                {isSigning
                  ? language === 'mr'
                    ? 'बायोमेट्रिक नोंद होत आहे...'
                    : 'Verifying Dual Passkeys...'
                  : language === 'mr'
                  ? 'स्वाक्षरी करून हस्तांतरित करा'
                  : 'Execute Dual-Signed Transfer'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
