import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { 
  PlusIcon, 
  GlobeAltIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import ScanForm from '../components/ScanForm'
import TerminalOutput from '../components/TerminalOutput'
import { projectAPI, apiUtils, reconAPI } from '../services/api'

const ProjectView = () => {
  const { id } = useParams()
  const projectId = parseInt(id, 10);
  const [project, setProject] = useState(null)
  const [targets, setTargets] = useState([])
  const [scanResults, setScanResults] = useState([])
  const [scanOutput, setScanOutput] = useState('')
  const [isScanRunning, setIsScanRunning] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedScan, setSelectedScan] = useState(null);

  useEffect(() => {
    loadProjectData()
    fetchScanResults()
  }, [id])

  const loadProjectData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await projectAPI.getProject(id)
      setProject(res.data)
      const tRes = await projectAPI.getProjectTargets(id)
      setTargets(tRes.data)
    } catch (err) {
      setError(apiUtils.handleError(err).message)
    }
    setLoading(false)
  }

  const fetchScanResults = async () => {
    try {
      const res = await reconAPI.getScanResults(id)
      setScanResults(res.data)
    } catch (err) {
      setScanResults([])
    }
  }

  const handleScanStart = async (scanData) => {
    setIsScanRunning(true)
    setScanOutput('Starting scan for project...\n')
    setError(null)
    try {
      let res;
      if (scanData.scan_type === 'whatweb') {
        // Include project_id for WhatWeb scan
        const { target, options } = scanData;
        const payload = { target, project_id: projectId };
        if (options) payload.options = options;
        res = await reconAPI.runWhatWebScan(payload);
      } else {
        res = await reconAPI.runNmapScan(scanData);
      }
      const taskId = res.data.task_id
      setScanOutput('Scan started. Waiting for result...\n')
      pollScanStatus(taskId, scanData.scan_type)
    } catch (err) {
      setScanOutput('Scan failed to start.\n')
      setError(apiUtils.handleError(err).message)
      setIsScanRunning(false)
    }
  }

  const pollScanStatus = async (taskId, scanType) => {
    let polling = true
    setIsScanRunning(true)
    while (polling) {
      try {
        const res = await reconAPI.getScanStatus(taskId)
        if (res.data.status === 'SUCCESS' || res.data.status === 'completed') {
          // Tampilkan hasil parsed_data jika ada, jika tidak raw_output
          const result = res.data.result || res.data;
          let output = '';
          if (result.parsed_data) {
            output = JSON.stringify(result.parsed_data, null, 2);
          } else if (result.raw_output) {
            output = result.raw_output;
          } else {
            output = JSON.stringify(result, null, 2);
          }
          setScanOutput(prev => prev + '\n' + output)
          setIsScanRunning(false)
          polling = false
          // Update scanResults (history)
          fetchScanResults()
        } else if (res.data.status === 'FAILURE' || res.data.status === 'failed') {
          setScanOutput(prev => prev + '\nScan failed.')
          setError(res.data.result?.error || 'Scan failed')
          setIsScanRunning(false)
          polling = false
        } else {
          setScanOutput(prev => prev + '.')
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      } catch (err) {
        setError(apiUtils.handleError(err).message)
        setIsScanRunning(false)
        polling = false
      }
    }
  }

  const handleScanStop = () => {
    setIsScanRunning(false)
    setScanOutput(prev => prev + 'Scan stopped by user.\n')
  }

  const handleScanRefresh = () => {
    setScanOutput('')
  }

  // Tambahkan perhitungan untuk stats
  const lastTarget = scanResults[0]?.target || (scanResults[0]?.parsed_data?.hosts?.[0]?.addresses?.[0]?.addr || '-')
  const totalScans = scanResults.length
  const totalVulns = scanResults.reduce((sum, scan) => sum + (scan.parsed_data?.vulnerabilities?.length || 0), 0)

  // Gabungkan semua vulnerabilities dari seluruh scan
  const allVulns = scanResults.flatMap(scan => scan.parsed_data?.vulnerabilities || [])

  if (loading) {
    return (
      <div className="p-6 text-gray-400">Loading project...</div>
    )
  }
  if (error) {
    return (
      <div className="p-6 text-red-400">{error}</div>
    )
  }
  if (!project) {
    return (
      <div className="p-6 text-gray-400">Project not found.</div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{project.name}</h1>
          <p className="text-gray-400">{project.description}</p>
        </div>
        {/* Hapus tombol Add Target di header */}
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center">
            <GlobeAltIcon className="w-6 h-6 text-blue-400" />
            <div className="ml-3">
              <p className="text-sm text-gray-400">Last Scanned Target</p>
              <p className="text-xl font-bold text-white">{lastTarget}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center">
            <MagnifyingGlassIcon className="w-6 h-6 text-green-400" />
            <div className="ml-3">
              <p className="text-sm text-gray-400">Scans</p>
              <p className="text-xl font-bold text-white">{totalScans}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-gray-400">Vulnerabilities</p>
              <p className="text-xl font-bold text-white">{totalVulns}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center">
            <CheckCircleIcon className="w-6 h-6 text-green-400" />
            <div className="ml-3">
              <p className="text-sm text-gray-400">Status</p>
              <p className="text-xl font-bold text-white">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', name: 'Overview' },
            { id: 'scans', name: 'Scans' },
            { id: 'vulnerabilities', name: 'Vulnerabilities' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ScanForm onScanStart={handleScanStart} projectId={projectId} />
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {scanResults.slice(0, 3).map(result => (
                  <div key={result.id} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                    <div>
                      <p className="text-white font-medium">{result.target}</p>
                      <p className="text-sm text-gray-400">{result.scan_type} scan</p>
                    </div>
                    <div className="flex items-center">
                      <CheckCircleIcon className="w-4 h-4 text-green-400 mr-2" />
                      <span className="text-sm text-gray-400">{result.completed_at}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scans' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Scan History</h3>
            
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Target
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Started
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Vulnerabilities
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {scanResults.map(result => (
                    <tr
                      key={result.id}
                      className={`hover:bg-gray-700 cursor-pointer ${selectedScan?.id === result.id ? 'bg-gray-700' : ''}`}
                      onClick={() => setSelectedScan(result)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {result.target || (result.parsed_data?.hosts?.[0]?.addresses?.[0]?.addr || '-')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {result.scan_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-green-600 text-white rounded">
                          {result.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {result.started_at}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {result.parsed_data?.vulnerabilities?.length || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Detail scan result */}
            {selectedScan && (
              <div className="bg-gray-900 rounded-lg border border-gray-700 p-6 mt-4">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Scan Result for {selectedScan.target || (selectedScan.parsed_data?.hosts?.[0]?.addresses?.[0]?.addr || '-')}
                </h4>
                <div className="mb-2">
                  <span className="text-gray-400">Scan Type:</span> {selectedScan.scan_type}
                </div>
                <div className="mb-2">
                  <span className="text-gray-400">Status:</span> {selectedScan.status}
                </div>
                <div className="mb-2">
                  <span className="text-gray-400">Started:</span> {selectedScan.started_at}
                </div>
                <div className="mb-2">
                  <span className="text-gray-400">Completed:</span> {selectedScan.completed_at}
                </div>
                <div className="mb-2">
                  <span className="text-gray-400">Vulnerabilities:</span> {selectedScan.parsed_data?.vulnerabilities?.length || 0}
                </div>
                {/* Parsed Data Summary */}
                {selectedScan.parsed_data && (
                  <div className="mt-4">
                    <h5 className="text-md font-semibold text-green-400 mb-2">Parsed Scan Summary</h5>
                    {selectedScan.scan_type === 'whatweb' ? (
                      <table className="w-full text-sm text-white">
                        <tbody>
                          {Object.entries(selectedScan.parsed_data).map(([key, value]) => (
                            <tr key={key}>
                              <td className="font-bold pr-4 align-top">{key}</td>
                              <td>{String(value)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : selectedScan.parsed_data.hosts && selectedScan.parsed_data.hosts.length > 0 ? (
                      selectedScan.parsed_data.hosts.map((host, idx) => (
                        <div key={idx} className="mb-4">
                          <div className="text-gray-300 mb-1">
                            <span className="font-bold">Host:</span>{' '}
                            {host.addresses?.map(a => a.addr).join(", ") || "-"}
                            {host.os_info?.name && (
                              <span className="ml-2 text-sm text-blue-400">({host.os_info.name}, accuracy: {host.os_info.accuracy}%)</span>
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-gray-400">Open Ports:</span>
                            <ul className="ml-4 list-disc text-gray-300">
                              {host.ports && host.ports.length > 0 ? (
                                host.ports.map((port, pidx) => (
                                  <li key={pidx}>
                                    <span className="text-green-400">{port.port}/{port.protocol}</span> - {port.state}
                                    {port.service?.name && (
                                      <> ({port.service.name} {port.service.product} {port.service.version})</>
                                    )}
                                  </li>
                                ))
                              ) : (
                                <li>No open ports found</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400">No host data found.</div>
                    )}
                    {/* Render vulnerabilities jika ada */}
                    {selectedScan.parsed_data.vulnerabilities && selectedScan.parsed_data.vulnerabilities.length > 0 && (
                      <div className="mt-2">
                        <span className="font-bold text-red-400">Vulnerabilities:</span>
                        <ul className="ml-4 list-disc text-red-300">
                          {selectedScan.parsed_data.vulnerabilities.map((vuln, vidx) => (
                            <li key={vidx}>
                              <span className="font-bold">Port {vuln.port}</span> - {vuln.script_id}: {vuln.output}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                {/* Raw Output */}
                <div className="mb-2 mt-4">
                  <span className="text-gray-400">Raw Output:</span>
                  <pre className="bg-gray-800 text-green-400 rounded p-4 overflow-x-auto whitespace-pre-wrap text-sm mt-2">
                    {selectedScan.raw_output || 'No output'}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'vulnerabilities' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Vulnerabilities Found</h3>
            {allVulns.length === 0 ? (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="text-center py-8">
                  <ExclamationTriangleIcon className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <p className="text-gray-400">No vulnerabilities found yet</p>
                  <p className="text-sm text-gray-500 mt-2">Run scans to discover vulnerabilities</p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <ul className="space-y-3">
                  {allVulns.map((vuln, idx) => (
                    <li key={idx} className="p-3 bg-gray-700 rounded">
                      <div className="text-white font-medium">
                        Port: {vuln.port} | Script: {vuln.script_id}
                      </div>
                      <div className="text-sm text-gray-400 whitespace-pre-line">
                        {vuln.output}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Terminal Output */}
      <div>
        <TerminalOutput
          output={scanOutput}
          isRunning={isScanRunning}
          onStart={() => handleScanStart({ target: 'localhost' })}
          onStop={handleScanStop}
          onRefresh={handleScanRefresh}
        />
      </div>
    </div>
  )
}

export default ProjectView 