import React, { useState } from 'react';
import {
  ShieldCheck,
  Fingerprint,
  Globe,
  Clock,
  AlertCircle,
  Radio,
  Lock,
  Star,
  Cpu,
  KeyRound,
} from 'lucide-react';
import { useAuth, SEEDED_OFFICERS } from '../../context/AuthContext';
import { formatForensicsError } from '../../types/errors';

export const LoginPage: React.FC = () => {
  const { login, testLogin, isLoading, error, language, toggleLanguage, clearError } = useAuth();
  const [sevarthId, setSevarthId] = useState('MH-POL-40211');
  const [isTestLoggingIn, setIsTestLoggingIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await login(sevarthId);
  };

  const handleTestBiometricLogin = async (targetId: string = 'MH-POL-00001') => {
    clearError();
    setIsTestLoggingIn(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    await testLogin(targetId);
    setIsTestLoggingIn(false);
  };

  const handleSelectOfficer = (id: string) => {
    setSevarthId(id);
    clearError();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-4 md:p-6 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top sovereign utility bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-2 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-6 h-6 rounded bg-sovereign-navy border border-amber-600/40">
            <Star size={12} className="text-amber-300 fill-amber-300" />
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300 font-deva">
            सद्रक्षणाय खलनिग्रहणाय
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">&bull; Maharashtra State Police</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded border border-slate-200 text-[11px] font-mono shadow-xs">
            <Clock size={12} className="text-emerald-600" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-700 font-semibold">NPL-IST SYNCED</span>
          </div>

          <button
            type="button"
            onClick={toggleLanguage}
            aria-label="Toggle language between English and Marathi"
            className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-xs font-medium text-slate-700 transition-colors shadow-xs"
          >
            <Globe size={13} className="text-amber-700" />
            <span className="font-semibold text-[11px]">{language === 'en' ? 'मराठी' : 'English'}</span>
          </button>
        </div>
      </header>

      {/* Center Biometric Law Enforcement Terminal in Light Mode */}
      <main className="max-w-md w-full mx-auto my-auto py-6">
        <div className="bg-white border-2 border-slate-200 rounded-xl p-6 md:p-8 shadow-xl relative overflow-hidden">
          {/* Top Navy/Gold Hairline Strip */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sovereign-navy via-amber-600 to-sovereign-navy" />

          {/* Institutional Insignia */}
          <div className="flex flex-col items-center text-center mb-6 pt-1">
            <div className="w-14 h-14 rounded-xl bg-sovereign-navy border-2 border-amber-400 flex items-center justify-center relative shadow-md mb-3">
              <ShieldCheck size={32} className="text-amber-400" aria-hidden="true" />
              <Star size={11} className="text-amber-300 absolute top-2 right-2 fill-amber-300" />
            </div>

            <h1 className="text-lg md:text-xl font-bold tracking-wider uppercase text-sovereign-navy font-mono">
              {language === 'mr' ? 'मुंबई पोलीस • MUMBAI POLICE' : 'मुंबई पोलीस • MUMBAI POLICE'}
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-xs font-medium">
              {language === 'mr'
                ? 'डिजिटल पुरावे व मुद्देमाल अभिरक्षा व्यवस्थापन प्रणाली'
                : 'Digital Evidence & Muddemal Custody Management System (INCORRUPTA)'}
            </p>

            {/* Hardware FIPS 140-3 badge */}
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-600">
              <Cpu size={11} className="text-emerald-600" />
              <span className="font-semibold">FIDO2 / WEBAUTHN HARDWARE BOUND</span>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{formatForensicsError(error, language)}</span>
            </div>
          )}

          {/* Terminal Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label htmlFor="sevarthId" className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {language === 'mr' ? 'सेवायोजन कर्मचारी आयडी (Sevarth ID)' : 'Sevarth Employee ID / सेवायोजन आयडी'}
              </label>
              <div className="relative">
                <input
                  id="sevarthId"
                  type="text"
                  value={sevarthId}
                  onChange={(e) => setSevarthId(e.target.value)}
                  placeholder="MH-POL-40211"
                  required
                  className="w-full px-3 py-2.5 rounded bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 font-mono text-xs focus:outline-none focus:bg-white focus:border-sovereign-navy focus:ring-1 focus:ring-sovereign-navy transition-all shadow-xs"
                />
                <Lock size={14} className="absolute right-3 top-3 text-slate-400" />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                {language === 'mr'
                  ? 'उदा. MH-POL-40211 किंवा MH-POL-00001 (सर्व डेटा)'
                  : 'Format: MH-POL-XXXXX (e.g. MH-POL-00001 for All Stations Access)'}
              </span>
            </div>

            {/* Standard Biometric Passkey Button */}
            <button
              type="submit"
              disabled={isLoading || isTestLoggingIn}
              className="w-full py-2.5 px-4 rounded bg-sovereign-navy hover:bg-sovereign-navyHover text-white font-mono font-bold text-xs flex items-center justify-center gap-2 shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
            >
              <Fingerprint size={18} />
              <span>
                {isLoading
                  ? language === 'mr' ? 'पडताळणी सुरू आहे...' : 'Verifying Biometrics...'
                  : language === 'mr' ? 'बायोमेट्रिक पडताळणी / Verify Passkey' : 'Verify Biometric Passkey / बायोमेट्रिक पडताळणी'}
              </span>
            </button>

            {/* Test Biometric Login Button for Instant Access to All Data */}
            <div className="pt-1.5">
              <button
                type="button"
                onClick={() => handleTestBiometricLogin('MH-POL-00001')}
                disabled={isLoading || isTestLoggingIn}
                className="w-full py-2.5 px-3 rounded bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all uppercase tracking-wider group"
              >
                <KeyRound size={15} className="text-emerald-700 group-hover:scale-110 transition-transform" />
                <span>
                  {isTestLoggingIn
                    ? language === 'mr' ? 'बायोमेट्रिक चाचणी सुरू आहे...' : 'Simulating Biometric Handshake...'
                    : language === 'mr' ? '⚡ चाचणी बायोमेट्रिक प्रवेश (सर्व डेटा)' : '⚡ Test Biometric Login (Access All Data)'}
                </span>
              </button>
              <div className="text-[10px] text-slate-500 font-mono text-center mt-1">
                {language === 'mr'
                  ? 'सर्व पोलीस ठाणी व पुरावे तपासण्यासाठी बायोमेट्रिक चाचणी प्रवेश'
                  : 'Bypasses hardware scanner for instant test inspection of all cases & evidence'}
              </div>
            </div>
          </form>

          {/* Quick Select Mumbai Police Personas */}
          <div className="mt-5 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-600 uppercase tracking-wider mb-2 font-bold">
              <span>{language === 'mr' ? 'प्रात्यक्षिक अधिकारी निवडा:' : 'Quick Select Law Enforcement Persona:'}</span>
              <Radio size={11} className="text-amber-700" />
            </div>

            <div className="space-y-1.5">
              {Object.values(SEEDED_OFFICERS).map((officerProfile) => (
                <button
                  key={officerProfile.sevarthId}
                  type="button"
                  onClick={() => handleSelectOfficer(officerProfile.sevarthId)}
                  className={`w-full text-left p-2.5 rounded border text-xs transition-all flex items-center justify-between shadow-xs ${
                    sevarthId === officerProfile.sevarthId
                      ? 'bg-amber-50/80 border-amber-500 text-slate-900 ring-1 ring-amber-400'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="truncate">
                    <span className="font-bold block truncate text-[11px] text-slate-900">
                      {language === 'mr' ? officerProfile.fullNameMarathi : officerProfile.fullName} ({officerProfile.badgeNumber})
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate font-mono">
                      {officerProfile.policeStation} &bull; Level {officerProfile.clearanceLevel}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-amber-800 font-bold shrink-0">
                    {officerProfile.sevarthId}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center py-2 text-[11px] text-slate-500 font-mono">
        <p>
          {language === 'mr'
            ? 'अधिकृत महाराष्ट्र शासन आणि मुंबई पोलीस आयुक्त कार्यालय • कलम ६३ बीएसए आणि कलम १०५ बीएनएसएस प्रणाली'
            : 'Authorized Law Enforcement Portal • Government of Maharashtra & Mumbai Police Commissionerate'}
        </p>
      </footer>
    </div>
  );
};
