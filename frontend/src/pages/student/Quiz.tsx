import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Trophy, 
  ArrowRight, 
  Timer as TimerIcon, 
  ChevronLeft,
  Zap,
  Globe,
  AlertCircle,
  XCircle,
  Play,
  FlaskConical
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const SUBJECTS = [
  { id: 'Environmental Studies', icon: Globe, color: 'emerald' },
  { id: 'Mathematics', icon: Zap, color: 'blue' },
  { id: 'Physics', icon: Zap, color: 'purple' },
  { id: 'Chemistry', icon: FlaskConical, color: 'pink' }
];

const Quiz = () => {
  const { user } = useAuthStore();
  const [view, setView] = useState('subjects'); // subjects, quiz-list, active-quiz, results
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  
  const { subject: subjectParam } = useParams<{ subject?: string }>();
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (subjectParam) {
      const mapping: { [key: string]: string } = {
        'eco': 'Environmental Studies',
        'math': 'Mathematics',
        'physics': 'Physics',
        'chemistry': 'Chemistry'
      };
      
      const internalSubject = mapping[subjectParam.toLowerCase()];
      if (internalSubject) {
        setSelectedSubject(internalSubject);
        fetchQuizzes(internalSubject);
      }
    } else {
       // Reset if no param
       setView('subjects');
       setSelectedSubject(null);
       setQuizzes([]);
    }
  }, [subjectParam]);

  // Instant Feedback State
  const [feedback, setFeedback] = useState<{ isCorrect: boolean, selectedOption: string } | null>(null);

  const fetchQuizzes = async (subject: string) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/quizzes?subject=${subject}`);
      setQuizzes(data);
      setView('quiz-list');
    } catch (error) {
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = (quiz: any) => {
    if (quiz.completed) {
      toast.success('You have already mastered this module! Feel free to review the content.', { icon: '🎓' });
      // We still let them "start" it if they want to review, OR we can block it.
      // The user said "did not want access completed quizzes", so I will block it.
      return;
    }
    setCurrentQuiz(quiz);
    setCurrentQuestionIndex(0);
    setScore(0);
    setFeedback(null);
    setTimeLeft(30);
    setView('active-quiz');
    startTimer();
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(30);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion(null); // Timeout
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleAnswer = (option: string) => {
    if (feedback) return; // Prevent double clicks

    const isCorrect = option === currentQuiz.questions[currentQuestionIndex].correctAnswer;
    if (isCorrect) setScore(score + 1);
    
    setFeedback({ isCorrect, selectedOption: option });
    stopTimer();

    setTimeout(() => {
      handleNextQuestion(isCorrect);
    }, 1500);
  };

  const handleNextQuestion = (lastCorrect: boolean | null) => {
    setFeedback(null);
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      startTimer();
    } else {
      submitResults(score + (lastCorrect ? 1 : 0));
    }
  };

  const submitResults = async (finalScore: number) => {
    stopTimer();
    const percentage = finalScore / currentQuiz.questions.length;
    try {
      const { data } = await api.post('/quizzes/submit', {
        quizId: currentQuiz._id,
        score: percentage
      });
      setEarnedXP(data.earnedXP);
      triggerCelebration(percentage);
      setView('results');
    } catch (error) {
      console.error('Submit results error:', error);
      setEarnedXP(Math.round(percentage * 100)); // Fallback
      triggerCelebration(percentage);
      setView('results');
    }
  };

  const triggerCelebration = (percentage: number) => {
    if (percentage < 0.3) return; // User requested 30% trigger
    
    // Blast 1
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#3b82f6', '#facc15', '#f472b6', '#a78bfa']
    });

    // Sub-blasts for extra "wow" factor
    setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#10b981', '#3b82f6']
      });
      confetti({
        particleCount: 100,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#facc15', '#f472b6']
      });
    }, 250);
  };

  const renderSubjects = () => (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">Eco Knowledge Hub</h1>
        <p className="text-slate-400">Prove your expertise and earn environmental impact points.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SUBJECTS.map((sub) => (
          <motion.div
            key={sub.id}
            whileHover={{ y: -8 }}
            className={`glass-card p-8 cursor-pointer group flex flex-col items-center text-center border-slate-700/50 hover:border-${sub.color}-500/50 transition-all`}
            onClick={() => {
              setSelectedSubject(sub.id);
              fetchQuizzes(sub.id);
            }}
          >
            <div className={`p-4 rounded-2xl bg-${sub.color}-500/10 mb-6 group-hover:scale-110 transition-transform group-hover:bg-${sub.color}-500/20`}>
              <sub.icon className={`text-${sub.color}-400 w-10 h-10`} />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">{sub.id}</h3>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
               <Zap size={10} className="text-yellow-400" /> +50 XP Reward
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderQuizList = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <button 
        onClick={() => setView('subjects')}
        className="flex items-center gap-2 text-emerald-400 font-bold hover:translate-x-[-4px] transition-transform group"
      >
        <ChevronLeft size={20} className="group-hover:animate-pulse" /> Back to Knowledge Hub
      </button>
      <div className="flex items-end justify-between border-b border-slate-800 pb-6">
        <h2 className="text-3xl font-black text-white">{selectedSubject} Quizzes</h2>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{quizzes.length} Available</span>
      </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quizzes.map((quiz) => (
          <motion.div
            key={quiz._id}
            whileHover={{ scale: 1.02 }}
            className={`glass-card p-6 flex flex-col items-start gap-4 hover:border-emerald-500/30 transition-all cursor-pointer relative group overflow-hidden ${quiz.completed ? 'border-emerald-500/20 bg-emerald-500/[0.02]' : ''}`}
            onClick={() => startQuiz(quiz)}
          >
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 blur-2xl transition-all ${quiz.completed ? 'bg-emerald-500/10' : 'bg-emerald-500/5 group-hover:bg-emerald-500/10'}`} />
            
            <div className="flex justify-between items-start w-full">
               <div className={`p-3 rounded-xl transition-colors ${quiz.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  {quiz.completed ? <CheckCircle2 size={20} /> : <Play size={20} fill="currentColor" />}
               </div>
               <div className="flex flex-col items-end gap-1">
                 <span className="text-[10px] font-black bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-yellow-400 uppercase tracking-widest">
                   {quiz.rewardXP} XP
                 </span>
                 {quiz.completed && (
                   <span className="text-[9px] font-black bg-emerald-500 text-slate-950 px-2 py-0.5 rounded uppercase">
                     Completed • {quiz.previousScore || 0}%
                   </span>
                 )}
               </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-lg mb-1">{quiz.title}</h4>
              <p className="text-xs text-slate-500 font-medium">{quiz.questions.length} Science-backed MCQs</p>
            </div>
            
            {quiz.completed ? (
              <div className="mt-4 flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-[0.2em]">
                 Review Content <ArrowRight size={12} />
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                 Start Challenge <ArrowRight size={12} />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderActiveQuiz = () => {
    const question = currentQuiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;

    return (
      <div className="max-w-3xl mx-auto space-y-8 flex flex-col h-full">
        <div className="flex items-center justify-between gap-8 mb-4">
          <div className="flex-grow space-y-2">
             <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                <span>Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
             </div>
             <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
               <motion.div className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
             </div>
          </div>
          <div className="shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 border-slate-700 bg-slate-900 relative">
             <TimerIcon size={20} className={timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-slate-500'} />
             <span className={`text-lg font-black font-mono ${timeLeft < 10 ? 'text-red-400' : 'text-slate-200'}`}>{timeLeft}</span>
             <svg className="absolute inset-0 -rotate-90 pointer-events-none" viewBox="0 0 64 64">
               <circle 
                cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="2" 
                className={timeLeft < 10 ? 'text-red-500/20' : 'text-slate-800'} 
               />
               <motion.circle 
                cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="2.5" 
                strokeDasharray="188.4" 
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: 188.4 - (timeLeft / 30) * 188.4 }}
                className={timeLeft < 10 ? 'text-red-500' : 'text-emerald-500'} 
               />
             </svg>
          </div>
        </div>

        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, scale: 0.98, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          className="glass-card p-10 md:p-14 relative"
        >
          <h3 className="text-2xl md:text-3xl font-black text-white mb-12 leading-[1.3] italic">
            "{question.question}"
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {question.options.map((option: string, idx: number) => {
              const isSelected = feedback?.selectedOption === option;
              const isCorrect = option === question.correctAnswer;
              let btnClass = "border-slate-700/50 bg-slate-900/30 text-slate-300 hover:border-emerald-500/50 hover:bg-emerald-500/5";
              
              if (feedback) {
                if (isCorrect) btnClass = "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
                else if (isSelected) btnClass = "border-red-500 bg-red-500/10 text-red-400";
                else btnClass = "border-slate-800 bg-slate-900/10 text-slate-600 opacity-50";
              }

              return (
                <button
                  key={idx}
                  disabled={!!feedback}
                  onClick={() => handleAnswer(option)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all flex items-center justify-between group font-bold ${btnClass}`}
                >
                  <span className="text-sm">{option}</span>
                  {feedback && isCorrect && <CheckCircle2 size={18} className="text-emerald-400" />}
                  {feedback && isSelected && !isCorrect && <XCircle size={18} className="text-red-400" />}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  };

  const renderResults = () => (
    <div className="max-w-2xl mx-auto py-12 flex flex-col items-center text-center space-y-8">
      <div className="relative">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 10, stiffness: 100 }}
          className="w-32 h-32 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center border-2 border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.2)]"
        >
          <Trophy className="text-emerald-400 w-16 h-16" />
        </motion.div>
        <motion.div 
          className="absolute -top-4 -right-4 bg-yellow-400 text-slate-950 p-2 rounded-xl border-4 border-slate-900"
          initial={{ rotate: 45, opacity: 0 }}
          animate={{ rotate: 12, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
           <Zap fill="currentColor" />
        </motion.div>
      </div>

      <div className="space-y-2">
        <h2 className="text-5xl font-black text-white tracking-tighter italic">Challenge Completed!</h2>
        <p className="text-slate-400 text-lg">Great work, {user.name.split(' ')[0]}! You've mastered another module.</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 w-full">
         <div className="glass-card p-6 bg-emerald-500/5">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Final Score</p>
            <h4 className="text-3xl font-black text-white">{score} / {currentQuiz.questions.length}</h4>
         </div>
         <div className="glass-card p-6 bg-blue-500/5">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">XP Gained</p>
            <h4 className="text-3xl font-black text-emerald-400">+{earnedXP}</h4>
         </div>
      </div>

      <div className="flex items-center gap-4 w-full pt-6">
        <button
          onClick={() => setView('subjects')}
          className="flex-grow h-16 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg rounded-2xl transition-all shadow-xl hover:scale-[1.02] active:scale-98"
        >
          Back to Knowledge Hub
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex-grow h-16 bg-slate-800 text-slate-200 font-bold rounded-2xl border border-slate-700 hover:border-slate-600 transition-all"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );

  const navigate = useNavigate();

  return (
    <div className="min-h-full">
      {loading && view === 'subjects' ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
           <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
           <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Knowledge Modules...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            {view === 'subjects' && renderSubjects()}
            {view === 'quiz-list' && renderQuizList()}
            {view === 'active-quiz' && renderActiveQuiz()}
            {view === 'results' && renderResults()}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default Quiz;
