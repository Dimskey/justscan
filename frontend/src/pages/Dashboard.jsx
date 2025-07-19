import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useNavigate } from 'react-router-dom'
import { projectAPI, apiUtils } from '../services/api'
import ProjectFormModal from '../components/ProjectFormModal'

const Dashboard = () => {
  const [stats, setStats] = useState({
    successfulScans: 0,
    vulnerabilitiesFound: 0
  })
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editProject, setEditProject] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('Fetching projects from API...', import.meta.env.VITE_API_URL)
      const res = await projectAPI.getProjects()
      console.log('Projects response:', res)
      // Ensure we have an array
      const projectsData = Array.isArray(res.data) ? res.data : []
      setProjects(projectsData)
    } catch (err) {
      console.error('API Error:', err)
      const errorMessage = apiUtils.handleError(err).message
      console.error('Formatted error:', errorMessage)
      setError(errorMessage)
    }
    setLoading(false)
  }

  const handleCreate = () => {
    setEditProject(null)
    setShowModal(true)
  }

  const handleEdit = (project) => {
    setEditProject(project)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return
    try {
      await projectAPI.deleteProject(id)
      fetchProjects()
    } catch (err) {
      alert(apiUtils.handleError(err).message)
    }
  }

  const handleView = (id) => {
    navigate(`/project/${id}`)
  }

  const handleModalSubmit = async (data) => {
    try {
      if (editProject) {
        await projectAPI.updateProject(editProject.id, data)
      } else {
        await projectAPI.createProject(data)
      }
      setShowModal(false)
      fetchProjects()
    } catch (err) {
      alert(apiUtils.handleError(err).message)
    }
  }

  return (
    <Layout>
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">Dashboard</p>
      </div>
      
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Recent Activities</h2>
      
      <div className="flex items-center gap-4 bg-[#111418] px-4 min-h-[72px] py-2">
        <div className="text-white flex items-center justify-center rounded-lg bg-[#283039] shrink-0 size-12" data-icon="WifiSlash" data-size="24px" data-weight="regular">
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path
              d="M213.92,210.62a8,8,0,1,1-11.84,10.76l-52-57.15a60,60,0,0,0-57.41,7.24,8,8,0,1,1-9.42-12.93A75.43,75.43,0,0,1,128,144c1.28,0,2.55,0,3.82.1L104.9,114.49A108,108,0,0,0,61,135.31,8,8,0,0,1,49.73,134,8,8,0,0,1,51,122.77a124.27,124.27,0,0,1,41.71-21.66L69.37,75.4a155.43,155.43,0,0,0-40.29,24A8,8,0,0,1,18.92,87,171.87,171.87,0,0,1,58,62.86L42.08,45.38A8,8,0,1,1,53.92,34.62ZM128,192a12,12,0,1,0,12,12A12,12,0,0,0,128,192ZM237.08,87A172.3,172.3,0,0,0,106,49.4a8,8,0,1,0,2,15.87A158.33,158.33,0,0,1,128,64a156.25,156.25,0,0,1,98.92,35.37A8,8,0,0,0,237.08,87ZM195,135.31a8,8,0,0,0,11.24-1.3,8,8,0,0,0-1.3-11.24,124.25,124.25,0,0,0-51.73-24.2A8,8,0,1,0,150,114.24,108.12,108.12,0,0,1,195,135.31Z"
            ></path>
          </svg>
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-white text-base font-medium leading-normal line-clamp-1">Network Scan Completed</p>
          <p className="text-[#9caaba] text-sm font-normal leading-normal line-clamp-2">Completed a network scan on target IP: 192.168.1.100</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4 bg-[#111418] px-4 min-h-[72px] py-2">
        <div className="text-white flex items-center justify-center rounded-lg bg-[#283039] shrink-0 size-12" data-icon="Bug" data-size="24px" data-weight="regular">
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path
              d="M144,92a12,12,0,1,1,12,12A12,12,0,0,1,144,92ZM100,80a12,12,0,1,0,12,12A12,12,0,0,0,100,80Zm116,64A87.76,87.76,0,0,1,213,167l22.24,9.72A8,8,0,0,1,232,192a7.89,7.89,0,0,1-3.2-.67L207.38,182a88,88,0,0,1-158.76,0L27.2,191.33A7.89,7.89,0,0,1,24,192a8,8,0,0,1-3.2-15.33L43,167A87.76,87.76,0,0,1,40,144v-8H16a8,8,0,0,1,0-16H40v-8a87.76,87.76,0,0,1,3-23L20.8,79.33a8,8,0,1,1,6.4-14.66L48.62,74a88,88,0,0,1,158.76,0l21.42-9.36a8,8,0,0,1,6.4,14.66L213,89.05a87.76,87.76,0,0,1,3,23v8h24a8,8,0,0,1,0,16H216ZM56,120H200v-8a72,72,0,0,0-144,0Zm64,95.54V136H56v8A72.08,72.08,0,0,0,120,215.54ZM200,144v-8H136v79.54A72.08,72.08,0,0,0,200,144Z"
            ></path>
          </svg>
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-white text-base font-medium leading-normal line-clamp-1">Vulnerability Found</p>
          <p className="text-[#9caaba] text-sm font-normal leading-normal line-clamp-2">Discovered a vulnerability in the scan results.</p>
        </div>
      </div>
      
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Key Metrics</h2>
      
      <div className="flex flex-wrap gap-4 p-4">
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#3b4754]">
          <p className="text-white text-base font-medium leading-normal">Successful Scans</p>
          <p className="text-white tracking-light text-2xl font-bold leading-tight">{stats.successfulScans}</p>
        </div>
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#3b4754]">
          <p className="text-white text-base font-medium leading-normal">Vulnerabilities Found</p>
          <p className="text-white tracking-light text-2xl font-bold leading-tight">{stats.vulnerabilitiesFound}</p>
        </div>
      </div>
      
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Projects</h2>
      <div className="p-4">
        <button onClick={handleCreate} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create Project</button>
        {loading ? (
          <div className="text-gray-400">Loading projects...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : (!Array.isArray(projects) || projects.length === 0) ? (
          <div className="text-gray-400">No projects found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.isArray(projects) && projects.map(project => (
              <div key={project.id} className="bg-gray-800 rounded-lg border border-gray-700 p-4 flex flex-col gap-2">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{project.name}</h3>
                  <p className="text-gray-400">{project.description}</p>
                  <p className="text-xs text-gray-500">Created: {project.created_at || project.createdAt}</p>
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleView(project.id)} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">View</button>
                  <button onClick={() => handleEdit(project)} className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700">Edit</button>
                  <button onClick={() => handleDelete(project.id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
        <ProjectFormModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleModalSubmit}
          project={editProject}
        />
      </div>
      
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">System Status</h2>
      
      <div className="flex items-center gap-4 bg-[#111418] px-4 min-h-14">
        <div className="text-white flex items-center justify-center rounded-lg bg-[#283039] shrink-0 size-10" data-icon="CheckCircle" data-size="24px" data-weight="regular">
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path
              d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"
            ></path>
          </svg>
        </div>
        <p className="text-white text-base font-normal leading-normal flex-1 truncate">System Online</p>
      </div>
      
      <div className="flex items-center gap-4 bg-[#111418] px-4 min-h-14">
        <div className="text-white flex items-center justify-center rounded-lg bg-[#283039] shrink-0 size-10" data-icon="Database" data-size="24px" data-weight="regular">
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path
              d="M128,24C74.17,24,32,48.6,32,80v96c0,31.4,42.17,56,96,56s96-24.6,96-56V80C224,48.6,181.83,24,128,24Zm80,104c0,9.62-7.88,19.43-21.61,26.92C170.93,163.35,150.19,168,128,168s-42.93-4.65-58.39-13.08C55.88,147.43,48,137.62,48,128V111.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64ZM69.61,53.08C85.07,44.65,105.81,40,128,40s42.93,4.65,58.39,13.08C200.12,60.57,208,70.38,208,80s-7.88,19.43-21.61,26.92C170.93,115.35,150.19,120,128,120s-42.93-4.65-58.39-13.08C55.88,99.43,48,89.62,48,80S55.88,60.57,69.61,53.08ZM186.39,202.92C170.93,211.35,150.19,216,128,216s-42.93-4.65-58.39-13.08C55.88,195.43,48,185.62,48,176V159.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64V176C208,185.62,200.12,195.43,186.39,202.92Z"
            ></path>
          </svg>
        </div>
        <p className="text-white text-base font-normal leading-normal flex-1 truncate">Database Connected</p>
      </div>
      
      <div className="flex items-center gap-4 bg-[#111418] px-4 min-h-14">
        <div className="text-white flex items-center justify-center rounded-lg bg-[#283039] shrink-0 size-10" data-icon="Robot" data-size="24px" data-weight="regular">
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path
              d="M200,48H136V16a8,8,0,0,0-16,0V48H56A32,32,0,0,0,24,80V192a32,32,0,0,0,32,32H200a32,32,0,0,0,32-32V80A32,32,0,0,0,200,48Zm16,144a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V80A16,16,0,0,1,56,64H200a16,16,0,0,1,16,16Zm-52-56H92a28,28,0,0,0,0,56h72a28,28,0,0,0,0-56Zm-28,16v24H120V152ZM80,164a12,12,0,0,1,12-12h12v24H92A12,12,0,0,1,80,164Zm84,12H152V152h12a12,12,0,0,1,0,24ZM72,108a12,12,0,1,1,12,12A12,12,0,0,1,72,108Zm88,0a12,12,0,1,1,12,12A12,12,0,0,1,160,108Z"
            ></path>
          </svg>
        </div>
        <p className="text-white text-base font-normal leading-normal flex-1 truncate">AI Assistant Active</p>
      </div>
    </Layout>
  )
}

export default Dashboard 