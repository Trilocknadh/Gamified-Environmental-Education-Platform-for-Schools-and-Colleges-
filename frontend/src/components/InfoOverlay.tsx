import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface InfoOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

const InfoOverlay: React.FC<InfoOverlayProps> = ({ isOpen, onClose, title, content }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500" />
            
            <div className="p-8 md:p-12 flex justify-between items-start">
              <div>
                <h2 className="text-4xl font-black text-white italic tracking-tight">{title}</h2>
                <div className="h-1 w-20 bg-emerald-500 mt-4 rounded-full" />
              </div>
              <button 
                onClick={onClose}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="px-8 md:px-12 pb-12 overflow-y-auto custom-scrollbar flex-grow">
              <div className="prose prose-invert prose-emerald max-w-none">
                {content}
              </div>
            </div>
            
            <div className="p-8 border-t border-slate-800 bg-slate-900/50 flex justify-end">
               <button 
                 onClick={onClose}
                 className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl transition-all shadow-lg"
               >
                 Close Section
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default InfoOverlay;
