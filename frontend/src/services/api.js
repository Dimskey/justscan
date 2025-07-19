import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token and ngrok headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Add ngrok headers to skip browser warning
    config.headers['ngrok-skip-browser-warning'] = 'true'
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Authentication API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
}

// Project API
export const projectAPI = {
  getProjects: () => api.get('/project/'),
  getProject: (id) => api.get(`/project/${id}`),
  createProject: (projectData) => api.post('/project/', projectData),
  updateProject: (id, projectData) => api.put(`/project/${id}`, projectData),
  deleteProject: (id) => api.delete(`/project/${id}`),
  getProjectTargets: (id) => api.get(`/project/${id}/targets`),
  addTarget: (projectId, targetData) => api.post(`/project/${projectId}/targets`, targetData),
  removeTarget: (projectId, targetId) => api.delete(`/project/${projectId}/targets/${targetId}`),
}

// Reconnaissance API
export const reconAPI = {
  runNmapScan: (scanData) => api.post('/recon/nmap', scanData),
  runWhatWebScan: (scanData) => api.post('/recon/whatweb', scanData),
  getScanStatus: (taskId) => api.get(`/recon/task/${taskId}`),
  getScanResults: (projectId) => api.get(`/recon/results/${projectId}`),
  cancelScan: (taskId) => api.delete(`/recon/task/${taskId}`),
  analyzeScan: (scanResult) => api.post('/recon/analyze', scanResult),
  analyzeWhatWeb: (whatwebResult) => api.post('/recon/analyze-whatweb', whatwebResult),
}

// Exploitation API
export const exploitAPI = {
  getModules: (moduleType) => api.get('/exploit/modules', { params: { module_type: moduleType } }),
  executeExploit: (exploitData) => api.post('/exploit/execute', exploitData),
  getSessions: () => api.get('/exploit/sessions'),
  interactWithSession: (sessionId, command) => api.post(`/exploit/session/${sessionId}/interact`, { command }),
  killSession: (sessionId) => api.delete(`/exploit/session/${sessionId}`),
  getPayloads: () => api.get('/exploit/payloads'),
  runAuxiliary: (module, target, options) => api.post('/exploit/auxiliary', { module, target, options }),
}

// AI Assistant API
export const aiAPI = {
  chat: (message, context, projectId) => api.post('/ai/chat', { message, context, project_id: projectId }),
  getChatHistory: (projectId, limit) => api.get(`/ai/chat/history/${projectId}`, { params: { limit } }),
  analyzeScanResults: (scanData, projectId) => api.post('/ai/analyze/scan', { scan_data: scanData, project_id: projectId }),
  suggestExploits: (targetInfo, projectId) => api.post('/ai/suggest/exploits', { target_info: targetInfo, project_id: projectId }),
  generateReport: (projectId, reportType) => api.post('/ai/generate/report', { project_id: projectId, report_type: reportType }),
}

// Notes API
export const notesAPI = {
  getNotes: (projectId, skip = 0, limit = 100) => api.get('/notes/', { params: { project_id: projectId, skip, limit } }),
  getNote: (noteId) => api.get(`/notes/${noteId}`),
  createNote: (noteData) => api.post('/notes/', noteData),
  updateNote: (noteId, noteData) => api.put(`/notes/${noteId}`, noteData),
  deleteNote: (noteId) => api.delete(`/notes/${noteId}`),
}

// Utility functions
export const apiUtils = {
  // Handle API errors
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.detail || error.response.data?.message || 'An error occurred',
        status: error.response.status,
        data: error.response.data
      }
    } else if (error.request) {
      // Request was made but no response received
      return {
        message: 'No response from server. Please check your connection.',
        status: 0,
        data: null
      }
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0,
        data: null
      }
    }
  },

  // Format scan results
  formatScanResults: (results) => {
    if (!results) return []
    
    return results.map(result => ({
      id: result.id,
      target: result.target,
      scanType: result.scan_type,
      status: result.status,
      startedAt: result.started_at,
      completedAt: result.completed_at,
      vulnerabilities: result.vulnerabilities || 0,
      rawOutput: result.raw_output,
      parsedData: result.parsed_data
    }))
  },

  // Format project data
  formatProject: (project) => {
    if (!project) return null
    
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      scope: project.scope,
      createdAt: project.created_at,
      updatedAt: project.updated_at,
      targetsCount: project.targets?.length || 0,
      scansCount: project.scan_results?.length || 0
    }
  }
}

export default api 