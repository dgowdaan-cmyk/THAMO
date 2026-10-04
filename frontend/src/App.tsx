import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Footer } from './components/Footer';

import { HomePage } from './pages/HomePage';
import { BeforePaymentPage } from './pages/BeforePaymentPage';
import { UnderPressurePage } from './pages/UnderPressurePage';
import { AfterFraudPage } from './pages/AfterFraudPage';
import { AnalyzePage } from './pages/AnalyzePage';
import { TimelinePage } from './pages/TimelinePage';
import { ActionsPage } from './pages/ActionsPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { EvaluationPage } from './pages/EvaluationPage';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 selection:bg-teal-500/20 selection:text-teal-900 font-sans">
      {/* Sleek Modern Left Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-screen overflow-y-auto bg-slate-50">
        <TopBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/before-payment" element={<BeforePaymentPage />} />
            <Route path="/under-pressure" element={<UnderPressurePage />} />
            <Route path="/after-fraud" element={<AfterFraudPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/actions" element={<ActionsPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/evaluation" element={<EvaluationPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppLayout />
      </Router>
    </LanguageProvider>
  );
}

export default App;
