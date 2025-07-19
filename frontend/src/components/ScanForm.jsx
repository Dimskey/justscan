import React, { useState } from 'react'
import { MagnifyingGlassIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

const ScanForm = ({ onScanStart, scanType = 'nmap', projectId }) => {
  const [formData, setFormData] = useState({
    target: '',
    scan_type: 'basic',
    ports: '',
    options: {},
    project_id: projectId || null
  })
  const [scanMode, setScanMode] = useState('nmap');

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.target.trim()) {
      alert('Please enter a target')
      return
    }
    if (scanMode === 'whatweb') {
      const payload = { target: formData.target, scan_type: 'whatweb' };
      if (formData.options && Object.keys(formData.options).length > 0) payload.options = formData.options;
      if (typeof projectId !== 'undefined' && projectId !== null) payload.project_id = projectId;
      onScanStart(payload);
    } else {
    onScanStart({ ...formData, project_id: projectId })
    }
  }

  const scanTypes = [
    { value: 'basic', label: 'Basic Scan', description: 'Quick port scan with service detection' },
    { value: 'stealth', label: 'Stealth Scan', description: 'Slow and quiet scan' },
    { value: 'aggressive', label: 'Aggressive Scan', description: 'Comprehensive scan with vulnerability detection' },
    { value: 'port_scan', label: 'Port Scan Only', description: 'Just port enumeration' }
  ]

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex items-center mb-4">
        <MagnifyingGlassIcon className="w-6 h-6 text-green-400 mr-2" />
        <h2 className="text-xl font-semibold text-white">
          Scan
        </h2>
        <select
          className="ml-4 px-2 py-1 rounded bg-gray-700 text-white border border-gray-600"
          value={scanMode}
          onChange={e => setScanMode(e.target.value)}
        >
          <option value="nmap">Nmap</option>
          <option value="whatweb">WhatWeb</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Target Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Target
          </label>
          <div className="relative">
            <GlobeAltIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="target"
              value={formData.target}
              onChange={handleInputChange}
              placeholder="Enter IP address, domain, or URL"
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {scanMode === 'nmap' && (
          <>
            {/* Scan Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Scan Type
              </label>
              <select
                name="scan_type"
                value={formData.scan_type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {scanTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-400">
                {scanTypes.find(t => t.value === formData.scan_type)?.description}
              </p>
            </div>

            {/* Ports */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ports (optional)
              </label>
              <input
                type="text"
                name="ports"
                value={formData.ports}
                onChange={handleInputChange}
                placeholder="e.g., 80,443,8080 or 1-1000"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-400">
                Leave empty to scan all ports
              </p>
            </div>
          </>
        )}

        {/* Advanced Options */}
        {scanMode === 'nmap' && (
        <div>
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-gray-300 hover:text-white">
              Advanced Options
            </summary>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="verbose"
                  className="mr-2"
                />
                <label htmlFor="verbose" className="text-sm text-gray-300">
                  Verbose output
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="timing"
                  className="mr-2"
                />
                <label htmlFor="timing" className="text-sm text-gray-300">
                  Show timing information
                </label>
              </div>
            </div>
          </details>
        </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
        >
          Start Scan
        </button>
      </form>
    </div>
  )
}

export default ScanForm 