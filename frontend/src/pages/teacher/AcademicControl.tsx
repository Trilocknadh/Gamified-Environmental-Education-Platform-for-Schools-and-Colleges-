import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit3, Trash2, 
  HelpCircle, FileText, 
  Video
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import QuizModal from '../../components/Teacher/QuizModal';
import MaterialModal from '../../components/Teacher/MaterialModal';
import { Quiz, Material } from '../../types';

const AcademicControl = () => {
  const [activeTab, setActiveTab] = useState('quizzes');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'quizzes') {
        const { data } = await api.get('/quizzes');
        setQuizzes(data);
      } else {
        const { data } = await api.get('/materials');
        setMaterials(data);
      }
    } catch (error) {
      toast.error(`Failed to load ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    if (!window.confirm('Delete this quiz?')) return;
    try {
      await api.delete(`/quizzes/${id}`);
      setQuizzes(quizzes.filter(q => q._id !== id));
      toast.success('Quiz deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const tabs = [
    { id: 'quizzes', label: 'Quizzes', icon: HelpCircle },
    { id: 'materials', label: 'Materials', icon: FileText },
  ];

  return (
    <div className="space-y-8 relative p-4 pt-24">
      <AnimatePresence>
        {showQuizModal && (
          <QuizModal 
            quiz={selectedQuiz}
            onClose={() => {
              setShowQuizModal(false);
              setSelectedQuiz(null);
            }} 
            onSuccess={fetchData} 
          />
        )}
        {showMaterialModal && (
          <MaterialModal 
            onClose={() => setShowMaterialModal(false)} 
            onSuccess={fetchData} 
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter italic">Academic <span className="text-blue-500">Hub</span></h2>
          <p className="text-xs text-slate-500 uppercase font-black tracking-widest mt-1">Control learning content</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="flex items-center bg-slate-900 shadow-inner p-1 rounded-2xl border border-white/[0.05]">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === tab.id ? 'bg-blue-500 text-slate-950 shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-200'
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
           </div>
           
           <button 
             onClick={() => activeTab === 'quizzes' ? setShowQuizModal(true) : setShowMaterialModal(true)}
             className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-400 text-slate-950 font-black rounded-2xl transition-all shadow-lg shadow-blue-500/20"
           >
              <Plus size={18} /> Add New
           </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[1,2,3].map(_ => <div key={_} className="glass-card h-64 animate-pulse" />)}
          </motion.div>
        ) : activeTab === 'quizzes' ? (
          <motion.div 
            key="quizzes"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="glass-card p-6 border-white/[0.05] relative group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
                    {quiz.subject}
                  </span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button 
                       onClick={() => {
                         setSelectedQuiz(quiz);
                         setShowQuizModal(true);
                       }}
                       className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/5 rounded-lg transition-all"
                     >
                       <Edit3 size={14} />
                     </button>
                     <button onClick={() => handleDeleteQuiz(quiz._id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all"><Trash2 size={14} /></button>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 leading-tight">{quiz.title}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-500 font-bold mt-4">
                  <div className="flex items-center gap-1"><HelpCircle size={14} /> {quiz.questions?.length || 0} Questions</div>
                  <div className="flex items-center gap-1 text-emerald-400"><Plus size={14} /> {quiz.rewardXP} XP</div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                   <div className="text-[10px] text-slate-600 uppercase font-black tracking-widest">{quiz.gradeLevel || 'Global'}</div>
                   <div className="text-[10px] text-slate-700 font-bold">{new Date(quiz.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="materials"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {materials.map((mat) => (
              <div key={mat._id} className="glass-card overflow-hidden border-white/[0.05] group">
                <div className="aspect-video relative overflow-hidden bg-slate-950">
                   {mat.thumbnail && <img src={mat.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" alt="" />}
                   <div className="absolute top-3 left-3 px-2 py-1 bg-blue-500 text-slate-950 text-[10px] font-black rounded uppercase">
                      {mat.category}
                   </div>
                </div>
                <div className="p-6">
                  <h3 className="text-md font-bold text-white mb-2 truncate">{mat.title}</h3>
                  <div className="flex items-center justify-between mt-4">
                     <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                        {mat.type === 'PDF' ? <FileText size={12} /> : <Video size={12} />} {mat.type}
                     </span>
                     <div className="flex gap-2">
                        <button className="p-2 text-slate-400 hover:text-red-400 transition-all"><Trash2 size={14} /></button>
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AcademicControl;
