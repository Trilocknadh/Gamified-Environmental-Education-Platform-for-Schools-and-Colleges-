import React, { useState, useEffect } from 'react';
import { Plus, Trash2, HelpCircle, Save, XCircle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const QuizzesTab = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: 'Environmental Studies',
    gradeLevel: '10',
    rewardXP: 50,
    questions: [
      { question: '', options: ['', '', '', ''], correctAnswer: '' }
    ]
  });

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/quizzes');
      setQuizzes(data);
    } catch (error) {
      toast.error('Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };

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
    // Validate
    const invalid = formData.questions.some(q => !q.question || q.options.some(o => !o) || !q.correctAnswer);
    if (invalid) {
      toast.error('Please fill in all questions, options, and select correct answers');
      return;
    }

    try {
      await api.post('/quizzes', formData);
      toast.success('Quiz created successfully!');
      setShowForm(false);
      setFormData({
        title: '',
        subject: 'Environmental Studies',
        gradeLevel: '10',
        rewardXP: 50,
        questions: [{ question: '', options: ['', '', '', ''], correctAnswer: '' }]
      });
      fetchQuizzes();
    } catch (error) {
      toast.error('Failed to create quiz');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    try {
      await api.delete(`/quizzes/${id}`);
      toast.success('Quiz deleted');
      fetchQuizzes();
    } catch (error) {
      toast.error('Failed to delete quiz');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Quiz Management</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
        >
          {showForm ? 'Cancel' : <><Plus size={18} /> Create Quiz</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium text-slate-400">Quiz Title</label>
                <input 
                  type="text" required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none text-lg font-bold"
                  placeholder="e.g. Climate Change Fundamentals"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Subject</label>
                <select 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none"
                >
                  {['Mathematics', 'Physics', 'Chemistry', 'Environmental Studies'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Grade Level</label>
                <select 
                  value={formData.gradeLevel}
                  onChange={(e) => setFormData({...formData, gradeLevel: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none"
                >
                  {['6', '7', '8', '9', '10', '11', '12', 'BTech', 'Degree'].map(g => (
                    <option key={g} value={g}>Level {g}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Reward XP</label>
                <input 
                  type="number" required
                  value={formData.rewardXP}
                  onChange={(e) => setFormData({...formData, rewardXP: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none"
                  placeholder="e.g. 50"
                  min="1"
                />
              </div>
           </div>

           <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                 <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                   <HelpCircle size={20} /> Questions ({formData.questions.length})
                 </h3>
              </div>

              {formData.questions.map((q, qIndex) => (
                <div key={qIndex} className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <span className="bg-emerald-500 text-slate-950 w-6 h-6 rounded-full text-xs flex items-center justify-center font-black shrink-0">
                      {qIndex + 1}
                    </span>
                    <input 
                      type="text" required
                      value={q.question}
                      onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                      className="flex-grow bg-transparent border-b border-slate-800 focus:border-emerald-500 outline-none py-1 text-white"
                      placeholder="Enter question text..."
                    />
                    {formData.questions.length > 1 && (
                      <button type="button" onClick={() => removeQuestion(qIndex)} className="text-slate-600 hover:text-red-500">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-10">
                    {q.options.map((opt, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-3 group">
                        <input 
                          type="radio" 
                          name={`correct-${qIndex}`}
                          checked={q.correctAnswer === opt && opt !== ''}
                          onChange={() => handleQuestionChange(qIndex, 'correctAnswer', opt)}
                          disabled={opt === ''}
                          className="w-4 h-4 accent-emerald-500 cursor-pointer"
                        />
                        <input 
                          type="text" required
                          value={opt}
                          onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                          className="flex-grow bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white focus:border-emerald-500 outline-none"
                          placeholder={`Option ${oIndex + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                  {q.correctAnswer && <p className="text-[10px] text-emerald-400 pl-10 font-medium">Selected Correct: {q.correctAnswer}</p>}
                </div>
              ))}

              <button 
                type="button" 
                onClick={addQuestion}
                className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-sm font-medium flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Add Another Question
              </button>
           </div>

          <button type="submit" className="w-full bg-emerald-500 text-slate-950 font-black py-4 rounded-xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10 flex items-center justify-center gap-3">
            <Save size={20} /> Deploy Quiz to Platform
          </button>
        </form>
      )}

      {/* Existing Quizzes */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          [1,2].map(i => <div key={i} className="glass-card h-24 animate-pulse" />)
        ) : quizzes.length === 0 ? (
          <div className="text-center py-20 text-slate-600">No quizzes created yet. Start by clicking "Create Quiz".</div>
        ) : (
          quizzes.map((quiz) => (
            <div key={quiz._id} className="glass-card hover:border-emerald-500/30 transition-all p-5 group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500 text-slate-950 rounded-2xl shadow-lg shadow-emerald-500/10">
                    <HelpCircle size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg group-hover:text-emerald-400 transition-colors">{quiz.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-500">{quiz.subject}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-700" />
                      <span className="text-xs text-slate-500">{quiz.questions.length} Questions</span>
                      <span className="w-1 h-1 rounded-full bg-slate-700" />
                      <span className="text-xs text-emerald-500/80 font-bold">Reward: {quiz.rewardXP} XP</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleDelete(quiz._id)}
                    className="p-2.5 bg-slate-900 border border-slate-800 text-slate-600 hover:text-red-500 hover:border-red-500/30 rounded-xl transition-all"
                    title="Delete Quiz"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuizzesTab;
