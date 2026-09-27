import React, { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
import { CasesService } from '../../services/casesService';
import type { OfficerProfile } from '../../context/AuthContext';

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  officer: OfficerProfile;
  language: 'en' | 'mr';
}

const COMMON_PENAL_SECTIONS = [
  'BNS 316(2) (Criminal Breach of Trust)',
  'BNS 318(4) (Cheating & Fraud)',
  'BNS 303(2) (Theft)',
  'BNS 331(4) (House Trespass / Burglary)',
  'BNS 61(2) (Criminal Conspiracy)',
  'IT Act 66C (Identity Theft)',
  'IT Act 66D (Cheating by Impersonation)',
  'IT Act 43 (Damage to Computer System)',
];

export const NewCaseModal: React.FC<NewCaseModalProps> = ({
  isOpen,
  onClose,
  onCreated,
  officer,
  language,
}) => {
  const [crNumber, setCrNumber] = useState('');
  const [title, setTitle] = useState('');
  const [firDate, setFirDate] = useState(() => new Date().toISOString().slice(0, 16));
  const [designatedCourt, setDesignatedCourt] = useState(
    officer.policeStation.includes('Cyber')
      ? 'City Civil & Sessions Court, Fort, Mumbai'
      : 'Esplanade Court (Killa Court), Mumbai'
  );
  const [selectedSections, setSelectedSections] = useState<string[]>([
    'BNS 316(2)',
    'BNS 318(4)',
    'IT Act 66D',
  ]);
  const [customSection, setCustomSection] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggleSection = (section: string) => {
    const codeOnly = section.split(' (')[0];
    if (selectedSections.includes(codeOnly)) {
      setSelectedSections(selectedSections.filter((s) => s !== codeOnly));
    } else {
      setSelectedSections([...selectedSections, codeOnly]);
    }
  };

  const handleAddCustomSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSection.trim() && !selectedSections.includes(customSection.trim())) {
      setSelectedSections([...selectedSections, customSection.trim()]);
      setCustomSection('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!crNumber.trim()) {
      setError(language === 'mr' ? 'कृपया गुन्हा रजिस्टर (CR) क्रमांक प्रविष्ट करा' : 'Please enter CR Number');
      return;
    }
    if (!title.trim()) {
      setError(language === 'mr' ? 'कृपया गुन्ह्याचे शीर्षक प्रविष्ट करा' : 'Please enter Case Title');
      return;
    }
    if (selectedSections.length === 0) {
      setError(language === 'mr' ? 'किमान एक कलम निवडणे आवश्यक आहे' : 'Please select at least one penal section');
      return;
    }

    try {
      CasesService.createCase({
        cr_number: crNumber.trim(),
        police_station: officer.policeStation,
        fir_date: new Date(firDate).toISOString(),
        title: title.trim(),
        penal_sections: selectedSections,
        investigating_officer_id: officer.id,
        designated_court: designatedCourt,
        description: description.trim() || null,
      });

      onCreated();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to register case');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-3">
          <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300 font-bold font-mono">
            {language === 'mr' ? 'नवीन गुन्हा नोंदणी' : 'FIR REGISTRATION'}
          </span>
          <h2 className="text-lg font-bold text-slate-900 font-mono">
            {language === 'mr' ? 'गुन्हा रजिस्टर (CR) नवीन नोंदणी' : 'Register New Crime Register (CR) Case'}
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-mono">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 font-mono">
                {language === 'mr' ? 'गुन्हा रजिस्टर क्र. (CR No.)' : 'Crime Register (CR) No.'}
              </label>
              <input
                type="text"
                value={crNumber}
                onChange={(e) => setCrNumber(e.target.value)}
                placeholder="CR No. 150/2026"
                required
                className="w-full px-3 py-2 rounded bg-slate-50 border border-slate-300 text-slate-900 text-sm font-mono focus:outline-none focus:bg-white focus:border-sovereign-navy shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 font-mono">
                {language === 'mr' ? 'पोलीस ठाणे (Police Station)' : 'Police Station'}
              </label>
              <input
                type="text"
                disabled
                value={officer.policeStation}
                className="w-full px-3 py-2 rounded bg-slate-100 border border-slate-200 text-slate-500 text-sm cursor-not-allowed font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1 font-mono">
              {language === 'mr' ? 'गुन्ह्याचे शीर्षक / विषय' : 'Case Title / Primary Allegation'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Unauthorized Financial Data Breach & Extortion"
              required
              className="w-full px-3 py-2 rounded bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:bg-white focus:border-sovereign-navy shadow-xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 font-mono">
                {language === 'mr' ? 'एफआयआर तारीख व वेळ (FIR Date & Time)' : 'FIR Date & Time (IST)'}
              </label>
              <input
                type="datetime-local"
                value={firDate}
                onChange={(e) => setFirDate(e.target.value)}
                required
                className="w-full px-3 py-2 rounded bg-slate-50 border border-slate-300 text-slate-900 text-sm font-mono focus:outline-none focus:bg-white focus:border-sovereign-navy shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 font-mono">
                {language === 'mr' ? 'नेमलेले न्यायालय (Designated Court)' : 'Designated Court'}
              </label>
              <select
                value={designatedCourt}
                onChange={(e) => setDesignatedCourt(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:bg-white focus:border-sovereign-navy shadow-xs"
              >
                <option value="City Civil & Sessions Court, Fort, Mumbai">
                  City Civil &amp; Sessions Court, Fort, Mumbai
                </option>
                <option value="Esplanade Court (Killa Court), Mumbai">
                  Esplanade Court (Killa Court), Mumbai
                </option>
                <option value="Metropolitan Magistrate Court, Bandra, Mumbai">
                  Metropolitan Magistrate Court, Bandra, Mumbai
                </option>
                <option value="Metropolitan Magistrate Court, Mazgaon, Mumbai">
                  Metropolitan Magistrate Court, Mazgaon, Mumbai
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 font-mono">
              {language === 'mr' ? 'लागू असणारी कलमे (Penal Sections BNS / IT Act)' : 'Penal Sections (BNS 2023 & IT Act)'}
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {COMMON_PENAL_SECTIONS.map((sec) => {
                const codeOnly = sec.split(' (')[0];
                const isSelected = selectedSections.includes(codeOnly);
                return (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => handleToggleSection(sec)}
                    className={`text-xs px-2.5 py-1 rounded transition-colors font-mono font-medium ${
                      isSelected
                        ? 'bg-sovereign-navy text-white font-bold shadow-xs'
                        : 'bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {sec}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={customSection}
                onChange={(e) => setCustomSection(e.target.value)}
                placeholder="Add other section (e.g. BNS 111)"
                className="flex-1 px-3 py-1.5 rounded bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono shadow-xs"
              />
              <button
                type="button"
                onClick={handleAddCustomSection}
                className="px-3 py-1.5 rounded bg-white hover:bg-slate-100 border border-slate-300 text-xs text-slate-700 font-bold flex items-center gap-1 shadow-xs"
              >
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1 font-mono">
              {language === 'mr' ? 'गुन्ह्याचे संक्षिप्त वर्णन (Description)' : 'Investigation Summary / Memo'}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief details of complainant, scene, or suspect IP..."
              className="w-full px-3 py-2 rounded bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-sovereign-navy shadow-xs"
            />
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
              className="px-5 py-2 rounded bg-sovereign-navy hover:bg-sovereign-navyHover text-white text-xs font-bold shadow-sm font-mono uppercase tracking-wider"
            >
              {language === 'mr' ? 'गुन्हा नोंदवा (Register CR)' : 'Register CR Case'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
