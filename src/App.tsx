import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { ToastProvider } from './context/ToastContext'
import { Layout } from './components/Layout/Layout'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { ApplicationsList } from './pages/ApplicationsList'
import { ApplicationDetail } from './pages/ApplicationDetail'
import { EvcSchedule } from './pages/EvcSchedule'
import { ComplianceMonitor } from './pages/ComplianceMonitor'
import { AxiomForesight } from './pages/AxiomForesight'
import { Reports } from './pages/Reports'

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Login Role-Picker Route */}
            <Route path="/login" element={<Login />} />

            {/* Authenticated / Core Platform Routes inside Govtech Layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="applications" element={<ApplicationsList />} />
              <Route path="applications/:id" element={<ApplicationDetail />} />
              <Route path="evc-schedule" element={<EvcSchedule />} />
              <Route path="compliance" element={<ComplianceMonitor />} />
              <Route path="foresight" element={<AxiomForesight />} />
              <Route path="reports" element={<Reports />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ToastProvider>
  )
}

export default App
