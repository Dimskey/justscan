import React, { useState, useEffect } from 'react'

const ProjectFormModal = ({ open, onClose, onSubmit, project }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    scope: ''
  })

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name || '',
        description: project.description || '',
        scope: project.scope || ''
      })
    } else {
      setForm({ name: '', description: '', scope: '' })
    }
  }, [project, open])

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    onSubmit(form)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">{project ? 'Edit Project' : 'Create Project'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Name</label>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none" />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none" />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Scope</label>
            <input name="scope" value={form.scope} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{project ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProjectFormModal 