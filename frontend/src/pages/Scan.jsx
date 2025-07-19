import React, { useState } from 'react';
import Layout from '../components/Layout';
import { reconAPI, apiUtils } from '../services/api';
import TerminalOutput from '../components/TerminalOutput';

const Scan = () => {
  const [target, setTarget] = useState('');
  const [option, setOption] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanStatus, setScanStatus] = useState('');
  const [error, setError] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [whatwebAnalysis, setWhatwebAnalysis] = useState(null);
  const [terminalOutput, setTerminalOutput] = useState('');
  const [activeTab, setActiveTab] = useState('nmap');
  const [wwTarget, setWwTarget] = useState('');
  const [wwLoading, setWwLoading] = useState(false);
  const [wwScanResult, setWwScanResult] = useState(null);
  const [wwScanStatus, setWwScanStatus] = useState('');
  const [wwError, setWwError] = useState(null);
  const [wwTaskId, setWwTaskId] = useState(null);
  const [wwTerminalOutput, setWwTerminalOutput] = useState('');

  const handleStartScan = async () => {
    setLoading(true);
    setScanResult(null);
    setScanStatus('Starting scan...');
    setError(null);
    setTaskId(null);
    setTerminalOutput('Starting scan...\n');
    try {
      // Kirim payload sesuai schema backend
      const payload = {
        target,
        scan_type: option
      };
      // Jika ada input ports/options/project_id, tambahkan manual:
      if (typeof ports !== 'undefined' && ports !== null && ports !== '') payload.ports = ports;
      if (typeof options !== 'undefined' && options !== null) payload.options = options;
      if (typeof projectId !== 'undefined' && projectId !== null) payload.project_id = projectId;
      const res = await reconAPI.runNmapScan(payload);
      setTaskId(res.data.task_id);
      setScanStatus('Scan started. Waiting for result...');
      setTerminalOutput(prev => prev + 'Scan started. Waiting for result...\n');
      pollScanStatus(res.data.task_id);
    } catch (err) {
      setError(apiUtils.handleError(err).message);
      setLoading(false);
      setScanStatus('');
      setTerminalOutput(prev => prev + 'Scan failed to start.\n');
    }
  };

  const pollScanStatus = async (taskId) => {
    let polling = true;
    setLoading(true);
    while (polling) {
      try {
        const res = await reconAPI.getScanStatus(taskId);
        if (res.data.status === 'SUCCESS' || res.data.status === 'completed') {
          setScanResult(res.data.result || res.data);
          setScanStatus('Scan complete.');
          setLoading(false);
          setTerminalOutput(prev => prev + '\n' + (res.data.result?.raw_output || JSON.stringify(res.data.result, null, 2)));
          polling = false;
        } else if (res.data.status === 'FAILURE' || res.data.status === 'failed') {
          setScanStatus('Scan failed.');
          setError(res.data.result?.error || 'Scan failed');
          setLoading(false);
          setTerminalOutput(prev => prev + '\nScan failed.');
          polling = false;
        } else {
          setScanStatus('Scanning...');
          setTerminalOutput(prev => prev + '.');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (err) {
        setError(apiUtils.handleError(err).message);
        setLoading(false);
        setTerminalOutput(prev => prev + '\nScan error.');
        polling = false;
      }
    }
  };

  const handleStopScan = () => {
    setLoading(false);
    setScanStatus('Scan stopped by user.');
    setTerminalOutput(prev => prev + '\nScan stopped by user.');
  };

  const handleRefreshTerminal = () => {
    setTerminalOutput('');
  };

  const handleAnalyze = async () => {
    setAnalysis(null);
    if (!scanResult) return;
    try {
      const res = await reconAPI.analyzeScan(scanResult);
      setAnalysis(res.data.analysis);
    } catch (err) {
      setAnalysis([{ vuln: 'Failed to analyze', severity: 'error', recommendation: apiUtils.handleError(err).message }]);
    }
  };

  const handleAnalyzeWhatWeb = async () => {
    setWhatwebAnalysis(null);
    if (!scanResult) return;
    try {
      const res = await reconAPI.analyzeWhatWeb(scanResult);
      setWhatwebAnalysis(res.data.analysis);
    } catch (err) {
      setWhatwebAnalysis([{ vuln: 'Failed to analyze', severity: 'error', recommendation: apiUtils.handleError(err).message }]);
    }
  };

  const handleStartWhatWeb = async () => {
    setWwLoading(true);
    setWwScanResult(null);
    setWwScanStatus('Starting WhatWeb scan...');
    setWwError(null);
    setWwTaskId(null);
    setWwTerminalOutput('Starting WhatWeb scan...\n');
    try {
      const payload = { target: wwTarget };
      const res = await reconAPI.runWhatWebScan(payload);
      setWwTaskId(res.data.task_id);
      setWwScanStatus('Scan started. Waiting for result...');
      setWwTerminalOutput(prev => prev + 'Scan started. Waiting for result...\n');
      pollWhatWebStatus(res.data.task_id);
    } catch (err) {
      setWwError(apiUtils.handleError(err).message);
      setWwLoading(false);
      setWwScanStatus('');
      setWwTerminalOutput(prev => prev + 'Scan failed to start.\n');
    }
  };

  const pollWhatWebStatus = async (taskId) => {
    let polling = true;
    setWwLoading(true);
    while (polling) {
      try {
        const res = await reconAPI.getScanStatus(taskId);
        if (res.data.status === 'SUCCESS' || res.data.status === 'completed') {
          setWwScanResult(res.data.result || res.data);
          setWwScanStatus('Scan complete.');
          setWwLoading(false);
          // Tampilkan hasil raw_output atau JSON hasilnya
          const output = res.data.result?.raw_output || res.data.result?.parsed_data ? JSON.stringify(res.data.result?.parsed_data, null, 2) : JSON.stringify(res.data.result || res.data, null, 2);
          setWwTerminalOutput(prev => prev + '\n' + output);
          polling = false;
        } else if (res.data.status === 'FAILURE' || res.data.status === 'failed') {
          setWwScanStatus('Scan failed.');
          setWwError(res.data.result?.error || 'Scan failed');
          setWwLoading(false);
          setWwTerminalOutput(prev => prev + '\nScan failed.');
          polling = false;
        } else {
          setWwScanStatus('Scanning...');
          setWwTerminalOutput(prev => prev + '.');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (err) {
        setWwError(apiUtils.handleError(err).message);
        setWwLoading(false);
        setWwTerminalOutput(prev => prev + '\nScan error.');
        polling = false;
      }
    }
  };

  return (
    <Layout>
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">Scan</p>
      </div>
      {/* Tabs */}
      <div className="flex gap-4 px-4 pb-2">
        <button
          className={`px-4 py-2 rounded-t-lg font-bold ${activeTab === 'nmap' ? 'bg-[#0b79ee] text-white' : 'bg-[#283039] text-gray-300'}`}
          onClick={() => setActiveTab('nmap')}
        >
          Nmap
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-bold ${activeTab === 'whatweb' ? 'bg-[#0b79ee] text-white' : 'bg-[#283039] text-gray-300'}`}
          onClick={() => setActiveTab('whatweb')}
        >
          WhatWeb
        </button>
      </div>
      {/* Tab Content */}
      {activeTab === 'nmap' && (
        <>
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <input
                placeholder="Target IP"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#283039] focus:border-none h-14 placeholder:text-[#9caaba] p-4 text-base font-normal leading-normal"
                value={target}
                onChange={e => setTarget(e.target.value)}
              />
            </label>
          </div>
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <select
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#283039] focus:border-none h-14 bg-[image:--select-button-svg] placeholder:text-[#9caaba] p-4 text-base font-normal leading-normal"
                value={option}
                onChange={e => setOption(e.target.value)}
                style={{['--select-button-svg']: "url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(156,170,186)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e')"}}
              >
                <option value="basic">Basic Scan</option>
                <option value="stealth">Stealth Scan</option>
                <option value="aggressive">Aggressive Scan</option>
                <option value="port_scan">Port Scan Only</option>
              </select>
            </label>
          </div>
          <div className="flex px-4 py-3 justify-start">
            <button
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#0b79ee] text-white text-sm font-bold leading-normal tracking-[0.015em]"
              onClick={handleStartScan}
              disabled={loading || !target}
            >
              <span className="truncate">{loading ? 'Scanning...' : 'Start Scan'}</span>
            </button>
          </div>
          <div className="px-4 pb-4">
            <div className="mb-6">
              <TerminalOutput
                output={terminalOutput}
                isRunning={loading}
                onStart={handleStartScan}
                onStop={handleStopScan}
                onRefresh={handleRefreshTerminal}
              />
            </div>
          </div>
        </>
      )}
      {activeTab === 'whatweb' && (
        <>
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <input
                placeholder="Target URL"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#283039] focus:border-none h-14 placeholder:text-[#9caaba] p-4 text-base font-normal leading-normal"
                value={wwTarget}
                onChange={e => setWwTarget(e.target.value)}
              />
            </label>
          </div>
          <div className="flex px-4 py-3 justify-start">
            <button
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#0b79ee] text-white text-sm font-bold leading-normal tracking-[0.015em]"
              onClick={handleStartWhatWeb}
              disabled={wwLoading || !wwTarget}
            >
              <span className="truncate">{wwLoading ? 'Scanning...' : 'Start WhatWeb Scan'}</span>
            </button>
          </div>
          <div className="px-4 pb-4">
            <div className="mb-6">
              <TerminalOutput
                output={wwTerminalOutput}
                isRunning={wwLoading}
                onStart={handleStartWhatWeb}
                onStop={() => setWwLoading(false)}
                onRefresh={() => setWwTerminalOutput('')}
              />
            </div>
            {wwScanResult?.parsed_data && (
              <div className="mt-6 bg-gray-900 rounded p-4">
                <table className="w-full text-sm text-white">
                  <tbody>
                    {Object.entries(wwScanResult.parsed_data).map(([key, value]) => (
                      <tr key={key}>
                        <td className="font-bold pr-4 align-top">{key}</td>
                        <td>{String(value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </Layout>
  );
};

export default Scan; 