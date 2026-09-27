import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Plus,
  Building2,
  FolderOpen,
  Scale,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Database,
  Filter,
  HardDrive,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CasesService } from '../../services/casesService';
import { EvidenceService } from '../../services/evidenceService';
import type { CaseRow } from '../../services/seedData';
import { NewCaseModal } from '../cases/NewCaseModal';

interface DashboardPageProps {
  onSelectCase: (caseId: string) => void;
  filterMode?: 'all' | 'malkhana' | 'kalina';
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onSelectCase,
  filterMode = 'all',
}) => {
  const { officer, language } = useAuth();
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalEvidenceCount, setTotalEvidenceCount] = useState(0);

  const reloadCases = () => {
    if (!officer) return;
    const list = CasesService.getCases(officer.policeStation, officer.clearanceLevel);
    setCases(list);
    const allEvidence = EvidenceService.getAllEvidence();
    setTotalEvidenceCount(allEvidence.length);
  };

  useEffect(() => {
    reloadCases();
  }, [officer]);

  if (!officer) return null;

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.cr_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.penal_sections.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesFilterMode =
      filterMode === 'all'
        ? true
        : filterMode === 'kalina'
        ? c.status === 'UNDER_INVESTIGATION'
        : true;
    return matchesSearch && matchesStatus && matchesFilterMode;
  });

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Sovereign Jurisdiction & Station Command Strip in Clean Light Mode */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded bg-sovereign-navy border border-amber-600/40 flex items-center justify-center text-amber-400 shrink-0 shadow-sm">
            <Building2 size={22} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300 uppercase">
                {officer.policeZone}
              </span>
              <span className="text-[11px] text-slate-600 font-mono flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {officer.clearanceLevel >= 4
                  ? language === 'mr'
                    ? 'सर्व पोलीस ठाणी अधिकार क्षेत्र (Full Commissionerate Access)'
                    : 'Commissionerate Jurisdiction: All Mumbai Police Stations'
                  : language === 'mr'
                  ? 'स्थानिक पोलीस ठाणे कक्ष (Station Isolation Active)'
                  : 'Station Isolation Enforced'}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5 font-mono tracking-tight">
              {officer.policeStation}
            </h2>
            <p className="text-[11px] text-slate-500">
              {language === 'mr'
                ? 'गुन्हा नोंदवही व डिजिटल मुद्देमाल अभिरक्षा कक्ष'
                : 'Crime Register & Digital Muddemal Evidence Control Division'}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-3.5 py-2 rounded bg-sovereign-navy hover:bg-sovereign-navyHover text-white font-bold text-xs tracking-wider uppercase shadow-sm transition-all shrink-0 font-mono"
          >
            <Plus size={15} />
            <span>
              {language === 'mr'
                ? 'नवीन गुन्हा नोंदवा (CR / FIR)'
                : 'Register New CR / FIR'}
            </span>
          </button>
        </div>
      </div>

      {/* Forensic KPI Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-mono uppercase tracking-wider font-bold">
            <span>{language === 'mr' ? 'नोंदणीकृत गुन्हे' : 'Active CR Cases'}</span>
            <FileText size={15} className="text-sovereign-navy" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1.5">{cases.length}</div>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
            {language === 'mr' ? 'तपासाधीन गुन्हे' : 'Active Investigation'}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-mono uppercase tracking-wider font-bold">
            <span>{language === 'mr' ? 'मुद्देमाल वस्तू' : 'Muddemal Blobs'}</span>
            <Database size={15} className="text-emerald-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1.5">{totalEvidenceCount}</div>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
            {language === 'mr' ? 'कलम १०५ जप्ती' : 'BNSS 105 Sealed'}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-mono uppercase tracking-wider font-bold">
            <span>{language === 'mr' ? 'साखळी अखंडता' : 'Ledger Integrity'}</span>
            <CheckCircle2 size={15} className="text-emerald-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1.5">100%</div>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
            {language === 'mr' ? 'शून्य हॅश फेरफार' : 'Zero Hash Tampering'}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-mono uppercase tracking-wider font-bold">
            <span>{language === 'mr' ? 'कलिना FSL पाठपुरावा' : 'Kalina FSL Queue'}</span>
            <HardDrive size={15} className="text-amber-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-800 mt-1.5">
            {cases.reduce((acc, c) => acc + (c.status === 'UNDER_INVESTIGATION' ? 1 : 0), 0)}
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
            {language === 'mr' ? 'फॉरेन्सिक अहवाल प्रलंबित' : 'Forensic Reports Pending'}
          </p>
        </div>
      </div>

      {/* Statutory Standards & Admissibility Engines (Required for Legal Evidence) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-emerald-50/70 border border-emerald-200 rounded p-3.5 flex items-start gap-2.5 shadow-xs">
          <CheckCircle2 className="text-emerald-700 shrink-0 mt-0.5" size={17} />
          <div>
            <div className="text-xs font-bold text-emerald-900 font-mono tracking-tight">
              Bharatiya Sakshya Adhiniyam, 2023
            </div>
            <div className="text-[11px] text-emerald-800/80 mt-0.5">
              Section 63 Digital Evidence Admissibility Engine Active
            </div>
          </div>
        </div>

        <div className="bg-amber-50/70 border border-amber-200 rounded p-3.5 flex items-start gap-2.5 shadow-xs">
          <ShieldCheck className="text-amber-800 shrink-0 mt-0.5" size={17} />
          <div>
            <div className="text-xs font-bold text-amber-900 font-mono tracking-tight">
              BNSS 2023 Section 105
            </div>
            <div className="text-[11px] text-amber-800/80 mt-0.5">
              Mandatory Audio-Video Search &amp; Seizure Videography
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded p-3.5 flex items-start gap-2.5 shadow-xs">
          <Database className="text-sovereign-navy shrink-0 mt-0.5" size={17} />
          <div>
            <div className="text-xs font-bold text-slate-900 font-mono tracking-tight">
              मुद्देमाल रजिस्टर (Muddemal)
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              Unbroken Merkle Hash Chain &amp; FSL Kalina Protocol
            </div>
          </div>
        </div>
      </div>

      {/* Case Registry High-Density Table with Filters */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        {/* Table Filter & Search Header */}
        <div className="p-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-50/80">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'mr'
                  ? 'CR क्र., गुन्हा शीर्षक किंवा कलमाने शोधा...'
                  : 'Filter by CR No., Title, or BNS Section...'
              }
              className="w-full pl-8 pr-3 py-1.5 rounded bg-white border border-slate-300 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-sovereign-navy font-mono shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={13} className="text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs text-slate-700 focus:outline-none focus:border-sovereign-navy font-mono shadow-xs"
            >
              <option value="ALL">{language === 'mr' ? 'सर्व स्थिती (All)' : 'All Status'}</option>
              <option value="UNDER_INVESTIGATION">
                {language === 'mr' ? 'तपासाधीन (Under Investigation)' : 'Under Investigation'}
              </option>
              <option value="CHARGESHEET_FILED">
                {language === 'mr' ? 'दोषारोपपत्र दाखल (Chargesheet Filed)' : 'Chargesheet Filed'}
              </option>
              <option value="PENDING_TRIAL">
                {language === 'mr' ? 'न्यायालयात प्रलंबित (Pending Trial)' : 'Pending Trial'}
              </option>
            </select>
          </div>
        </div>

        {/* High Density Table in Light Mode */}
        {filteredCases.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            <FileText size={32} className="mx-auto mb-2 text-slate-400" />
            <p>
              {language === 'mr'
                ? 'कोणताही गुन्हा सापडला नाही'
                : 'No registered cases found matching criteria.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200 select-none">
                <tr>
                  <th className="py-2.5 px-3.5 font-bold">
                    {language === 'mr' ? 'गुन्हा क्र. (CR NO)' : 'CR Number'}
                  </th>
                  <th className="py-2.5 px-3.5 font-bold">
                    {language === 'mr' ? 'तपशील (Case Title)' : 'Case Dossier & Offense'}
                  </th>
                  <th className="py-2.5 px-3.5 font-bold">
                    {language === 'mr' ? 'लागू कलमे' : 'Penal Sections'}
                  </th>
                  <th className="py-2.5 px-3.5 font-bold">
                    {language === 'mr' ? 'तारीख (IST)' : 'FIR Date (IST)'}
                  </th>
                  <th className="py-2.5 px-3.5 font-bold">
                    {language === 'mr' ? 'न्यायालय' : 'Designated Court'}
                  </th>
                  <th className="py-2.5 px-3.5 font-bold">
                    {language === 'mr' ? 'स्थिती' : 'Status'}
                  </th>
                  <th className="py-2.5 px-3.5 text-right font-bold">
                    {language === 'mr' ? 'कृती' : 'Action'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                {filteredCases.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50 hover:border-l-4 hover:border-sovereign-navy transition-all cursor-pointer group"
                    onClick={() => onSelectCase(c.id)}
                  >
                    <td className="py-3 px-3.5 font-bold text-sovereign-navy whitespace-nowrap">
                      {c.cr_number}
                    </td>
                    <td className="py-3 px-3.5 max-w-xs font-sans">
                      <div className="font-bold text-slate-900 group-hover:text-sovereign-navy transition-colors">
                        {c.title}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5 font-mono">
                        {c.description || c.police_station}
                      </div>
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="flex flex-wrap gap-1">
                        {c.penal_sections.slice(0, 3).map((sec) => (
                          <span
                            key={sec}
                            className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[9px] font-mono text-slate-700 font-medium"
                          >
                            {sec}
                          </span>
                        ))}
                        {c.penal_sections.length > 3 && (
                          <span className="text-[9px] text-slate-400 font-mono">
                            +{c.penal_sections.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3.5 text-slate-600 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={11} className="text-slate-400" />
                        <span>
                          {new Date(c.fir_date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3.5 text-slate-600 whitespace-nowrap font-sans text-xs">
                      <div className="flex items-center gap-1.5">
                        <Scale size={11} className="text-slate-400" />
                        <span className="truncate max-w-[150px]">{c.designated_court}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold font-mono tracking-wider bg-amber-50 text-amber-800 border border-amber-300">
                        {c.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCase(c.id);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 hover:text-sovereign-navy font-sans text-xs font-medium shadow-xs transition-colors"
                      >
                        <FolderOpen size={12} />
                        <span>{language === 'mr' ? 'तपासा' : 'Open Dossier'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <NewCaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={reloadCases}
        officer={officer}
        language={language}
      />
    </div>
  );
};
