import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollRevealProps {
  text: string;
  className?: string;
  containerClassName?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ text, className = "", containerClassName = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const words = text.split(" ");

  return (
    <div ref={containerRef} className={`relative z-10 ${containerClassName}`}>
      <div className="sticky top-[30%] flex flex-wrap justify-center max-w-4xl mx-auto py-20 px-4">
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const y = useTransform(scrollYProgress, [start, end], [10, 0]);

          return (
            <motion.span
              key={i}
              style={{ opacity, y }}
              className={`inline-block mr-2 text-2xl md:text-5xl font-black text-slate-100 ${className}`}
            >
              {word}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
};

export default ScrollReveal;
