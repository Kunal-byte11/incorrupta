import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCircle2,
  Building2,
  Clock,
  Globe,
  ChevronDown,
  LogOut,
  Radio,
  Star,
} from 'lucide-react';
import { useAuth, SEEDED_OFFICERS } from '../../context/AuthContext';

interface TopHeaderProps {
  onTitleClick: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onTitleClick }) => {
  const { officer, logout, language, toggleLanguage, login } = useAuth();
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  if (!officer) return null;

  const handleSelectOfficerPersona = async (sevarthId: string) => {
    setShowPersonaMenu(false);
    await login(sevarthId);
  };

  return (
    <header className="h-14 bg-white border-b-2 border-sovereign-navy fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 select-none shadow-sm">
      {/* Sovereign Brand Identity */}
      <div className="flex items-center gap-3 cursor-pointer group" onClick={onTitleClick}>
        {/* Maharashtra State Police 5-pointed star insignia */}
        <div className="flex items-center justify-center w-8 h-8 rounded bg-sovereign-navy border border-amber-600/40 relative shadow-sm group-hover:bg-sovereign-navyHover transition-colors">
          <ShieldCheck className="text-amber-400 text-lg" size={20} />
          <Star className="text-amber-300 absolute text-[8px] fill-amber-300" size={8} />
        </div>

        <div>
          <h1 className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-wider uppercase text-sovereign-navy font-mono">
              INCORRUPTA
            </span>
            <span className="px-1.5 py-0.2 rounded bg-amber-50 border border-amber-300 text-[9px] font-mono text-amber-800 uppercase font-bold">
              MUMBAI POLICE
            </span>
          </h1>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-deva text-amber-800 font-bold tracking-wide">
              सद्रक्षणाय खलनिग्रहणाय
            </span>
            <span className="text-[10px] text-slate-500 hidden sm:inline">&bull; Digital Evidence Vault</span>
          </div>
        </div>
      </div>

      {/* Center Law Enforcement Telemetry (Clock & GNSS Lock) */}
      <div className="hidden lg:flex items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded border border-slate-200 text-[11px] text-slate-700 shadow-sm">
          <Clock size={12} className="text-emerald-600" />
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold">NPL-IST SYNCED</span>
          <span className="text-slate-400 font-bold">&bull; GNSS LOCKED</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
          <Building2 size={12} className="text-amber-700" />
          <span className="text-slate-900 font-semibold">{officer.policeStation}</span>
          <span className="text-slate-500">({officer.policeZone})</span>
        </div>
      </div>

      {/* Right Controls: Language, Officer Profile, Logout */}
      <div className="flex items-center gap-2.5">
        {/* Language switcher */}
        <button
          type="button"
          onClick={toggleLanguage}
          aria-label="Toggle language between Marathi and English"
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 hover:text-slate-900 transition-colors shadow-sm font-medium"
        >
          <Globe size={13} className="text-amber-700" />
          <span className="font-semibold text-[11px]">{language === 'mr' ? 'English' : 'मराठी'}</span>
        </button>

        {/* Officer Profile Card with quick switcher */}
        <div className="relative">
          <div
            onClick={() => setShowPersonaMenu(!showPersonaMenu)}
            className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded hover:border-amber-500 cursor-pointer transition-colors shadow-sm"
          >
            <UserCircle2 size={18} className="text-amber-700" />
            <div className="text-left text-xs leading-tight">
              <div className="font-bold text-slate-900 flex items-center gap-1">
                <span>{language === 'mr' ? officer.fullNameMarathi : officer.fullName}</span>
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                  {officer.badgeNumber}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 truncate max-w-[120px] font-mono">
                {officer.policeRank.replace(/_/g, ' ')}
              </div>
            </div>
            <ChevronDown size={13} className="text-slate-400" />
          </div>

          {/* Quick persona dropdown */}
          {showPersonaMenu && (
            <div className="absolute right-0 mt-1.5 w-80 bg-white border border-slate-200 rounded-lg shadow-xl py-1.5 z-50">
              <div className="px-3 py-1 text-[10px] font-mono text-amber-800 font-bold uppercase tracking-wider border-b border-slate-200 flex items-center justify-between bg-amber-50/50">
                <span>Police Profile Demo Switcher</span>
                <Radio size={11} className="text-emerald-600" />
              </div>

              {Object.values(SEEDED_OFFICERS).map((p) => (
                <button
                  key={p.sevarthId}
                  onClick={() => handleSelectOfficerPersona(p.sevarthId)}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between transition-colors ${
                    officer.sevarthId === p.sevarthId
                      ? 'bg-amber-50/70 text-amber-900 font-semibold'
                      : 'text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-xs text-slate-900">
                      {p.fullName} ({p.badgeNumber})
                    </div>
                    <div className="text-[10px] text-slate-500">{p.policeStation}</div>
                  </div>
                  <span className="text-[9px] font-mono text-amber-800 px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 font-bold">
                    {p.sevarthId}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={logout}
          title="Sign out"
          aria-label="Logout"
          className="p-1.5 rounded hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};
