import React, { useState } from 'react';
import { AuthProvider, useAuth, SEEDED_OFFICERS } from './context/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { CaseDetailPage } from './components/cases/CaseDetailPage';
import { IngestionPage } from './components/ingestion/IngestionPage';
import {
  ShieldCheck,
  LogOut,
  UserCircle2,
  Building2,
  Clock,
  Globe,
  ChevronDown,
} from 'lucide-react';

type ActiveView =
  | { type: 'dashboard' }
  | { type: 'case-detail'; caseId: string }
  | { type: 'ingestion'; caseId: string };

const MainPortal: React.FC = () => {
  const { officer, isAuthenticated, logout, language, toggleLanguage, login } = useAuth();
  const [view, setView] = useState<ActiveView>({ type: 'dashboard' });
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  if (!isAuthenticated || !officer) {
    return <LoginPage />;
  }

  const handleSelectOfficerPersona = async (sevarthId: string) => {
    setShowPersonaMenu(false);
    await login(sevarthId);
    setView({ type: 'dashboard' });
  };

  return (
    <div className="min-h-screen bg-police-navy text-slate-100 font-sans selection:bg-accent-cyan selection:text-police-navy flex flex-col justify-between">
      {/* Top Mumbai Police Bar */}
      <header className="border-b border-police-border bg-police-navy/95 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Insignia & Heading */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setView({ type: 'dashboard' })}
          >
            <div className="p-2 bg-police-slate rounded-lg border border-police-border shadow group-hover:border-accent-cyan transition-colors">
              <ShieldCheck className="text-accent-cyan" size={28} aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-police-elevated text-accent-gold border border-accent-gold/30">
                  सद्रक्षणाय खलनिग्रहणाय
                </span>
                <span className="text-[11px] text-slate-400">Maharashtra State Police</span>
              </div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <span>
                  {language === 'mr'
                    ? 'मुंबई पोलीस • डिजिटल पुरावे व मुद्देमाल अभिरक्षा'
                    : 'MUMBAI POLICE • INCORRUPTA'}
                </span>
              </h1>
            </div>
          </div>

          {/* Utilities & Officer Badge */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* NPL-IST time badge */}
            <div className="flex items-center gap-1.5 bg-police-slate px-2.5 py-1 rounded-md border border-police-border text-xs">
              <Clock size={12} className="text-status-pristine" />
              <span className="h-1.5 w-1.5 rounded-full bg-status-pristine animate-pulse" />
              <span className="text-slate-300 font-mono text-[11px]">NPL-IST SYNCED</span>
            </div>

            {/* Language toggle */}
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label="Toggle language"
              className="flex items-center gap-1 px-2.5 py-1 bg-police-elevated hover:bg-police-border border border-police-border rounded text-xs font-medium text-slate-200 transition-colors"
            >
              <Globe size={13} className="text-accent-cyan" />
              <span>{language === 'mr' ? 'English' : 'मराठी'}</span>
            </button>

            {/* Officer Profile Card with Quick Persona Switcher */}
            <div className="relative">
              <div
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className="flex items-center gap-2.5 bg-police-slate border border-police-border px-3 py-1 rounded-lg shadow cursor-pointer hover:border-accent-gold/50 transition-colors"
              >
                <UserCircle2 size={20} className="text-accent-gold" />
                <div className="text-left text-xs">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span>{language === 'mr' ? officer.fullNameMarathi : officer.fullName}</span>
                    <span className="text-[10px] px-1 py-0.2 rounded bg-police-elevated text-accent-gold font-mono">
                      {officer.badgeNumber}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Building2 size={10} className="text-slate-500" />
                    <span className="truncate max-w-[130px]">{officer.policeStation}</span>
                  </div>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </div>

              {/* Persona switch dropdown */}
              {showPersonaMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-police-slate border border-police-border rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-3 py-1 text-[11px] text-slate-400 font-semibold uppercase border-b border-police-border/50">
                    Switch Police Officer (Demo)
                  </div>
                  {Object.values(SEEDED_OFFICERS).map((p) => (
                    <button
                      key={p.sevarthId}
                      onClick={() => handleSelectOfficerPersona(p.sevarthId)}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-police-elevated flex items-center justify-between ${
                        officer.sevarthId === p.sevarthId ? 'bg-police-elevated/70 text-accent-cyan' : 'text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{p.fullName} ({p.badgeNumber})</div>
                        <div className="text-[10px] text-slate-400">{p.policeStation}</div>
                      </div>
                      <span className="text-[9px] font-mono text-accent-gold">{p.sevarthId}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Logout button */}
            <button
              type="button"
              onClick={logout}
              title="Logout"
              aria-label="Logout"
              className="p-1.5 hover:bg-police-elevated text-slate-400 hover:text-status-tamper rounded transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
        {view.type === 'dashboard' && (
          <DashboardPage
            onSelectCase={(caseId) => setView({ type: 'case-detail', caseId })}
          />
        )}

        {view.type === 'case-detail' && (
          <CaseDetailPage
            caseId={view.caseId}
            onBack={() => setView({ type: 'dashboard' })}
            onNavigateToIngestion={(caseId) => setView({ type: 'ingestion', caseId })}
          />
        )}

        {view.type === 'ingestion' && (
          <IngestionPage
            caseId={view.caseId}
            onBack={() => setView({ type: 'case-detail', caseId: view.caseId })}
            onCompleted={() => setView({ type: 'case-detail', caseId: view.caseId })}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-police-border bg-police-navy/80 py-3 text-center text-xs text-slate-500">
        <p>
          {language === 'mr'
            ? 'महाराष्ट्र शासन • मुंबई पोलीस आयुक्त कार्यालय • कलम ६३ भारतीय साक्ष्य अधिनियम (BSA) आणि कलम १०५ बीएनएसएस'
            : 'Government of Maharashtra • Mumbai Police Commissionerate • Section 63 BSA 2023 & Section 105 BNSS 2023 Standard'}
        </p>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainPortal />
    </AuthProvider>
  );
};

export default App;
