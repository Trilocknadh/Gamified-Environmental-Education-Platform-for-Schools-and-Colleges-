import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book, FileText, Video, Download, Search, 
  Filter, GraduationCap, ChevronRight, Bookmark, 
  ExternalLink, Layers, LayoutGrid, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const GRADES = [
  { id: '6', label: 'Class 6', icon: Book, color: 'text-emerald-400' },
  { id: '7', label: 'Class 7', icon: Book, color: 'text-blue-400' },
  { id: '8', label: 'Class 8', icon: Book, color: 'text-indigo-400' },
  { id: '9', label: 'Class 9', icon: GraduationCap, color: 'text-purple-400' },
  { id: '10', label: 'Class 10', icon: GraduationCap, color: 'text-pink-400' },
  { id: '11', label: 'Class 11', icon: Shield, color: 'text-rose-400' },
  { id: '12', label: 'Class 12', icon: Shield, color: 'text-orange-400' },
  { id: 'BTech', label: 'B.Tech', icon: Zap, color: 'text-yellow-400' },
  { id: 'Degree', label: 'Degree', icon: Library, color: 'text-teal-400' }
];

// Fallback Icons
import { Shield, Zap, Library } from 'lucide-react';

interface MaterialItem {
  _id: string;
  title: string;
  description: string;
  subject: string;
  gradeLevel: string;
  type: string;
  fileUrl: string;
  thumbnail: string;
}

const Materials = ({ category }: { category?: string }) => {
  const isLibrary = !category;
  const [selectedGrade, setSelectedGrade] = useState(isLibrary ? 'All' : '10');
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMaterials();
  }, [selectedGrade, activeType, category, searchTerm]);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      let url = '/materials?';
      if (selectedGrade !== 'All') url += `gradeLevel=${selectedGrade}&`;
      if (activeType !== 'All') url += `type=${activeType}&`;
      if (category) url += `category=${category === 'eco' ? 'Eco' : 'Academic'}&`;
      
      const { data } = await api.get(url);
      
      // Client-side search for smoother UX
      const filteredData = data.filter((item: MaterialItem) => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setMaterials(filteredData);
    } catch (error: any) {
      console.error('Fetch materials error:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
      } else {
        toast.error('Failed to fetch library resources');
      }
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText className="text-red-400" />;
      case 'Video': return <Video className="text-blue-400" />;
      default: return <Book className="text-emerald-400" />;
    }
  };

  const isEco = category === 'eco';

  return (
    <div className={`min-h-screen ${category ? 'pt-4' : 'pt-24'} bg-transparent`}>
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/academic/overview')}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-400 transition-colors font-black text-[10px] uppercase tracking-[0.2em] group mb-8"
        >
          <div className="p-2 rounded-full bg-slate-900 border border-slate-800 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 transition-all">
            <ArrowLeft size={16} />
          </div>
          Back to Nexus
        </motion.button>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className={`flex items-center gap-2 mb-3 ${isEco ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-blue-400 border-blue-500/20 bg-blue-500/5'} font-bold tracking-widest text-xs uppercase border px-3 py-1 rounded-full w-fit`}>
              <Layers size={14} className="animate-pulse" /> {isEco ? 'Eco Awareness Library' : 'Global Knowledge Library'}
            </div>
            <h1 className="text-5xl font-black text-glow tracking-tighter">
              {isEco ? 'Environment Hub' : 'Academic Hub'}
            </h1>
            <p className="text-slate-400 mt-2 text-lg">
              {isEco ? 'Explore sustainability articles and environmental studies' : 'Curated study materials for every educational milestone'}
            </p>
          </div>
  
          {/* Grade Quick Selector - Hidden in Library Mode as per request */}
          {!isLibrary && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
               {GRADES.map((grade) => (
                 <button
                   key={grade.id}
                   onClick={() => setSelectedGrade(grade.id)}
                   className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${
                     selectedGrade === grade.id 
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20' 
                      : 'bg-slate-800/40 text-slate-400 border-slate-700/50 hover:border-emerald-500/30'
                   }`}
                 >
                   {grade.label}
                 </button>
               ))}
            </div>
          )}
        </div>
  
        {/* Filters and Search Area */}
        <div className={`flex flex-col ${isLibrary ? 'items-center space-y-8' : 'md:flex-row items-center justify-between gap-6'} mb-10`}>
           {!isLibrary && (
             <div className="flex flex-wrap items-center gap-3 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 w-full md:w-fit justify-center">
                <div className="flex items-center gap-1">
                  {['All', 'Note', 'PDF', 'Video'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setActiveType(type)}
                      className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        activeType === type 
                          ? 'bg-slate-800 text-emerald-400 shadow-inner' 
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
             </div>
           )}
  
           <div className={`relative ${isLibrary ? 'w-full max-w-2xl' : 'w-full md:w-96'} group`}>
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder={isLibrary ? "Search through global repository..." : "Search textbooks, notes, chapters..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full bg-slate-900/40 border border-slate-800 rounded-3xl ${isLibrary ? 'py-5 pl-16 pr-6 text-lg' : 'py-3.5 pl-12 pr-4'} focus:outline-none focus:border-emerald-500/50 transition-all text-slate-200 placeholder:text-slate-600`}
              />
           </div>
        </div>

        {/* Materials Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="glass-card h-64 animate-pulse bg-slate-800/20" />
            ))}
          </div>
        ) : materials.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-32 text-center glass-card border-dashed"
          >
            <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Filter className="text-slate-600 w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-400">No resources found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your filters or checking a different class level.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {materials.map((item, idx) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass-card group hover:border-emerald-500/30 transition-all flex flex-col overflow-hidden"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={item.thumbnail} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-100" 
                      alt={item.title} 
                    />
                    <div className="absolute top-4 right-4 h-8 w-8 bg-slate-900/80 backdrop-blur-md rounded-full flex items-center justify-center border border-slate-700/50 text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer">
                      <Bookmark size={16} />
                    </div>
                    <div className="absolute bottom-4 left-4 flex gap-2">
                       <span className="bg-slate-900/90 backdrop-blur-md text-emerald-400 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider border border-emerald-500/20">
                         {item.type}
                       </span>
                    </div>
                  </div>

                  <div className="p-5 flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{item.subject}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-2 leading-tight mb-3">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 text-xs line-clamp-2 italic mb-4 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="p-5 pt-0 mt-auto">
                    <a 
                      href={item.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full bg-slate-800/80 hover:bg-emerald-500 text-slate-300 hover:text-slate-950 px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border border-slate-700 hover:border-emerald-400"
                    >
                      {item.type === 'Video' ? 'Watch Now' : 'Access Library'} <ExternalLink size={16} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Class Roadmap Helper */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mt-20 p-8 glass-card border-emerald-500/10 flex flex-col md:flex-row items-center justify-between gap-8"
      >
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
              <GraduationCap className="text-emerald-400 w-8 h-8" />
           </div>
           <div>
              <h4 className="text-xl font-bold text-slate-100">Unlock your potential in Class {selectedGrade}</h4>
              <p className="text-slate-400 text-sm">Need deep dives? Connect with teachers for personalized resources.</p>
           </div>
        </div>
        <button className="bg-slate-800 hover:bg-slate-700 text-emerald-400 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all">
           Request Material <PlusCircle size={18} />
        </button>
      </motion.div>
    </div>
  );
};

// Quick Helper Icon
import { PlusCircle } from 'lucide-react';

export default Materials;
