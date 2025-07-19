import React, { useState, useEffect, useRef } from 'react'
import { PlayIcon, StopIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

const TerminalOutput = ({ output, isRunning, onStart, onStop, onRefresh }) => {
  const [autoScroll, setAutoScroll] = useState(true)
  const terminalRef = useRef(null)

  useEffect(() => {
    if (autoScroll && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [output, autoScroll])

  const formatOutput = (text) => {
    if (!text) return ''
    
    return text
      .split('\n')
      .map((line, index) => {
        // Highlight different types of output
        if (line.includes('ERROR') || line.includes('error')) {
          return <div key={index} className="text-red-400">{line}</div>
        }
        if (line.includes('WARNING') || line.includes('warning')) {
          return <div key={index} className="text-yellow-400">{line}</div>
        }
        if (line.includes('SUCCESS') || line.includes('success')) {
          return <div key={index} className="text-green-400">{line}</div>
        }
        if (line.includes('INFO') || line.includes('info')) {
          return <div key={index} className="text-blue-400">{line}</div>
        }
        return <div key={index} className="text-gray-300">{line}</div>
      })
  }

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-sm text-gray-400 ml-2">Terminal</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-2 py-1 text-xs rounded ${
              autoScroll 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-600 text-gray-300'
            }`}
          >
            Auto-scroll
          </button>
          
          {!isRunning ? (
            <button
              onClick={onStart}
              className="flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              <PlayIcon className="w-4 h-4 mr-1" />
              Start
            </button>
          ) : (
            <button
              onClick={onStop}
              className="flex items-center px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              <StopIcon className="w-4 h-4 mr-1" />
              Stop
            </button>
          )}
          
          <button
            onClick={onRefresh}
            className="flex items-center px-3 py-1 text-sm bg-gray-600 text-gray-300 rounded hover:bg-gray-700"
          >
            <ArrowPathIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        className="p-4 h-96 overflow-y-auto font-mono text-sm"
        style={{ backgroundColor: '#1a1a1a' }}
      >
        {output ? (
          <div className="space-y-1">
            {formatOutput(output)}
          </div>
        ) : (
          <div className="text-gray-500 italic">
            No output available. Start a scan to see results here.
          </div>
        )}
        
        {isRunning && (
          <div className="flex items-center mt-2">
            <div className="animate-pulse text-green-400">●</div>
            <span className="ml-2 text-green-400">Running...</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default TerminalOutput 