import React, { useState, useEffect } from 'react';
import { Plus, Book, Link as LinkIcon, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const MaterialsTab = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: 'General',
    gradeLevel: '10',
    type: 'Note',
    fileUrl: ''
  });

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const { data } = await api.get('/materials');
      setMaterials(data);
    } catch (error) {
      toast.error('Failed to fetch materials');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/materials', formData);
      toast.success('Material added successfully!');
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        subject: 'General',
        gradeLevel: '10',
        type: 'Note',
        fileUrl: ''
      });
      fetchMaterials();
    } catch (error) {
      toast.error('Failed to add material');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;
    try {
      await api.delete(`/materials/${id}`);
      toast.success('Material deleted');
      fetchMaterials();
    } catch (error) {
      toast.error('Failed to delete material');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Class Notes & Resources</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl font-bold transition-all"
        >
          {showForm ? 'Cancel' : <><Plus size={18} /> Add Resource</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Title</label>
              <input 
                type="text" required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:border-emerald-500 outline-none"
                placeholder="e.g. Introduction to Renewable Energy"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Resource URL (PDF/Video Link)</label>
              <input 
                type="url" required
                value={formData.fileUrl}
                onChange={(e) => setFormData({...formData, fileUrl: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:border-emerald-500 outline-none"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Subject</label>
              <select 
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:border-emerald-500 outline-none"
              >
                {['Mathematics', 'Physics', 'Chemistry', 'Environmental Studies', 'Engineering', 'General'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Grade Level</label>
              <select 
                value={formData.gradeLevel}
                onChange={(e) => setFormData({...formData, gradeLevel: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:border-emerald-500 outline-none"
              >
                {['6', '7', '8', '9', '10', '11', '12', 'BTech', 'Degree'].map(g => (
                  <option key={g} value={g}>Grade {g}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Description</label>
            <textarea 
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:border-emerald-500 outline-none h-24"
              placeholder="Provide a brief description of this material..."
            />
          </div>
          <button type="submit" className="w-full bg-emerald-500 text-slate-950 font-bold py-3 rounded-xl hover:bg-emerald-400 transition-colors">
            Publish Resource
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          [1,2].map(i => <div key={i} className="glass-card h-32 animate-pulse" />)
        ) : materials.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-slate-500 italic">No resources added yet.</div>
        ) : (
          materials.map((m) => (
            <div key={m._id} className="glass-card p-5 group hover:border-emerald-500/50 transition-all flex justify-between items-start">
              <div className="flex gap-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl h-fit">
                   <Book size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors">{m.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full font-medium">Grade {m.gradeLevel}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded-full font-medium">{m.subject}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-1">{m.description}</p>
                  <a href={m.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-emerald-500 mt-3 hover:underline">
                    <LinkIcon size={12} /> View Material
                  </a>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(m._id)}
                className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                title="Delete Resource"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MaterialsTab;
