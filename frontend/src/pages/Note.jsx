import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { notesAPI, apiUtils } from '../services/api';

const Note = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await notesAPI.getNotes();
      setNotes(response.data);
    } catch (err) {
      setError(apiUtils.handleError(err).message);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setSaving(true);
    setError(null);
    
    try {
      const noteData = { title: title.trim(), content: content.trim() };
      
      if (editingId) {
        await notesAPI.updateNote(editingId, noteData);
      } else {
        await notesAPI.createNote(noteData);
      }
      
      setTitle('');
      setContent('');
      setEditingId(null);
      await fetchNotes();
    } catch (err) {
      setError(apiUtils.handleError(err).message);
    }
    setSaving(false);
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content || '');
    setEditingId(note.id);
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await notesAPI.deleteNote(noteId);
      await fetchNotes();
    } catch (err) {
      setError(apiUtils.handleError(err).message);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setEditingId(null);
    setError(null);
  };

  return (
    <Layout>
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">Notes</p>
      </div>
      
      {error && (
        <div className="mx-4 mb-4 p-3 bg-red-900 border border-red-700 rounded-lg text-red-200">
          {error}
        </div>
      )}
      
      {/* Note Form */}
      <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
        <label className="flex flex-col min-w-40 flex-1">
          <input
            placeholder="Note Title"
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#283039] focus:border-none h-14 placeholder:text-[#9caaba] p-4 text-base font-normal leading-normal"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </label>
      </div>
      <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
        <label className="flex flex-col min-w-40 flex-1">
          <textarea
            placeholder="Note Content"
            className="form-input flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#283039] focus:border-none h-32 placeholder:text-[#9caaba] p-4 text-base font-normal leading-normal"
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </label>
      </div>
      <div className="flex px-4 py-3 justify-start gap-2">
        <button
          onClick={handleSave}
          disabled={saving || !title.trim()}
          className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-300 hover:scale-105 ${
            saving || !title.trim() 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-[#0b79ee] hover:bg-[#0a6bc7]'
          }`}
        >
          <span className="truncate">{saving ? 'Saving...' : editingId ? 'Update Note' : 'Save Note'}</span>
        </button>
        {editingId && (
          <button
            onClick={handleCancel}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-gray-600 hover:bg-gray-700 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-300 hover:scale-105"
          >
            <span className="truncate">Cancel</span>
          </button>
        )}
      </div>
      
      {/* Notes List */}
      <div className="px-4 py-3">
        <h3 className="text-white text-lg font-bold mb-4">Saved Notes</h3>
        {loading ? (
          <div className="text-gray-400">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="text-gray-400">No notes found. Create your first note above.</div>
        ) : (
          <div className="space-y-3">
            {notes.map(note => (
              <div key={note.id} className="bg-[#283039] rounded-lg p-4 border border-[#3b4754]">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-semibold text-lg">{note.title}</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(note)}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="text-red-400 hover:text-red-300 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {note.content && (
                  <p className="text-gray-300 whitespace-pre-wrap mb-3">{note.content}</p>
                )}
                <div className="text-xs text-gray-500">
                  Created: {new Date(note.created_at).toLocaleString()}
                  {note.updated_at !== note.created_at && (
                    <span> • Updated: {new Date(note.updated_at).toLocaleString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Note; 