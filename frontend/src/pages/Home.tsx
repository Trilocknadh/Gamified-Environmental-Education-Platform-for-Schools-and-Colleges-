import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { Leaf, Award, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const AnimatedEarth = () => {
  const sphereRef = useRef<any>(null);

  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = clock.getElapsedTime() * 0.1;
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <Sphere ref={sphereRef} args={[1.5, 64, 64]} scale={1.5}>
      <MeshDistortMaterial
        color="#10b981"
        attach="material"
        distort={0.4}
        speed={1.5}
        roughness={0.2}
      />
    </Sphere>
  );
};

const Home = () => {
  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto snap-y snap-mandatory scroll-smooth hide-scrollbar">
      {/* Background Gradients (Restored to original look) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/20 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[100px]" />
      </div>

      {/* 1. Hero Section */}
      <section className="snap-start min-h-[calc(100vh-64px)] flex items-center relative z-10">
        <main className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-3xl md:text-6xl font-black leading-[1.1] tracking-tighter text-white">
              Learn Science, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 text-glow">
                Save the Planet.
              </span>
            </h1>
            <p className="text-sm md:text-base text-slate-400 max-w-lg leading-relaxed font-medium">
              Gamified learning platform mapping Math, Physics and Chemistry to real-world Eco-Missions. Level up your knowledge and become an Eco Warrior today!
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              <Link to="/register" className="group flex items-center justify-center space-x-2 px-8 py-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black transition-all text-xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95">
                <span>Start Learning Free</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/academic/overview" className="flex items-center justify-center px-8 py-5 rounded-2xl bg-slate-800/80 border border-slate-700 hover:bg-slate-700 transition-all text-xl font-bold text-white">
                Explore Academic Hub
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-800/50">
              <div>
                <h3 className="text-2xl font-black text-emerald-400 tracking-tighter">50+</h3>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Quizzes</p>
              </div>
              <div>
                <h3 className="text-2xl font-black text-teal-400 tracking-tighter">XP</h3>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Rewards</p>
              </div>
              <div>
                <h3 className="text-2xl font-black text-blue-400 tracking-tighter">Real</h3>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Impact</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-[600px] w-full relative hidden lg:block"
          >
            <div className="absolute top-[15%] left-[5%] glass-card p-5 animate-float z-20 flex items-center space-x-4 border-emerald-500/20 bg-emerald-500/5 shadow-2xl">
              <div className="bg-emerald-500/20 p-3 rounded-xl"><Award className="w-8 h-8 text-emerald-400" /></div>
              <div>
                <p className="font-black text-white italic">Level Up!</p>
                <p className="text-xs font-bold text-emerald-400 tracking-widest">+50 XP</p>
              </div>
            </div>
            <div className="absolute bottom-[25%] right-[5%] glass-card p-5 animate-float z-20 flex items-center space-x-4 border-blue-500/20 bg-blue-500/5 shadow-2xl" style={{ animationDelay: '1.5s' }}>
              <div className="bg-blue-500/20 p-3 rounded-xl"><BookOpen className="w-8 h-8 text-blue-400" /></div>
              <div>
                <p className="font-black text-white italic">New Path</p>
                <p className="text-xs font-bold text-slate-400 tracking-widest">Physics 101</p>
              </div>
            </div>

            <div className="w-full h-full cursor-grab active:cursor-grabbing">
              <React.Suspense fallback={<div className="w-full h-full flex items-center justify-center text-emerald-400/20 font-black text-9xl">ECO</div>}>
                <Canvas className="w-full h-full drop-shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                  <ambientLight intensity={0.8} />
                  <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
                  <pointLight position={[-10, -10, -10]} intensity={1} color="#00ffcc" />
                  <AnimatedEarth />
                  <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
                </Canvas>
              </React.Suspense>
            </div>
          </motion.div>
        </main>
      </section>

      {/* 2. Feature Pillars Section */}
      <section className="snap-start min-h-[calc(100vh-64px)] flex items-center relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 md:grid-cols-3 gap-12">
           {[
             {
               title: "Curated Knowledge",
               desc: "Direct alignment with academic standards for Physics, Chemistry, and Biology.",
               icon: BookOpen,
               color: "text-emerald-400"
             },
             {
               title: "Proof of Impact",
               desc: "Submit real-world evidence of your eco-missions and get verified by experts.",
               icon: Leaf,
               color: "text-blue-400"
             },
             {
               title: "Legendary Badges",
               desc: "Collect unique digital assets that represent your skill and environmental contribution.",
               icon: Award,
               color: "text-yellow-400"
             }
           ].map((feature, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.2 }}
               className="glass-card p-10 group hover:border-emerald-500/30 transition-all border-slate-800/50"
             >
                <div className={`p-4 rounded-2xl bg-slate-900/80 mb-8 inline-block group-hover:scale-110 transition-transform ${feature.color}`}>
                  <feature.icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-100 mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
             </motion.div>
           ))}
        </div>
      </section>

      {/* 3. Final CTA Section */}
      <section className="snap-start min-h-[calc(100vh-64px)] flex items-center justify-center relative z-10">
        <div className="text-center">
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             className="max-w-3xl mx-auto px-8"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Ready to start your <span className="text-emerald-400">Eco-Legacy?</span></h2>
            <Link to="/register" className="inline-flex items-center space-x-3 px-12 py-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black transition-all text-xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95">
              <span>Join the Mission</span>
              <ArrowRight size={24} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 4. Footer Section */}
      <section className="snap-start min-h-[calc(100vh-64px)] flex flex-col justify-center relative z-10">
        <Footer />
      </section>
    </div>
  );
};

export default Home;
