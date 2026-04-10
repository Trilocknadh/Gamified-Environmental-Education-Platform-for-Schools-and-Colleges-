import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe,
  Shield,
  FileText,
  Accessibility,
  Mail,
  MapPin,
  Leaf,
  Library
} from 'lucide-react';
import InfoOverlay from './InfoOverlay';

const Footer = () => {
  const [overlayData, setOverlayData] = useState<{ isOpen: boolean; title: string; content: React.ReactNode }>({
    isOpen: false,
    title: '',
    content: null
  });

  const openOverlay = (title: string, content: React.ReactNode) => {
    setOverlayData({ isOpen: true, title, content });
  };

  const closeOverlay = () => {
    setOverlayData({ ...overlayData, isOpen: false });
  };

  const footerLinks = [
    { 
      label: 'ABOUT US', 
      content: (
        <div className="space-y-6">
          <p className="text-xl text-slate-300 leading-relaxed italic">At EcoEdu, we believe that education is the most powerful weapon which you can use to change the world.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
              <h4 className="text-emerald-400 font-bold mb-3">Our Mission</h4>
              <p className="text-sm text-slate-400">To gamify environmental science education, making complex concepts like Thermodynamics and Bio-chemistry accessible and actionable for the next generation of eco-warriors.</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
              <h4 className="text-blue-400 font-bold mb-3">Our Vision</h4>
              <p className="text-sm text-slate-400">A world where every student is equipped with the scientific knowledge and practical skills to solve the climate crisis through innovation and informed action.</p>
            </div>
          </div>
        </div>
      )
    },
    { 
      label: 'CONTACT US', 
      content: (
        <div className="space-y-8">
          <p className="text-lg text-slate-300">Need help or want to partner with us? Reach out to our support team.</p>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-emerald-400">
               <Mail size={20} />
               <span className="text-slate-200 font-bold">ecoedu@gmail.com</span>
            </div>
            <div className="flex items-center gap-4 text-emerald-400">
               <Globe size={20} />
               <span className="text-slate-200 font-bold">+91 7997914015</span>
            </div>
          </div>
          <div className="pt-6">
            <h4 className="text-slate-500 uppercase tracking-widest text-xs font-black mb-4">Support Hours</h4>
            <p className="text-slate-400">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
          </div>
        </div>
      )
    },
    { 
      label: 'EcoMissions', 
      content: (
        <div className="space-y-6 text-slate-300">
          <p>Our "Careers" are your Missions. We map your academic progress to real-world opportunities to make a difference.</p>
          <ul className="list-disc list-inside space-y-3 marker:text-emerald-500">
            <li>Community Reforestation Projects</li>
            <li>Carbon Footprint Research Assistant</li>
            <li>Sustainable Tech Beta Tester</li>
            <li>Environmental Policy Advocate</li>
          </ul>
        </div>
      )
    },
    { 
      label: 'LOCATION', 
      content: (
        <div className="space-y-6">
          <div className="flex items-start gap-4">
             <MapPin size={24} className="text-red-400 shrink-0" />
             <div>
                <h4 className="text-white font-bold text-lg">LPU Hub</h4>
                <p className="text-slate-400 mt-1">Lovely Professional University<br />Jalandhar - Delhi, G.T. Road, Phagwara, Punjab 144411</p>
             </div>
          </div>
          <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/40">
             <p className="text-xs text-slate-500 italic">"Think globally, act locally. We operate remotely across 15 countries to minimize our carbon footprint."</p>
          </div>
        </div>
      )
    }
  ];

  const legalLinks = [
    { label: 'Privacy Statement', icon: Shield },
    { label: 'Terms & Conditions', icon: FileText },
    { label: 'Cookie Policy', icon: Globe },
    { label: 'Accessibility Statement', icon: Accessibility }
  ];

  return (
    <footer className="relative bg-transparent min-h-[calc(100vh-64px)] flex flex-col justify-center py-16 overflow-hidden">
      {/* Decorative logo in background */}
      <div className="absolute -bottom-20 -right-20 opacity-[0.02] pointer-events-none text-emerald-500">
        <Leaf size={400} />
      </div>

      <div className="max-w-7xl mx-auto px-8 relative w-full">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-32 mb-24">
          {/* Brand & Social */}
          <div className="space-y-10 max-w-md">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-emerald-500 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                 <Leaf className="text-slate-950" size={28} />
               </div>
               <span className="text-4xl font-black text-white tracking-tighter">EcoEdu</span>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              Leading the revolution in gamified science education. Merging Physics, Chemistry, and Math with real-world sustainability.
            </p>
            <div className="flex gap-6">
              {[Globe, Mail, Library].map((Icon, i) => (
                <button key={i} className="w-14 h-14 rounded-2xl border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group">
                  <Icon size={24} className="group-hover:scale-110 transition-transform" />
                </button>
              ))}
            </div>
          </div>

          {/* Main Links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-16 gap-y-12 w-full lg:w-auto">
            {footerLinks.map((link, i) => (
              <button 
                key={i} 
                onClick={() => openOverlay(link.label, link.content)}
                className="text-left group"
              >
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-6 group-hover:text-emerald-400 transition-colors">
                  {link.label}
                </h4>
                <div className="w-8 h-1 bg-emerald-500/20 group-hover:w-full group-hover:bg-emerald-500 transition-all duration-300 rounded-full" />
              </button>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-800 to-transparent mb-12 opacity-50" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap justify-center md:justify-start gap-10">
            {legalLinks.map((link, i) => (
              <button 
                key={i} 
                onClick={() => openOverlay(link.label, <p className="text-slate-400 leading-relaxed italic">Detailed {link.label} documentation is currently being finalized to ensure total compliance with 2026 international digital standards. Please check back shortly.</p>)}
                className="text-xs font-bold text-slate-500 hover:text-emerald-400 transition-all underline-hover"
              >
                {link.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800/50">
            © 2026 EcoEdu. All Rights Reserved.
          </p>
        </div>
      </div>

      <InfoOverlay 
        isOpen={overlayData.isOpen} 
        onClose={closeOverlay} 
        title={overlayData.title} 
        content={overlayData.content} 
      />
    </footer>
  );
};

export default Footer;
