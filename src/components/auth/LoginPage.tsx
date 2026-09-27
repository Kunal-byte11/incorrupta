import React, { useState } from 'react';
import { ShieldCheck, Fingerprint, Globe, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth, SEEDED_OFFICERS } from '../../context/AuthContext';
import { formatForensicsError } from '../../types/errors';

export const LoginPage: React.FC = () => {
  const { login, isLoading, error, language, toggleLanguage, clearError } = useAuth();
  const [sevarthId, setSevarthId] = useState('MH-POL-40211');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await login(sevarthId);
  };

  const handleSelectOfficer = (id: string) => {
    setSevarthId(id);
    clearError();
  };

  return (
    <div className="min-h-screen bg-police-navy text-slate-100 flex flex-col justify-between p-4 md:p-8 font-sans selection:bg-accent-cyan selection:text-police-navy">
      {/* Top utility bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-2 border-b border-police-border/40">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-police-elevated text-accent-gold border border-accent-gold/30">
            सद्रक्षणाय खलनिग्रहणाय
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">Maharashtra State Police</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-police-slate px-3 py-1 rounded-md border border-police-border text-xs">
            <Clock size={14} className="text-status-pristine" />
            <span className="h-1.5 w-1.5 rounded-full bg-status-pristine animate-pulse" />
            <span className="text-slate-300 font-mono">NPL-IST SYNCED</span>
          </div>

          <button
            type="button"
            onClick={toggleLanguage}
            aria-label="Toggle language between English and Marathi"
            className="flex items-center gap-1.5 px-3 py-1 bg-police-elevated hover:bg-police-border border border-police-border rounded text-xs font-medium text-slate-200 transition-colors"
          >
            <Globe size={14} className="text-accent-cyan" />
            <span>{language === 'en' ? 'मराठी' : 'English'}</span>
          </button>
        </div>
      </header>

      {/* Center login card */}
      <main className="max-w-md w-full mx-auto my-auto py-8">
        <div className="bg-police-slate border border-police-border rounded-xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-cyan via-accent-gold to-accent-cyan" />

          {/* Insignia & Crest */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="p-3.5 bg-police-elevated rounded-2xl border border-police-border shadow-inner mb-3">
              <ShieldCheck size={44} className="text-accent-cyan" aria-hidden="true" />
            </div>

            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              {language === 'mr' ? 'मुंबई पोलीस' : 'मुंबई पोलीस • MUMBAI POLICE'}
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              {language === 'mr'
                ? 'डिजिटल पुरावे व मुद्देमाल अभिरक्षा व्यवस्थापन प्रणाली'
                : 'Digital Evidence & Muddemal Custody Management System (INCORRUPTA)'}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-status-tamper/15 border border-status-tamper/40 text-status-tamper text-xs flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{formatForensicsError(error, language)}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="sevarthId" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                {language === 'mr' ? 'सेवायोजन कर्मचारी आयडी (Sevarth ID)' : 'Sevarth Employee ID / सेवायोजन आयडी'}
              </label>
              <input
                id="sevarthId"
                type="text"
                value={sevarthId}
                onChange={(e) => setSevarthId(e.target.value)}
                placeholder="MH-POL-40211"
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-police-navy border border-police-border text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent-cyan transition-all"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                {language === 'mr'
                  ? 'उदा. MH-POL-40211 (गुन्हे शाखा किंवा सायबर पो. ठाणे)'
                  : 'Format: MH-POL-XXXXX (Maharashtra Police Service ID)'}
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg bg-accent-cyan hover:bg-accent-cyan/90 text-police-navy font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-accent-cyan/20 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Fingerprint size={20} />
              <span>
                {isLoading
                  ? language === 'mr' ? 'पडताळणी सुरू आहे...' : 'Verifying Biometrics...'
                  : language === 'mr' ? 'बायोमेट्रिक पडताळणी / Verify Passkey' : 'Verify Biometric Passkey / बायोमेट्रिक पडताळणी'}
              </span>
            </button>
          </form>

          {/* Quick Demo Personas Selection */}
          <div className="mt-6 pt-5 border-t border-police-border/50">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2.5">
              <Sparkles size={13} className="text-accent-gold" />
              <span>{language === 'mr' ? 'प्रात्यक्षिक अधिकारी प्रोफाइल निवडा:' : 'Quick Select Mumbai Police Persona:'}</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {Object.values(SEEDED_OFFICERS).map((officer) => (
                <button
                  key={officer.sevarthId}
                  type="button"
                  onClick={() => handleSelectOfficer(officer.sevarthId)}
                  className={`text-left p-2 rounded border text-xs transition-colors flex items-center justify-between ${
                    sevarthId === officer.sevarthId
                      ? 'bg-police-elevated border-accent-cyan text-white'
                      : 'bg-police-navy/60 border-police-border hover:bg-police-elevated text-slate-300'
                  }`}
                >
                  <div>
                    <span className="font-semibold block">
                      {language === 'mr' ? officer.fullNameMarathi : officer.fullName} ({officer.badgeNumber})
                    </span>
                    <span className="text-[11px] text-slate-400 block">{officer.policeStation}</span>
                  </div>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-police-slate border border-police-border text-accent-gold">
                    {officer.sevarthId}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer disclaimer */}
      <footer className="max-w-6xl w-full mx-auto text-center py-3 text-xs text-slate-500">
        <p>
          {language === 'mr'
            ? 'अधिकृत महाराष्ट्र शासन आणि मुंबई पोलीस आयुक्त कार्यालय • कलम ६३ बीएसए आणि कलम १०५ बीएनएसएस प्रणाली'
            : 'Authorized Law Enforcement Portal • Government of Maharashtra & Mumbai Police Commissionerate'}
        </p>
      </footer>
    </div>
  );
};
