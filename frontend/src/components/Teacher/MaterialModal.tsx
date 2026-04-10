import React, { useState } from 'react';
import { X, Upload, Save, FileText, Video as VideoIcon, Globe } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const MaterialModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: 'General',
    gradeLevel: 'Global',
    type: 'PDF',
    category: 'Academic'
  });
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('subject', formData.subject);
    data.append('gradeLevel', formData.gradeLevel);
    data.append('type', formData.type);
    data.append('category', formData.category);
    data.append('file', file);
    if (thumbnail) {
      data.append('thumbnail', thumbnail);
    }

    try {
      await api.post('/materials', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Material uploaded successfully!');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload material');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl glass-card border-white/[0.05] shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-white/[0.05] flex items-center justify-between bg-slate-900">
           <div>
              <h2 className="text-2xl font-black text-white tracking-tight italic">Upload <span className="text-blue-500">Resource</span></h2>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Share learning materials with students</p>
           </div>
           <button onClick={onClose} className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Resource Title</label>
              <input 
                type="text" required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-slate-950/50 border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none font-bold"
                placeholder="e.g. Quantum Physics Intro"
              />
           </div>

           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Subject</label>
                <select 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-slate-950/50 border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none font-bold"
                >
                  {['General', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Environmental Studies'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-slate-950/50 border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none font-bold"
                >
                  <option value="Academic">Academic</option>
                  <option value="Environmental">Environmental</option>
                </select>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Content Type</label>
                <div className="flex bg-slate-950/50 p-1 rounded-xl border border-white/[0.05]">
                   <button 
                     type="button"
                     onClick={() => setFormData({...formData, type: 'PDF'})}
                     className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${formData.type === 'PDF' ? 'bg-blue-500 text-slate-950' : 'text-slate-500'}`}
                   >
                     <FileText size={14} /> PDF
                   </button>
                   <button 
                     type="button"
                     onClick={() => setFormData({...formData, type: 'Video'})}
                     className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${formData.type === 'Video' ? 'bg-blue-500 text-slate-950' : 'text-slate-500'}`}
                   >
                     <VideoIcon size={14} /> Video
                   </button>
                </div>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Main File</label>
                 <div className="relative h-[46px]">
                    <input 
                      type="file" required
                      onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                      className="absolute inset-0 opacity-0 z-10 cursor-pointer"
                      accept={formData.type === 'PDF' ? '.pdf' : 'video/*'}
                    />
                    <div className="h-full bg-slate-950/50 border border-white/[0.05] rounded-xl flex items-center px-4 gap-2 text-xs font-bold text-slate-400">
                       <Upload size={14} /> {file ? file.name : 'Select File'}
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Thumbnail (Optional)</label>
              <div className="relative h-[46px]">
                <input 
                  type="file"
                  onChange={(e) => setThumbnail(e.target.files ? e.target.files[0] : null)}
                  className="absolute inset-0 opacity-0 z-10 cursor-pointer"
                  accept="image/*"
                />
                <div className="h-full bg-slate-950/50 border border-white/[0.05] rounded-xl flex items-center px-4 gap-2 text-xs font-bold text-slate-400">
                   <Globe size={14} /> {thumbnail ? thumbnail.name : 'Select Image'}
                </div>
              </div>
           </div>

           <div className="pt-6 border-t border-white/[0.05] flex justify-end gap-4">
              <button 
                type="button" onClick={onClose}
                className="px-6 py-2 text-slate-500 font-bold hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-8 py-3 bg-blue-500 hover:bg-blue-400 text-slate-950 font-black rounded-xl transition-all shadow-xl shadow-blue-500/20 flex items-center gap-3 disabled:opacity-50"
              >
                {loading ? <div className="w-5 h-5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" /> : <><Save size={18} /> Upload Resource</>}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
};

export default MaterialModal;
