import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Upload,
  Video,
  ShieldCheck,
  Fingerprint,
  UserCheck,
  Camera,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CasesService } from '../../services/casesService';
import { EvidenceService } from '../../services/evidenceService';
import { computeDualHash, type DualHashResult } from '../../lib/crypto/streamHasher';
import type { CaseRow } from '../../services/seedData';

interface IngestionPageProps {
  caseId: string;
  onBack: () => void;
  onCompleted: () => void;
}

export const IngestionPage: React.FC<IngestionPageProps> = ({
  caseId,
  onBack,
  onCompleted,
}) => {
  const { officer, language } = useAuth();
  const caseData: CaseRow | null = CasesService.getCaseById(caseId);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isHashing, setIsHashing] = useState(false);
  const [hashProgress, setHashProgress] = useState(0);
  const [hashResult, setHashResult] = useState<DualHashResult | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<
    | 'SEARCH_SEIZURE_VIDEOGRAPHY_BNSS105'
    | 'MOBILE_PHONE_EXTRACTION'
    | 'CCTV_DVR_RECORDING'
    | 'HARD_DISK_FORENSIC_IMAGE'
    | 'CALL_DETAIL_RECORD_CDR'
    | 'WHATSAPP_FORENSIC_EXPORT'
    | 'FINANCIAL_LEDGER_PDF'
    | 'NETWORK_PCAP_PACKET'
    | 'OTHER'
  >('SEARCH_SEIZURE_VIDEOGRAPHY_BNSS105');
  const [panchnamaRef, setPanchnamaRef] = useState(`PAN-MUM-${new Date().getFullYear()}-0${Math.floor(Math.random() * 900 + 100)}`);
  const [sceneAddress, setSceneAddress] = useState(
    officer?.policeStation.includes('Cyber')
      ? 'Plot C-54, G Block, Bandra Kurla Complex, Mumbai 400051'
      : 'Fort Area, Near Horniman Circle, Mumbai 400001'
  );

  // Panch 1
  const [panch1Name, setPanch1Name] = useState('Ganesh Vinayak Jadhav');
  const [panch1Address, setPanch1Address] = useState('Matunga East, Mumbai');
  const [panch1Phone, setPanch1Phone] = useState('+91 98201 55678');

  // Panch 2
  const [panch2Name, setPanch2Name] = useState('Suresh Shreedhar Kadam');
  const [panch2Address, setPanch2Address] = useState('Dadar West, Mumbai');
  const [panch2Phone, setPanch2Phone] = useState('+91 98202 88990');

  // Device Info
  const [deviceMake, setDeviceMake] = useState('Sony FX3 Law Enforcement Kit');
  const [deviceSerial, setDeviceSerial] = useState('SN-MUM-LE-9082');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!officer || !caseData) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Case not found.</p>
        <button onClick={onBack} className="mt-2 text-accent-cyan text-xs underline">Back</button>
      </div>
    );
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    // Trigger dual hashing stream
    setIsHashing(true);
    setHashProgress(0);
    setError(null);

    try {
      const hashes = await computeDualHash(file, (p) => {
        setHashProgress(p.percentage);
      });
      setHashResult(hashes);
    } catch (err: unknown) {
      setError('Streaming hashing failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsHashing(false);
    }
  };

  const handleSimulateSampleVideo = async () => {
    // Generate simulated 4K continuous seizure recording blob
    const sampleText = `MUMBAI POLICE SECTION 105 BNSS 2023 SEARCH & SEIZURE RECORDING
CR NO: ${caseData.cr_number}
STATION: ${caseData.police_station}
IO: ${officer.fullName} (${officer.sevarthId})
TIMESTAMP: ${new Date().toISOString()}
PANCH WITNESSES: 2 INDEPENDENT CITIZENS PRESENT
TAMPER-PROOF RECORDING ACTIVE`;

    const sampleBlob = new Blob([sampleText], { type: 'video/mp4' });
    const sampleFile = new File([sampleBlob], 'BNSS_105_Scene_Search_Continuous_Recording.mp4', {
      type: 'video/mp4',
    });

    setSelectedFile(sampleFile);
    setTitle('BNSS 105 Continuous Scene Search & Seizure Recording');
    setCategory('SEARCH_SEIZURE_VIDEOGRAPHY_BNSS105');

    setIsHashing(true);
    setHashProgress(0);
    const hashes = await computeDualHash(sampleFile, (p) => setHashProgress(p.percentage));
    setHashResult(hashes);
    setIsHashing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !hashResult) {
      setError(language === 'mr' ? 'कृपया पुरावा फाईल निवडा व हॅश गणना पूर्ण होऊ द्या' : 'Please select a file and await cryptographic hashing');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Simulate biometric WebAuthn sealing
      await new Promise((resolve) => setTimeout(resolve, 800));

      EvidenceService.ingestEvidence({
        caseId: caseData.id,
        title: title.trim(),
        category,
        panchnamaReference: panchnamaRef.trim(),
        panchWitnesses: [
          { name: panch1Name.trim(), address: panch1Address.trim(), phone: panch1Phone.trim() },
          { name: panch2Name.trim(), address: panch2Address.trim(), phone: panch2Phone.trim() },
        ],
        seizureLocation: {
          address: sceneAddress.trim(),
          latitude: 18.9220,
          longitude: 72.8347,
        },
        seizureTimestamp: new Date().toISOString(),
        sourceDeviceInfo: {
          make: deviceMake.trim(),
          serial_no: deviceSerial.trim(),
        },
        seizingIoId: officer.id,
        fileSizeBytes: selectedFile.size,
        mimeType: selectedFile.type || 'application/octet-stream',
        storagePath: `cases/${caseData.cr_number.replace(/[^a-zA-Z0-9]/g, '_')}/${selectedFile.name}`,
        sha256Hash: hashResult.sha256,
        blake3Hash: hashResult.blake3,
      });

      setIsSubmitting(false);
      onCompleted();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ingestion failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-accent-cyan transition-colors"
        >
          <ArrowLeft size={16} />
          <span>{language === 'mr' ? 'गुन्ह्याकडे परत' : 'Back to Case'}</span>
        </button>

        <div className="text-right">
          <span className="text-[11px] font-mono text-accent-gold font-bold">
            {caseData.cr_number}
          </span>
          <span className="text-[11px] text-slate-400 block">{caseData.police_station}</span>
        </div>
      </div>

      {/* Main Seizure Card */}
      <div className="bg-police-slate border border-police-border rounded-xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-cyan via-accent-gold to-accent-cyan" />

        <div className="flex items-center gap-3 mb-6 border-b border-police-border pb-4">
          <div className="p-3 bg-police-navy rounded-xl border border-police-border text-accent-gold">
            <Video size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-police-elevated text-accent-gold border border-accent-gold/30 font-semibold font-mono">
                BNSS SECTION 105
              </span>
              <span className="text-xs text-slate-400">
                {language === 'mr'
                  ? 'सक्तीचे ऑडिओ-व्हिडिओ पंचनामा जप्ती स्टुडिओ'
                  : 'Mandatory Audio-Video Search & Seizure Recording'}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white mt-1">
              {language === 'mr'
                ? 'डिजिटल मुद्देमाल नोंदणी व पंचनामा'
                : 'Digital Evidence Ingestion & Biometric Sealing'}
            </h1>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-status-tamper/15 border border-status-tamper/40 text-status-tamper text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Dropzone */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
              {language === 'mr' ? 'जप्त केलेली डिजिटल फाईल / व्हिडिओ' : 'Seized Digital File / BNSS 105 Videography'}
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-police-border hover:border-accent-cyan/60 rounded-xl p-6 text-center cursor-pointer bg-police-navy/50 transition-colors"
            >
              <Upload size={36} className="mx-auto mb-2 text-accent-cyan" />
              <p className="text-xs font-semibold text-white">
                {selectedFile ? selectedFile.name : 'Click to select or drag video / forensic image'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Supports MP4, MOV, DD, RAW, E01, PCAP, PDF (Chunked streaming up to 50 GB)
              </p>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSimulateSampleVideo();
                }}
                className="mt-3 text-[11px] px-3 py-1 rounded bg-police-elevated hover:bg-police-border border border-police-border text-accent-gold font-medium inline-flex items-center gap-1"
              >
                <Camera size={12} />
                <span>[Auto-Load Sample BNSS 105 Seizure Video]</span>
              </button>
            </div>
          </div>

          {/* Live Hashing Meter */}
          {(isHashing || hashResult) && (
            <div className="bg-police-navy p-4 rounded-xl border border-police-border space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-status-pristine" />
                  Dual-Hashing Stream (SHA-256 + Blake3)
                </span>
                <span className="font-mono text-status-pristine font-bold">
                  {isHashing ? `${hashProgress}%` : '100% VERIFIED'}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-police-elevated overflow-hidden">
                <div
                  className="h-full bg-status-pristine transition-all duration-200"
                  style={{ width: `${hashProgress}%` }}
                />
              </div>

              {hashResult && (
                <div className="space-y-1.5 pt-1 text-[11px] font-mono">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-slate-400">SHA-256 Digest:</span>
                    <span className="text-status-pristine truncate max-w-md">{hashResult.sha256}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-slate-400">Blake3 Digest:</span>
                    <span className="text-status-pristine truncate max-w-md">{hashResult.blake3}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Form Meta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 uppercase mb-1">
                {language === 'mr' ? 'मुद्देमाल नाव' : 'Muddemal Exhibit Title'}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. CCTV Recording of East Entrance"
                required
                className="w-full px-3 py-2 rounded bg-police-navy border border-police-border text-white text-xs focus:ring-1 focus:ring-accent-cyan"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 uppercase mb-1">
                {language === 'mr' ? 'मुद्देमाल वर्गवारी (Category)' : 'Evidence Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as typeof category)}
                className="w-full px-3 py-2 rounded bg-police-navy border border-police-border text-white text-xs focus:ring-1 focus:ring-accent-cyan"
              >
                <option value="SEARCH_SEIZURE_VIDEOGRAPHY_BNSS105">
                  BNSS 105 Continuous Scene Videography
                </option>
                <option value="MOBILE_PHONE_EXTRACTION">Mobile Phone Forensic Extraction</option>
                <option value="CCTV_DVR_RECORDING">CCTV / DVR Recording</option>
                <option value="HARD_DISK_FORENSIC_IMAGE">Hard Disk Forensic Image (.dd/raw)</option>
                <option value="NETWORK_PCAP_PACKET">Network Packet Capture (.pcap)</option>
                <option value="FINANCIAL_LEDGER_PDF">Financial / Banking Ledger PDF</option>
                <option value="WHATSAPP_FORENSIC_EXPORT">WhatsApp Forensic Export</option>
                <option value="OTHER">Other Digital Material</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 uppercase mb-1">
                {language === 'mr' ? 'जप्ती पंचनामा संदर्भ क्र.' : 'Japti Panchnama Reference No.'}
              </label>
              <input
                type="text"
                value={panchnamaRef}
                onChange={(e) => setPanchnamaRef(e.target.value)}
                required
                className="w-full px-3 py-2 rounded bg-police-navy border border-police-border text-white text-xs font-mono focus:ring-1 focus:ring-accent-cyan"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 uppercase mb-1">
                {language === 'mr' ? 'घटनास्थळ पत्ता / लोकेशन' : 'Scene Seizure Location / Address'}
              </label>
              <input
                type="text"
                value={sceneAddress}
                onChange={(e) => setSceneAddress(e.target.value)}
                required
                className="w-full px-3 py-2 rounded bg-police-navy border border-police-border text-white text-xs focus:ring-1 focus:ring-accent-cyan"
              />
            </div>
          </div>

          {/* 2 Independent Panch Witnesses */}
          <div className="bg-police-navy/60 p-4 rounded-xl border border-police-border space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-accent-gold">
              <UserCheck size={16} />
              <span>
                {language === 'mr'
                  ? '२ स्वतंत्र पंच साक्षीदार (Mandatory 2 Independent Panch Witnesses)'
                  : 'Mandatory 2 Independent Panch Witnesses (BNSS Section 105)'}
              </span>
            </div>

            {/* Panch 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <input
                type="text"
                placeholder="Panch 1 Full Name"
                value={panch1Name}
                onChange={(e) => setPanch1Name(e.target.value)}
                required
                className="px-2.5 py-1.5 rounded bg-police-slate border border-police-border text-white text-xs"
              />
              <input
                type="text"
                placeholder="Residential Address"
                value={panch1Address}
                onChange={(e) => setPanch1Address(e.target.value)}
                required
                className="px-2.5 py-1.5 rounded bg-police-slate border border-police-border text-white text-xs"
              />
              <input
                type="text"
                placeholder="Mobile Number"
                value={panch1Phone}
                onChange={(e) => setPanch1Phone(e.target.value)}
                required
                className="px-2.5 py-1.5 rounded bg-police-slate border border-police-border text-white text-xs font-mono"
              />
            </div>

            {/* Panch 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <input
                type="text"
                placeholder="Panch 2 Full Name"
                value={panch2Name}
                onChange={(e) => setPanch2Name(e.target.value)}
                required
                className="px-2.5 py-1.5 rounded bg-police-slate border border-police-border text-white text-xs"
              />
              <input
                type="text"
                placeholder="Residential Address"
                value={panch2Address}
                onChange={(e) => setPanch2Address(e.target.value)}
                required
                className="px-2.5 py-1.5 rounded bg-police-slate border border-police-border text-white text-xs"
              />
              <input
                type="text"
                placeholder="Mobile Number"
                value={panch2Phone}
                onChange={(e) => setPanch2Phone(e.target.value)}
                required
                className="px-2.5 py-1.5 rounded bg-police-slate border border-police-border text-white text-xs font-mono"
              />
            </div>
          </div>

          {/* Capturing Device Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 uppercase mb-1">
                {language === 'mr' ? 'चित्रीकरण उपकरण / कॅमेरा मॉडेल' : 'Capturing Device Make & Model'}
              </label>
              <input
                type="text"
                value={deviceMake}
                onChange={(e) => setDeviceMake(e.target.value)}
                required
                className="w-full px-3 py-2 rounded bg-police-navy border border-police-border text-white text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 uppercase mb-1">
                {language === 'mr' ? 'उपकरण अनुक्रमांक (Device Serial No.)' : 'Device Serial Number'}
              </label>
              <input
                type="text"
                value={deviceSerial}
                onChange={(e) => setDeviceSerial(e.target.value)}
                required
                className="w-full px-3 py-2 rounded bg-police-navy border border-police-border text-white text-xs font-mono"
              />
            </div>
          </div>

          {/* Submission and Biometric Seal Button */}
          <div className="flex items-center justify-between pt-4 border-t border-police-border">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 rounded bg-police-elevated hover:bg-police-border text-slate-300 text-xs font-medium"
            >
              {language === 'mr' ? 'रद्द करा' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isHashing || !selectedFile}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-accent-cyan hover:bg-accent-cyan/90 text-police-navy text-xs font-bold shadow-lg shadow-accent-cyan/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Fingerprint size={18} />
              <span>
                {isSubmitting
                  ? language === 'mr'
                    ? 'बायोमेट्रिक मुद्रांकन सुरू आहे...'
                    : 'Biometric Passkey Sealing...'
                  : language === 'mr'
                  ? 'बायोमेट्रिक स्वाक्षरीने जप्त करा (BNSS 105 Seal)'
                  : 'Biometric Seal & Register Muddemal'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
