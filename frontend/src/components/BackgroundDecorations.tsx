import React from 'react';
import { 
  Leaf, 
  TreePine, 
  Plus, 
  Minus, 
  Divide, 
  DivideIcon as DivideSymbol, 
  Zap, 
  Globe, 
  Atom, 
  BookOpen, 
  Calculator 
} from 'lucide-react';
import mathPattern from '../assets/math_nature_pattern.png';

const BackgroundDecorations: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-20">
      {/* Seamless Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{ 
          backgroundImage: `url(${mathPattern})`,
          backgroundSize: '400px 400px',
          backgroundRepeat: 'repeat',
          animation: 'scroll-bg 60s linear infinite'
        }}
      />

      {/* Floating Elements - Trees & Nature */}
      <div className="absolute top-[10%] left-[5%] text-emerald-500/20 animate-float-slow">
        <TreePine size={120} strokeWidth={1} />
      </div>
      <div className="absolute top-[60%] right-[8%] text-emerald-400/15 animate-float">
        <Leaf size={80} strokeWidth={1} className="rotate-45" />
      </div>
      <div className="absolute bottom-[15%] left-[12%] text-teal-500/15 animate-float-fast">
        <TreePine size={100} strokeWidth={1} />
      </div>

      {/* Floating Elements - Science & Math */}
      <div className="absolute top-[25%] right-[15%] text-indigo-400/20 animate-float">
        <Atom size={90} strokeWidth={1} />
      </div>
      <div className="absolute top-[75%] left-[25%] text-blue-400/20 animate-float-slow">
        <Plus size={60} strokeWidth={1.5} />
      </div>
      <div className="absolute top-[45%] right-[25%] text-rose-400/15 animate-pulse-subtle">
        <Divide size={50} strokeWidth={1.5} />
      </div>
      <div className="absolute top-[5%] right-[40%] text-amber-400/15 animate-float-fast">
        <Zap size={70} strokeWidth={1} />
      </div>
      <div className="absolute bottom-[30%] right-[35%] text-indigo-500/15 animate-float">
        <Calculator size={80} strokeWidth={1} />
      </div>

      {/* Background Gradients (Enhanced) */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse-subtle" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse-subtle" style={{ animationDelay: '2s' }} />

      <style>{`
        @keyframes scroll-bg {
          from { background-position: 0 0; }
          to { background-position: 400px 400px; }
        }
      `}</style>
    </div>
  );
};

export default BackgroundDecorations;
