import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { CaseDetailPage } from './components/cases/CaseDetailPage';
import { IngestionPage } from './components/ingestion/IngestionPage';
import { TopHeader } from './components/layout/TopHeader';
import { SidebarRail, type NavigationTab } from './components/layout/SidebarRail';
import { CasesService } from './services/casesService';

type ActiveView =
  | { type: 'dashboard'; filterMode?: 'all' | 'malkhana' | 'kalina' }
  | { type: 'case-detail'; caseId: string }
  | { type: 'ingestion'; caseId: string };

const MainPortal: React.FC = () => {
  const { officer, isAuthenticated, language } = useAuth();
  const [view, setView] = useState<ActiveView>({ type: 'dashboard', filterMode: 'all' });
  const [currentTab, setCurrentTab] = useState<NavigationTab>('cases');

  if (!isAuthenticated || !officer) {
    return <LoginPage />;
  }

  const handleSelectTab = (tab: NavigationTab) => {
    setCurrentTab(tab);
    if (tab === 'cases') {
      setView({ type: 'dashboard', filterMode: 'all' });
    } else if (tab === 'malkhana') {
      setView({ type: 'dashboard', filterMode: 'malkhana' });
    } else if (tab === 'kalina') {
      setView({ type: 'dashboard', filterMode: 'kalina' });
    } else if (tab === 'ingest') {
      // Find an active case for current officer
      const cases = CasesService.getCases(officer.policeStation, officer.clearanceLevel);
      if (cases.length > 0) {
        setView({ type: 'ingestion', caseId: cases[0].id });
      } else {
        setView({ type: 'dashboard' });
      }
    } else if (tab === 'certificates' || tab === 'audit') {
      const cases = CasesService.getCases(officer.policeStation, officer.clearanceLevel);
      if (cases.length > 0) {
        setView({ type: 'case-detail', caseId: cases[0].id });
      } else {
        setView({ type: 'dashboard' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col justify-between">
      {/* Fixed Sovereign Top Command Header */}
      <TopHeader onTitleClick={() => {
        setCurrentTab('cases');
        setView({ type: 'dashboard', filterMode: 'all' });
      }} />

      {/* Main Workspace Frame with SidebarRail */}
      <div className="flex-1 flex pt-14 h-screen overflow-hidden">
        {/* Left Forensic Sidebar Rail */}
        <SidebarRail
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          language={language}
        />

        {/* Center Dynamic Multi-Pane Content in Light Mode */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 bg-slate-50">
          {view.type === 'dashboard' && (
            <DashboardPage
              filterMode={view.filterMode}
              onSelectCase={(caseId) => setView({ type: 'case-detail', caseId })}
            />
          )}

          {view.type === 'case-detail' && (
            <CaseDetailPage
              caseId={view.caseId}
              onBack={() => {
                setCurrentTab('cases');
                setView({ type: 'dashboard', filterMode: 'all' });
              }}
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
      </div>

      {/* Sovereign Legal Footer Strip */}
      <footer className="border-t border-slate-200 bg-white py-2 text-center text-[10px] font-mono text-slate-500 select-none shadow-xs">
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
