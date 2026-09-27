import React from 'react';
import {
  FolderKanban,
  Video,
  ShieldAlert,
  Building2,
  FileCheck2,
  GitCommit,
  Cpu,
  Radio,
} from 'lucide-react';

export type NavigationTab =
  | 'cases'
  | 'ingest'
  | 'malkhana'
  | 'kalina'
  | 'certificates'
  | 'audit';

interface SidebarRailProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  language: 'en' | 'mr';
}

export const SidebarRail: React.FC<SidebarRailProps> = ({
  currentTab,
  onSelectTab,
  language,
}) => {
  const navItems = [
    {
      id: 'cases' as const,
      label: language === 'mr' ? 'गुन्हा नोंदवही' : 'Case Registry',
      sub: 'CR / FIR Dossier',
      icon: FolderKanban,
      badge: '3',
    },
    {
      id: 'ingest' as const,
      label: language === 'mr' ? 'BNSS १०५ जप्ती' : 'BNSS 105 Ingest',
      sub: 'Search Videography',
      icon: Video,
      badge: 'LIVE',
    },
    {
      id: 'malkhana' as const,
      label: language === 'mr' ? 'ठाणे मालखाना' : 'Station Malkhana',
      sub: 'Vault Custody Register',
      icon: Building2,
    },
    {
      id: 'kalina' as const,
      label: language === 'mr' ? 'कलिना FSL' : 'Kalina FSL Lab',
      sub: 'Transit Ledger',
      icon: ShieldAlert,
    },
    {
      id: 'certificates' as const,
      label: language === 'mr' ? 'कलम ६३ BSA' : 'Sec 63 BSA Certs',
      sub: 'Court Admissibility',
      icon: FileCheck2,
    },
    {
      id: 'audit' as const,
      label: language === 'mr' ? 'अखंडित साखळी' : 'Merkle Audit Log',
      sub: 'Tamper Verification',
      icon: GitCommit,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 select-none shadow-xs">
      <div>
        {/* Rail Title */}
        <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="text-[10px] font-mono tracking-widest uppercase text-slate-600 font-bold flex items-center gap-1.5">
            <Radio size={12} className="text-amber-700 animate-pulse" />
            <span>{language === 'mr' ? 'फॉरेन्सिक नियंत्रण कक्ष' : 'FORENSIC RAIL'}</span>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-white border border-slate-300 text-slate-700 font-mono font-bold shadow-xs">
            v2.6.4
          </span>
        </div>

        {/* Navigation list */}
        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full text-left p-2.5 rounded transition-all flex items-center justify-between group ${
                  isActive
                    ? 'bg-slate-100 border-l-4 border-sovereign-navy text-sovereign-navy font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    size={16}
                    className={`shrink-0 transition-colors ${
                      isActive ? 'text-sovereign-navy' : 'text-slate-400 group-hover:text-sovereign-navy'
                    }`}
                  />
                  <div className="truncate">
                    <div className={`text-xs truncate leading-tight ${isActive ? 'font-bold text-slate-900' : 'font-medium'}`}>
                      {item.label}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono leading-tight mt-0.5">
                      {item.sub}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold shrink-0 ${
                      item.badge === 'LIVE'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 animate-pulse'
                        : 'bg-slate-100 text-slate-700 border border-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Hardware Security Diagnostics */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 text-[10px] space-y-1.5 font-mono">
        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-1">
            <Cpu size={11} className="text-emerald-600" />
            <span className="font-semibold">HSM LEVEL 4</span>
          </span>
          <span className="text-emerald-700 font-bold bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
            FIPS 140-3
          </span>
        </div>
        <div className="text-slate-500 truncate text-[9px]">
          Ed25519 &bull; AES-256-GCM Hardware Sealed
        </div>
        <div className="text-[9px] text-slate-500 pt-1 border-t border-slate-200 flex items-center justify-between">
          <span>GNSS SYNC LOCK</span>
          <span className="text-emerald-700 font-bold">&plusmn;0.4ms UTC</span>
        </div>
      </div>
    </aside>
  );
};
