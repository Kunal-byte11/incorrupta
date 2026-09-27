import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { ShieldCheck, Lock, CheckCircle2, LogOut, UserCircle2, Building2, Clock, Globe } from 'lucide-react';

const MainPortal: React.FC = () => {
  const { officer, isAuthenticated, logout, language, toggleLanguage } = useAuth();

  if (!isAuthenticated || !officer) {
    return <LoginPage />;
  }

  return (
    <main className="min-h-screen bg-police-navy text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Mumbai Police Header with Officer Status */}
        <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-police-border gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-police-slate rounded-lg border border-police-border shadow-md">
              <ShieldCheck className="text-accent-cyan" size={36} aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-police-elevated text-accent-gold border border-accent-gold/30">
                  सद्रक्षणाय खलनिग्रहणाय
                </span>
                <span className="text-xs text-slate-400">Maharashtra State Police</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
                {language === 'mr' ? 'मुंबई पोलीस • आयुक्त कार्यालय' : 'मुंबई पोलीस • MUMBAI POLICE'}
              </h1>
              <p className="text-sm text-slate-400">
                INCORRUPTA — Secure Digital Evidence &amp; Muddemal Custody Management System
              </p>
            </div>
          </div>

          {/* Right utilities and Officer Profile badge */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-police-slate px-3 py-1.5 rounded-md border border-police-border text-xs">
              <Clock size={13} className="text-status-pristine" />
              <span className="h-2 w-2 rounded-full bg-status-pristine animate-pulse" />
              <span className="text-slate-300 font-mono">NPL-IST SYNCED</span>
            </div>

            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-police-elevated hover:bg-police-border border border-police-border rounded text-xs font-medium text-slate-200 transition-colors"
            >
              <Globe size={13} className="text-accent-cyan" />
              <span>{language === 'mr' ? 'English' : 'मराठी'}</span>
            </button>

            {/* Officer profile card */}
            <div className="flex items-center gap-3 bg-police-slate border border-police-border px-3.5 py-1.5 rounded-lg shadow">
              <UserCircle2 size={24} className="text-accent-gold" />
              <div className="text-left">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{language === 'mr' ? officer.fullNameMarathi : officer.fullName}</span>
                  <span className="text-[10px] px-1 py-0.2 rounded bg-police-elevated text-accent-gold font-mono">
                    {officer.badgeNumber}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Building2 size={11} className="text-slate-500" />
                  <span>{officer.policeStation}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                title="Logout"
                aria-label="Logout"
                className="ml-2 p-1.5 hover:bg-police-elevated text-slate-400 hover:text-status-tamper rounded transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Operational Status & Verification Card */}
        <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-police-slate border border-police-border rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Statutory Standard</span>
              <CheckCircle2 className="text-status-pristine" size={20} />
            </div>
            <h2 className="text-lg font-bold text-accent-cyan mt-2">
              Bharatiya Sakshya Adhiniyam, 2023
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Section 63 Digital Evidence Admissibility Engine Active
            </p>
            <div className="mt-4 pt-3 border-t border-police-border/50 text-xs text-slate-500 font-mono">
              FORM A &amp; B STATUTORY COMPLIANT
            </div>
          </div>

          <div className="bg-police-slate border border-police-border rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Search Procedure</span>
              <Lock className="text-accent-gold" size={20} />
            </div>
            <h2 className="text-lg font-bold text-accent-gold mt-2">
              BNSS 2023 Section 105
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Mandatory Audio-Video Search &amp; Seizure Videography Protocol
            </p>
            <div className="mt-4 pt-3 border-t border-police-border/50 text-xs text-slate-500 font-mono">
              TAMPER-SEALED AT INGESTION
            </div>
          </div>

          <div className="bg-police-slate border border-police-border rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Malkhana Ledger</span>
              <span className="text-xs px-2 py-0.5 rounded bg-status-pristine/20 text-status-pristine font-mono">INTACT</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-2">
              मुद्देमाल रजिस्टर (Muddemal)
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Unbroken Merkle Hash Chain &amp; FSL Kalina Transit Protocol
            </p>
            <div className="mt-4 pt-3 border-t border-police-border/50 text-xs text-status-pristine font-mono">
              100% CRYPTOGRAPHIC CONTINUITY
            </div>
          </div>
        </section>
      </div>
    </main>
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
