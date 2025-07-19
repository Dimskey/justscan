import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import ProjectView from './pages/ProjectView'
import Assistant from './pages/Assistant'
import LandingPage from './pages/LandingPage'
import Scan from './pages/Scan'
import Note from './pages/Note'
import './App.css'

function App() {
  return (
    <Routes future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/project/:id" element={<ProjectView />} />
      <Route path="/assistant" element={<Assistant />} />
      <Route path="/scan" element={<Scan />} />
      <Route path="/notes" element={<Note />} />
      <Route path="/settings" element={<div className="text-white p-8">Settings Page - Coming Soon</div>} />
    </Routes>
  )
}

export default App 