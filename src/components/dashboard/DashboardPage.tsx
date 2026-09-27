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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CasesService } from '../../services/casesService';
import { EvidenceService } from '../../services/evidenceService';
import type { CaseRow } from '../../services/seedData';
import { NewCaseModal } from '../cases/NewCaseModal';

interface DashboardPageProps {
  onSelectCase: (caseId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onSelectCase }) => {
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
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Station & Clearance Banner */}
      <div className="bg-police-slate border border-police-border rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-police-navy rounded-lg border border-police-border text-accent-gold">
            <Building2 size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-police-elevated text-accent-cyan border border-police-border">
                {officer.policeZone}
              </span>
              <span className="text-xs text-slate-400">
                {officer.clearanceLevel >= 4
                  ? language === 'mr'
                    ? 'सर्व पोलीस ठाणी अधिकार क्षेत्र (Jurisdiction: All Stations)'
                    : 'Jurisdiction: All Mumbai Police Stations'
                  : language === 'mr'
                  ? 'स्थानिक पोलीस ठाणे कक्ष (Station Isolation Active)'
                  : 'Station Isolation Enforced'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              {officer.policeStation}
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'mr'
                ? 'गुन्हा नोंदवही व डिजिटल मुद्देमाल अभिरक्षा कक्ष'
                : 'Crime Registry & Digital Muddemal Evidence Control Division'}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent-cyan hover:bg-accent-cyan/90 text-police-navy font-bold text-xs shadow-lg shadow-accent-cyan/20 transition-all shrink-0"
        >
          <Plus size={16} />
          <span>
            {language === 'mr'
              ? 'नवीन गुन्हा नोंदवा (Register CR / FIR)'
              : 'Register New CR / FIR'}
          </span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-police-slate border border-police-border rounded-lg p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>{language === 'mr' ? 'नोंदणीकृत गुन्हे' : 'Active CR Cases'}</span>
            <FileText size={18} className="text-accent-cyan" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{cases.length}</div>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'mr'
              ? 'सध्या चालू असणारे तपासाधीन गुन्हे'
              : 'Under Active Police Investigation'}
          </p>
        </div>

        <div className="bg-police-slate border border-police-border rounded-lg p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>{language === 'mr' ? 'मुद्देमाल वस्तू' : 'Sealed Muddemal Blobs'}</span>
            <Database size={18} className="text-accent-gold" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{totalEvidenceCount}</div>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'mr'
              ? 'कलम १०५ बीएनएसएस अंतर्गत जप्त'
              : 'BNSS 105 Videography & Disks'}
          </p>
        </div>

        <div className="bg-police-slate border border-police-border rounded-lg p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>{language === 'mr' ? 'साखळी अखंडता' : 'Ledger Integrity'}</span>
            <CheckCircle2 size={18} className="text-status-pristine" />
          </div>
          <div className="text-2xl font-bold text-status-pristine mt-2">100%</div>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'mr'
              ? 'अखंडित मेर्कल हॅश साखळी'
              : 'Zero Hash Tampering Detected'}
          </p>
        </div>
      </div>

      {/* Statutory Standards & Admissibility Engines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-police-slate/80 border border-police-border rounded-lg p-3.5 flex items-center gap-3 shadow">
          <CheckCircle2 className="text-status-pristine shrink-0" size={20} />
          <div>
            <div className="text-xs font-bold text-accent-cyan">Bharatiya Sakshya Adhiniyam, 2023</div>
            <div className="text-[11px] text-slate-400">Section 63 Digital Evidence Admissibility Engine Active</div>
          </div>
        </div>
        <div className="bg-police-slate/80 border border-police-border rounded-lg p-3.5 flex items-center gap-3 shadow">
          <ShieldCheck className="text-accent-gold shrink-0" size={20} />
          <div>
            <div className="text-xs font-bold text-accent-gold">BNSS 2023 Section 105</div>
            <div className="text-[11px] text-slate-400">Mandatory Audio-Video Search &amp; Seizure Videography</div>
          </div>
        </div>
        <div className="bg-police-slate/80 border border-police-border rounded-lg p-3.5 flex items-center gap-3 shadow">
          <Database className="text-status-pristine shrink-0" size={20} />
          <div>
            <div className="text-xs font-bold text-white">मुद्देमाल रजिस्टर (Muddemal)</div>
            <div className="text-[11px] text-slate-400">Unbroken Merkle Hash Chain &amp; FSL Kalina Protocol</div>
          </div>
        </div>
      </div>

      {/* Case Registry Table with Search & Filters */}
      <div className="bg-police-slate border border-police-border rounded-xl overflow-hidden shadow-lg">
        {/* Search Header */}
        <div className="p-4 border-b border-police-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-police-elevated/40">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'mr'
                  ? 'CR क्र., गुन्हा शीर्षक किंवा कलमाने शोधा...'
                  : 'Search by CR No., Title, or BNS Section...'
              }
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-police-navy border border-police-border text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-accent-cyan"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded bg-police-navy border border-police-border text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-accent-cyan"
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

        {/* Table Content */}
        {filteredCases.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            <FileText size={36} className="mx-auto mb-2 text-slate-500 opacity-60" />
            <p>
              {language === 'mr'
                ? 'कोणताही गुन्हा सापडला नाही'
                : 'No cases found matching the criteria.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-police-elevated text-slate-300 uppercase tracking-wider font-semibold border-b border-police-border">
                <tr>
                  <th className="py-3 px-4">
                    {language === 'mr' ? 'गुन्हा रजिस्टर क्र.' : 'CR Number'}
                  </th>
                  <th className="py-3 px-4">
                    {language === 'mr' ? 'गुन्ह्याचे नाव व तपशील' : 'Case Title & Details'}
                  </th>
                  <th className="py-3 px-4">
                    {language === 'mr' ? 'लागू कलमे' : 'Penal Sections'}
                  </th>
                  <th className="py-3 px-4">
                    {language === 'mr' ? 'एफआयआर तारीख' : 'FIR Date (IST)'}
                  </th>
                  <th className="py-3 px-4">
                    {language === 'mr' ? 'न्यायालय' : 'Designated Court'}
                  </th>
                  <th className="py-3 px-4">
                    {language === 'mr' ? 'स्थिती' : 'Status'}
                  </th>
                  <th className="py-3 px-4 text-right">
                    {language === 'mr' ? 'कृती' : 'Action'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-police-border/60">
                {filteredCases.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-police-elevated/50 transition-colors cursor-pointer group"
                    onClick={() => onSelectCase(c.id)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-accent-gold whitespace-nowrap">
                      {c.cr_number}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-white group-hover:text-accent-cyan transition-colors">
                        {c.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {c.description || c.police_station}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {c.penal_sections.slice(0, 3).map((sec) => (
                          <span
                            key={sec}
                            className="px-1.5 py-0.5 rounded bg-police-navy border border-police-border text-[10px] font-mono text-slate-300"
                          >
                            {sec}
                          </span>
                        ))}
                        {c.penal_sections.length > 3 && (
                          <span className="text-[10px] text-slate-400">
                            +{c.penal_sections.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-slate-500" />
                        <span>
                          {new Date(c.fir_date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Scale size={12} className="text-slate-500" />
                        <span className="truncate max-w-[160px]">{c.designated_court}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30">
                        {c.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCase(c.id);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded bg-police-elevated hover:bg-police-border border border-police-border text-accent-cyan hover:text-white transition-colors"
                      >
                        <FolderOpen size={13} />
                        <span>{language === 'mr' ? 'तपासा' : 'Open Case'}</span>
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
