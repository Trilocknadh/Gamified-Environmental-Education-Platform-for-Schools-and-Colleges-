import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  MessageSquare, 
  HelpCircle, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  ChevronRight,
  LifeBuoy,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

import { useNavigate } from 'react-router-dom';

type ViewType = 'general' | 'support' | 'suggestion';

const Feedback = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<ViewType>('general');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'Query',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { id: 'Query', icon: HelpCircle, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 'Suggestion', icon: Info, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 'Complaint', icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let subject = '';
    let message = '';

    if (activeView === 'general') {
      if (!formData.subject || !formData.message) return toast.error('Please fill in all fields');
      subject = `[${formData.category}] ${formData.subject}`;
      message = formData.message;
    } else if (activeView === 'support') {
      if (!formData.name || !formData.email || !formData.message) return toast.error('Please fill in all fields');
      subject = `[ACADEMIC SUPPORT] Request from ${formData.name}`;
      message = `Problem: ${formData.message}\nEmail: ${formData.email}`;
    } else if (activeView === 'suggestion') {
       if (!formData.name || !formData.message) return toast.error('Please fill in required fields');
       subject = `[COMMUNITY SUGGESTION] From ${formData.name}`;
       message = formData.message;
    }

    setLoading(true);
    try {
      await api.post('/feedback', { subject, message });
      setSubmitted(true);
      toast.success('Dispatched to mentors!');
    } catch (error) {
      toast.error('Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setActiveView('general');
    setFormData({ name: '', email: '', subject: '', category: 'Query', message: '' });
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto border border-emerald-500/20"
        >
          <CheckCircle2 className="text-emerald-400 w-12 h-12" />
        </motion.div>
        <div className="space-y-3">
           <h2 className="text-4xl font-black text-white italic">Message Received!</h2>
           <p className="text-slate-400 text-lg">Your submission has been dispatched to our mentors. We'll get back to you soon.</p>
        </div>
        <button 
          onClick={resetForm}
          className="px-10 py-4 bg-slate-800 text-slate-200 font-bold rounded-2xl hover:bg-slate-700 transition-all border border-slate-700"
        >
          Return to Hub
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Smart Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => {
          if (activeView !== 'general') {
            setActiveView('general');
          } else {
            navigate('/dashboard');
          }
        }}
        className="flex items-center gap-2 text-slate-500 hover:text-emerald-400 transition-colors font-black text-[10px] uppercase tracking-[0.2em] group"
      >
        <div className="p-2 rounded-full bg-slate-900 border border-slate-800 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 transition-all">
          <ArrowLeft size={16} />
        </div>
        {activeView === 'general' ? 'Return Home' : 'Back to Hub'}
      </motion.button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Left Column: Info & Selection */}
        <div className="space-y-8">
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter italic mb-4">Support Hub</h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Have a question about a mission? Found a bug? Or just want to share an idea? Our mentors are here to help you grow.
            </p>
          </div>

          <div className="space-y-4">
             <button 
                onClick={() => setActiveView('support')}
                className={`w-full text-left glass-card p-6 border transition-all flex items-center gap-4 group ${activeView === 'support' ? 'bg-blue-500/10 border-blue-500/40 translate-x-2' : 'border-slate-800 hover:border-blue-500/20'}`}
             >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${activeView === 'support' ? 'bg-blue-500 text-slate-950' : 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-slate-950'}`}>
                   <LifeBuoy />
                </div>
                <div>
                   <h4 className="font-bold text-slate-100 italic text-sm">24/7 Academic Support</h4>
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Response within 24 hours</p>
                </div>
                <ChevronRight size={16} className="ml-auto text-slate-700 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
             </button>

             <button 
                onClick={() => setActiveView('suggestion')}
                className={`w-full text-left glass-card p-6 border transition-all flex items-center gap-4 group ${activeView === 'suggestion' ? 'bg-emerald-500/10 border-emerald-500/40 translate-x-2' : 'border-slate-800 hover:border-emerald-500/20'}`}
             >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${activeView === 'suggestion' ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950'}`}>
                   <Sparkles />
                </div>
                <div>
                   <h4 className="font-bold text-slate-100 italic text-sm">Community Suggestions</h4>
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Help us build the future</p>
                </div>
                <ChevronRight size={16} className="ml-auto text-slate-700 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
             </button>
          </div>

          <div className="p-8 glass-card bg-slate-900/50 border-dashed border-slate-800">
             <h5 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Frequently Asked</h5>
             <div className="space-y-3">
                {['How to earn level 5?', 'Missing mission rewards?', 'Academic path details'].map((faq, i) => (
                   <div key={i} className="flex items-center justify-between text-xs font-bold text-slate-400 hover:text-emerald-400 cursor-pointer group transition-colors">
                      {faq} <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                   </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Column: Dynamic Form */}
        <div className="relative min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeView === 'general' && (
              <motion.div 
                key="general"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card p-10 relative overflow-hidden"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-xl font-black text-white italic">General Inquiry</h3>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
                    <div className="grid grid-cols-3 gap-3">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setFormData({...formData, category: cat.id})}
                          className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                            formData.category === cat.id ? 'bg-slate-900 border-emerald-400/50' : 'bg-slate-950/50 border-slate-800 text-slate-600'
                          }`}
                        >
                          <cat.icon size={18} className={formData.category === cat.id ? cat.color : 'text-slate-700'} />
                          <span className="text-[9px] font-black mt-2 uppercase tracking-tighter">{cat.id}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Subject</label>
                    <input 
                      type="text" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      placeholder="Summary..." className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:outline-none focus:border-red-500 transition-all placeholder:text-slate-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Detailed Message</label>
                    <textarea 
                      value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="How can we help?" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:outline-none focus:border-emerald-500 min-h-[120px] resize-none"
                    />
                  </div>
                  <button type="submit" disabled={loading} className="w-full h-16 bg-emerald-500 text-slate-950 font-black rounded-2xl hover:bg-emerald-400 transition-all shadow-xl flex items-center justify-center gap-3">
                    {loading ? <div className="w-6 h-6 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" /> : <>Dispatch Message <Send size={18} /></>}
                  </button>
                </form>
              </motion.div>
            )}

            {activeView === 'support' && (
              <motion.div 
                key="support"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card p-10 border-blue-500/20"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-white italic flex items-center gap-2">
                    <LifeBuoy className="text-blue-400" size={20} /> Academic Support
                  </h3>
                  <button onClick={() => setActiveView('general')} className="p-2 hover:bg-slate-800 rounded-full text-slate-500 transition-colors"><ArrowLeft size={16}/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-blue-500 outline-none" placeholder="Your Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Gmail Account</label>
                    <input 
                      type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-blue-500 outline-none" placeholder="example@gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Describe Problem</label>
                    <textarea 
                      value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-blue-500 min-h-[120px] outline-none" placeholder="Explain the technical or academic issue..."
                    />
                  </div>
                  <button type="submit" disabled={loading} className="w-full h-16 bg-blue-500 text-slate-950 font-black rounded-2xl hover:bg-blue-400 transition-all shadow-xl flex items-center justify-center gap-3">
                    {loading ? <div className="w-6 h-6 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" /> : <>Report Problem <Send size={18} /></>}
                  </button>
                </form>
              </motion.div>
            )}

            {activeView === 'suggestion' && (
              <motion.div 
                key="suggestion"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card p-10 border-emerald-500/20"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-white italic flex items-center gap-2">
                    <Sparkles className="text-emerald-400" size={20} /> Community Suggestion
                  </h3>
                  <button onClick={() => setActiveView('general')} className="p-2 hover:bg-slate-800 rounded-full text-slate-500 transition-colors"><ArrowLeft size={16}/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Your Name</label>
                    <input 
                      type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-emerald-500 outline-none" placeholder="Enter name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Your Suggestion</label>
                    <textarea 
                      value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-emerald-500 min-h-[150px] outline-none" placeholder="How can we make EcoEdu better?"
                    />
                  </div>
                  <button type="submit" disabled={loading} className="w-full h-16 bg-emerald-500 text-slate-950 font-black rounded-2xl hover:bg-emerald-400 transition-all shadow-xl flex items-center justify-center gap-3">
                    {loading ? <div className="w-6 h-6 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" /> : <>Submit Idea <Send size={18} /></>}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Feedback;

