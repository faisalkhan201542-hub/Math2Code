import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { EquationToCodePage } from './pages/EquationToCodePage';
import { CodeToEquationPage } from './pages/CodeToEquationPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { DerivationPage } from './pages/DerivationPage';
import { GraphPlotterPage } from './pages/GraphPlotterPage';
import { EquationLibraryPage } from './pages/EquationLibraryPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="equation-to-code" element={<EquationToCodePage />} />
            <Route path="code-to-equation" element={<CodeToEquationPage />} />
            <Route path="playground" element={<PlaygroundPage />} />
            <Route path="derivation" element={<DerivationPage />} />
            <Route path="derivation/:pattern" element={<DerivationPage />} />
            <Route path="graph-plotter" element={<GraphPlotterPage />} />
            <Route path="library" element={<EquationLibraryPage />} />
            <Route path="library/:id" element={<EquationLibraryPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
