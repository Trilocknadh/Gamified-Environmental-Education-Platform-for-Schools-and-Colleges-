import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Book, 
  Leaf, 
  GraduationCap, 
  Library, 
  ArrowRight,
  Sparkles,
  BookOpen,
  ArrowLeft
} from 'lucide-react';

const AcademicOverview = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Learning Subjects',
      desc: 'Deep dive into Mathematics, Physics, and Chemistry chapters.',
      path: '/academic/subjects',
      icon: GraduationCap,
      color: 'from-blue-500 to-cyan-500',
      badge: 'Interactive'
    },
    {
      title: 'Eco Materials',
      desc: 'Expert-curated resources on sustainability and climate action.',
      path: '/academic/eco-materials',
      icon: Leaf,
      color: 'from-emerald-500 to-teal-500',
      badge: 'Impact'
    },
    {
      title: 'Academic Materials',
      desc: 'Classic textbooks, notes, and preparation guides for exams.',
      path: '/academic/academic-materials',
      icon: Book,
      color: 'from-purple-500 to-fuchsia-500',
      badge: 'Study'
    },
    {
      title: 'Digital Library',
      desc: 'Access the global repository of educational videos and articles.',
      path: '/academic/library',
      icon: Library,
      color: 'from-orange-500 to-red-500',
      badge: 'Resource'
    }
  ];

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-slate-500 hover:text-emerald-400 transition-colors font-black text-[10px] uppercase tracking-[0.2em] group"
      >
        <div className="p-2 rounded-full bg-slate-900 border border-slate-800 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 transition-all">
          <ArrowLeft size={16} />
        </div>
        Return Home
      </motion.button>

      <header className="text-center md:text-left">
        <h1 className="text-5xl font-black text-white tracking-tighter italic mb-4">Academic Nexus</h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          Your portal to specialized knowledge. Choose a repository to begin your learning journey.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section, idx) => (
          <motion.div
            key={section.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => navigate(section.path)}
            className="glass-card p-1 items-start flex cursor-pointer group hover:border-white/20 transition-all overflow-hidden"
          >
            <div className="flex flex-col md:flex-row w-full h-full bg-slate-900/40 rounded-[2.8rem] overflow-hidden">
               <div className={`md:w-48 bg-gradient-to-br ${section.color} p-8 flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  <section.icon size={48} className="text-white relative z-10 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute -bottom-4 -right-4 opacity-10">
                     <section.icon size={120} className="text-white" />
                  </div>
               </div>
               <div className="flex-grow p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                     <span className="text-[10px] font-black bg-white/10 text-white px-2 py-1 rounded uppercase tracking-[0.2em]">{section.badge}</span>
                     <div className="h-[1px] flex-grow bg-white/10" />
                  </div>
                  <h3 className="text-3xl font-black text-white italic mb-3 group-hover:translate-x-2 transition-transform duration-500">{section.title}</h3>
                  <p className="text-slate-400 leading-relaxed mb-8">{section.desc}</p>
                  <div className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                     Open Terminal <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Tips or Featured */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-10 border-emerald-500/10 flex flex-col md:flex-row items-center gap-8 justify-between relative"
      >
        <div className="flex items-center gap-6">
           <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Sparkles className="text-emerald-400 w-10 h-10" />
           </div>
           <div>
              <h4 className="text-2xl font-black text-white italic">Did you know?</h4>
              <p className="text-slate-500">Eco-Warriors who complete 2 materials per week gain a 1.5x XP multiplier!</p>
           </div>
        </div>
        <button 
           onClick={() => navigate('/academic/subjects')}
           className="px-8 h-16 bg-emerald-500 text-slate-950 font-black rounded-2xl flex items-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          Resume Learning <BookOpen size={20} fill="currentColor" />
        </button>
      </motion.div>
    </div>
  );
};

export default AcademicOverview;
