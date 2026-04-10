import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  TreePine,
  Wind,
  Droplets,
  BookOpen,
  PlayCircle,
  FileText,
  ChevronRight,
  CheckCircle2,
  Lock,
  ExternalLink,
  Bookmark,
  LayoutGrid,
  Download,
  Video,
  Eye,
  Globe,
  Leaf,
  Recycle,
  ArrowLeft
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const ECO_CONFIG = [
  { 
    id: 'climate-science', 
    name: 'Climate Science', 
    icon: Globe, 
    color: 'rose',
    description: 'Understand global warming, atmospheric changes, and renewable energy solutions.',
    chapters: [
      { id: 'ec1', title: 'The Greenhouse Effect', status: 'completed', duration: '30m', mediaUrl: 'https://ncert.nic.in/textbook/pdf/jess101.pdf' },
      { id: 'ec2', title: 'Global Warming Impacts', status: 'current', duration: '45m', mediaUrl: 'https://ncert.nic.in/textbook/pdf/jess105.pdf' },
      { id: 'ec3', title: 'Carbon Footprint Analysis', status: 'locked', duration: '40m', mediaUrl: 'https://ncert.nic.in/textbook/pdf/jess101.pdf' },
    ]
  },
  { 
    id: 'biodiversity', 
    name: 'Biodiversity', 
    icon: Leaf, 
    color: 'emerald',
    description: 'Explore the variety of life on Earth and strategies for conservation.',
    chapters: [
      { id: 'eb1', title: 'Forests & Wildlife', status: 'completed', duration: '35m', mediaUrl: 'https://ncert.nic.in/textbook/pdf/jess102.pdf' },
      { id: 'eb2', title: 'Endangered Species Protection', status: 'current', duration: '50m', mediaUrl: 'https://ncert.nic.in/textbook/pdf/jess102.pdf' },
      { id: 'eb3', title: 'Ecosystem Restoration', status: 'locked', duration: '55m', mediaUrl: 'https://ncert.nic.in/textbook/pdf/jess102.pdf' },
    ]
  },
  { 
    id: 'sustainability', 
    name: 'Sustainable Living', 
    icon: Recycle, 
    color: 'blue',
    description: 'Practice waste management, water conservation, and eco-friendly habits.',
    chapters: [
      { id: 'es1', title: 'Waste Management Basics', status: 'current', duration: '40m', mediaUrl: 'https://ncert.nic.in/textbook/pdf/jess106.pdf' },
      { id: 'es2', title: 'Water Resource Management', status: 'locked', duration: '30m', mediaUrl: 'https://ncert.nic.in/textbook/pdf/jess103.pdf' },
      { id: 'es3', title: 'Sustainable Agriculture', status: 'locked', duration: '45m', mediaUrl: 'https://ncert.nic.in/textbook/pdf/jess104.pdf' },
    ]
  }
];

const EcoMaterials = () => {
  const [subjects, setSubjects] = useState(ECO_CONFIG);
  const [activeSubjectId, setActiveSubjectId] = useState(ECO_CONFIG[0].id);
  const selectedSubject = subjects.find(s => s.id === activeSubjectId) || subjects[0];
  
  const [materials, setMaterials] = useState<any[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const navigate = useNavigate();

  const handleToggleComplete = (chapterId: string) => {
    const newSubjects = [...subjects];
    const subjectIndex = newSubjects.findIndex(s => s.id === activeSubjectId);
    if (subjectIndex === -1) return;

    const chapterIndex = newSubjects[subjectIndex].chapters.findIndex(c => c.id === chapterId);
    if (chapterIndex === -1) return;

    // Mark current as completed
    newSubjects[subjectIndex].chapters[chapterIndex].status = 'completed';

    // Unlock next if it's locked
    const nextChapter = newSubjects[subjectIndex].chapters[chapterIndex + 1];
    if (nextChapter && nextChapter.status === 'locked') {
      nextChapter.status = 'current';
    }

    setSubjects(newSubjects);
    toast.success('Chapter completed! Next path unlocked.');
  };

  useEffect(() => {
    const fetchMaterials = async () => {
      setLoadingMaterials(true);
      try {
        // Fetch materials based on the selected "Subject" name and "Eco" category
        const { data } = await api.get(`/materials?subject=${selectedSubject.name}&category=Eco`);
        setMaterials(data);
      } catch (error) {
        console.error('Failed to fetch materials:', error);
        toast.error('Could not load environmental materials');
      } finally {
        setLoadingMaterials(false);
      }
    };

    fetchMaterials();
  }, [selectedSubject]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/academic/overview')}
        className="flex items-center gap-2 text-slate-500 hover:text-emerald-400 transition-colors font-black text-[10px] uppercase tracking-[0.2em] group"
      >
        <div className="p-2 rounded-full bg-slate-900 border border-slate-800 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 transition-all">
          <ArrowLeft size={16} />
        </div>
        Back to Nexus
      </motion.button>

      {/* Subject Header */}
      <section className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/3 space-y-4">
          <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Study Track</h2>
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => setActiveSubjectId(subject.id)}
              className={`w-full p-6 rounded-3xl border transition-all flex items-center gap-4 group ${
                activeSubjectId === subject.id 
                  ? `bg-${subject.color}-500/10 border-${subject.color}-500/50 text-${subject.color}-400 shadow-lg shadow-${subject.color}-500/10` 
                  : 'bg-slate-800/20 border-slate-700/50 text-slate-400 hover:border-slate-600'
              }`}
            >
              <div className={`p-3 rounded-2xl bg-slate-900 border border-slate-700 group-hover:scale-110 transition-transform ${
                activeSubjectId === subject.id ? `text-${subject.color}-400 border-${subject.color}-500/30` : 'text-slate-500'
              }`}>
                <subject.icon size={24} />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-lg">{subject.name}</h4>
                <p className="text-[10px] uppercase tracking-widest font-black opacity-60">{subject.chapters.length} Chapters</p>
              </div>
            </button>
          ))}
        </div>

        <div className="flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSubject.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-10 relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-64 h-64 bg-${selectedSubject.color}-500/5 rounded-full -mr-32 -mt-32 blur-3xl`} />
              
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                <div className="max-w-xl">
                  <h1 className="text-5xl font-black tracking-tight text-white mb-4">
                    {selectedSubject.name}
                  </h1>
                  <p className="text-slate-400 text-lg leading-relaxed lowercase italic first-letter:uppercase">
                    {selectedSubject.description}
                  </p>
                </div>
              </div>

              {/* Chapters List */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Learning Path</h3>
                {selectedSubject.chapters.map((chapter, index) => (
                  <div 
                    key={chapter.id}
                    className={`group p-5 rounded-[2rem] border transition-all flex items-center justify-between ${
                      chapter.status === 'locked' 
                        ? 'bg-slate-900/50 border-slate-800 opacity-60' 
                        : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                        chapter.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 
                        chapter.status === 'current' ? `bg-${selectedSubject.color}-500/20 text-${selectedSubject.color}-400` : 
                        'bg-slate-900 text-slate-600'
                      }`}>
                        {chapter.status === 'completed' ? <CheckCircle2 size={24} /> : index + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-100 group-hover:text-white transition-colors">{chapter.title}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{chapter.duration} Read</span>
                          {chapter.status === 'current' && (
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded bg-${selectedSubject.color}-500/10 text-${selectedSubject.color}-400 uppercase tracking-widest`}>In Progress</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {chapter.status === 'locked' ? (
                        <div className="flex items-center gap-3">
                           <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Locked</span>
                           <Lock size={16} className="text-slate-700" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <a 
                            href={chapter.mediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                              chapter.status === 'completed' 
                                ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20' 
                                : `bg-${selectedSubject.color}-500 text-slate-950 hover:shadow-lg hover:shadow-${selectedSubject.color}-500/20`
                            }`}
                          >
                             {chapter.status === 'completed' ? 'Review Lesson' : 'Start Reading'} <BookOpen size={14} />
                          </a>
                          
                          {chapter.status === 'current' && (
                            <button
                              onClick={() => handleToggleComplete(chapter.id)}
                              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
                            >
                               Mark Done <CheckCircle2 size={14} />
                            </button>
                          )}
                        </div>
                      )}
                      <ChevronRight size={18} className="text-slate-700 group-hover:text-slate-400 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Related Materials Section */}
              <div className="mt-12 pt-12 border-t border-slate-800">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-${selectedSubject.color}-500/10 text-${selectedSubject.color}-400`}>
                      <LayoutGrid size={20} />
                    </div>
                    <h3 className="text-xl font-black text-white italic">Study Resources</h3>
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{materials.length} Materials Available</span>
                </div>

                {loadingMaterials ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2].map(i => (
                      <div key={i} className="h-40 rounded-3xl bg-slate-800/20 animate-pulse border border-slate-800/50" />
                    ))}
                  </div>
                ) : materials.length === 0 ? (
                  <div className="p-8 rounded-[2rem] border border-dashed border-slate-800 text-center">
                    <p className="text-slate-500 font-bold italic">No specialized resources found for this path yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {materials.map((item) => (
                      <motion.div
                        key={item._id}
                        whileHover={{ scale: 1.02 }}
                        className="glass-card p-5 group flex flex-col gap-4 border-slate-800/50 hover:border-emerald-500/30 transition-all"
                      >
                         <div className="flex justify-between items-start">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-800">
                                <img src={item.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-100 text-sm line-clamp-1 group-hover:text-emerald-400 transition-colors">{item.title}</h4>
                                <span className={`text-[9px] font-black uppercase tracking-[0.2em] text-${selectedSubject.color}-500`}>{item.type}</span>
                              </div>
                           </div>
                           <button className="text-slate-600 hover:text-emerald-400 transition-colors">
                              <Bookmark size={16} />
                           </button>
                         </div>
                         
                         <p className="text-[11px] text-slate-500 line-clamp-2 italic leading-relaxed">
                           {item.description}
                         </p>

                         {item.type === 'Video' && (item.fileUrl.includes('youtube.com') || item.fileUrl.includes('youtu.be')) ? (
                           <a 
                             href={item.fileUrl}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="mt-2 w-full py-2.5 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/30 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                           >
                              Watch on YouTube <ExternalLink size={12} />
                           </a>
                         ) : (
                           <div className="mt-2 grid grid-cols-2 gap-2">
                             <a 
                               href={item.fileUrl}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="py-2.5 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                             >
                                <Eye size={12} /> View
                             </a>
                             <a 
                               href={item.fileUrl}
                               download={item.title}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="py-2.5 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/30 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                               onClick={(e) => {
                                 if (item.fileUrl === '#') {
                                   e.preventDefault();
                                   toast.success('Download started: ' + item.title);
                                 }
                               }}
                             >
                                <Download size={12} /> Get
                             </a>
                           </div>
                         )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default EcoMaterials;
