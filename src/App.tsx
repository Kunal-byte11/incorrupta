import React from 'react';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  return (
    <main className="min-h-screen bg-police-navy text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Mumbai Police Header */}
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
                मुंबई पोलीस • MUMBAI POLICE
              </h1>
              <p className="text-sm text-slate-400">
                INCORRUPTA — Secure Digital Evidence &amp; Muddemal Custody Management System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-police-slate px-3 py-1.5 rounded-md border border-police-border text-xs">
              <span className="h-2 w-2 rounded-full bg-status-pristine animate-pulse" />
              <span className="text-slate-300 font-mono">NPL-IST (UTC+05:30) SYNCED</span>
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

export default App;
