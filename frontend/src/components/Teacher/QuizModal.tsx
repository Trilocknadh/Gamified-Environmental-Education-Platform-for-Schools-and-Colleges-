import React, { useState } from 'react';
import { X, Plus, Trash2, Save, HelpCircle } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const QuizModal = ({ onClose, onSuccess, quiz = null }) => {
  const [formData, setFormData] = useState({
    title: quiz?.title || '',
    subject: quiz?.subject || 'Mathematics',
    gradeLevel: quiz?.gradeLevel || '10',
    rewardXP: quiz?.rewardXP || 50,
    questions: quiz?.questions || [
      { question: '', options: ['', '', '', ''], correctAnswer: '' }
    ]
  });
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { question: '', options: ['', '', '', ''], correctAnswer: '' }]
    });
  };

  const removeQuestion = (index) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index][field] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const invalid = formData.questions.some(q => !q.question || q.options.some(o => !o) || !q.correctAnswer);
    if (invalid) {
      toast.error('Please fill in all questions and options');
      return;
    }

    setLoading(true);
    try {
      if (quiz?._id) {
        await api.put(`/quizzes/${quiz._id}`, formData);
        toast.success('Quiz updated successfully!');
      } else {
        await api.post('/quizzes', formData);
        toast.success('Quiz deployed successfully!');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(quiz?._id ? 'Failed to update quiz' : 'Failed to deploy quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-card border-white/[0.05] shadow-2xl animate-in zoom-in-95 duration-200 custom-scrollbar">
        <div className="sticky top-0 z-10 bg-slate-900 border-b border-white/[0.05] p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight italic">{quiz?._id ? 'Edit' : 'Create'} <span className="text-blue-500">Knowledge Quest</span></h2>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">{quiz?._id ? 'Update existing content' : 'Design a new student quiz'}</p>
            </div>
           <button onClick={onClose} className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2 lg:col-span-1">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Quiz Title</label>
                <input 
                  type="text" required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-950/50 border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none font-bold"
                  placeholder="e.g. Algebra Basics"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Subject</label>
                <select 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-slate-950/50 border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none font-bold"
                >
                  {['Mathematics', 'Physics', 'Chemistry', 'Environmental Studies'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Reward XP</label>
                <input 
                  type="number" required
                  value={formData.rewardXP}
                  onChange={(e) => setFormData({...formData, rewardXP: e.target.value})}
                  className="w-full bg-slate-950/50 border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none font-bold text-center"
                  min="1"
                />
              </div>
           </div>

           <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
                 <h3 className="text-lg font-black text-blue-400 flex items-center gap-2 italic">
                   <HelpCircle size={20} /> Question Bank ({formData.questions.length})
                 </h3>
              </div>

              {formData.questions.map((q, qIndex) => (
                <div key={qIndex} className="p-6 bg-white/[0.01] border border-white/[0.05] rounded-3xl space-y-6 relative group">
                  <div className="flex justify-between items-start gap-4">
                    <span className="bg-blue-500 text-slate-950 w-8 h-8 rounded-xl text-xs flex items-center justify-center font-black shrink-0 shadow-lg shadow-blue-500/20">
                      {qIndex + 1}
                    </span>
                    <textarea 
                      required
                      value={q.question}
                      onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                      className="flex-grow bg-transparent border-b border-white/[0.05] focus:border-blue-500/50 outline-none py-1 text-white font-bold h-12"
                      placeholder="Enter the question text here..."
                    />
                    {formData.questions.length > 1 && (
                      <button type="button" onClick={() => removeQuestion(qIndex)} className="text-slate-700 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-12">
                    {q.options.map((opt, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-4">
                        <input 
                          type="radio" 
                          name={`correct-${qIndex}`}
                          checked={q.correctAnswer === opt && opt !== ''}
                          onChange={() => handleQuestionChange(qIndex, 'correctAnswer', opt)}
                          disabled={opt === ''}
                          className="w-5 h-5 accent-blue-500 cursor-pointer"
                        />
                        <input 
                          type="text" required
                          value={opt}
                          onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                          className="flex-grow bg-slate-950/50 border border-white/[0.05] rounded-xl px-4 py-2 text-sm text-white focus:border-blue-500/50 outline-none"
                          placeholder={`Distractor Option ${oIndex + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <button 
                type="button" 
                onClick={addQuestion}
                className="w-full py-6 border-2 border-dashed border-white/[0.05] rounded-3xl text-slate-500 hover:text-blue-400 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3"
              >
                <Plus size={20} /> Add Next Question
              </button>
           </div>

           <div className="sticky bottom-0 bg-slate-900/80 backdrop-blur-3xl p-6 -mx-8 -mb-8 border-t border-white/[0.05] flex justify-end gap-4">
              <button 
                type="button" onClick={onClose}
                className="px-8 py-3 text-slate-500 font-bold hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-10 py-3 bg-blue-500 hover:bg-blue-400 text-slate-950 font-black rounded-2xl transition-all shadow-xl shadow-blue-500/20 flex items-center gap-3 disabled:opacity-50"
              >
                {loading ? <div className="w-5 h-5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" /> : <><Save size={20} /> Deploy Quest</>}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
};

export default QuizModal;
