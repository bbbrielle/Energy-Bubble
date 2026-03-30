import React from 'react';
import { motion } from 'motion/react';
import { Task } from '../types';

interface BubbleProps {
  task: Task;
  onPop: (id: string) => void;
}

const sizeMap = {
  low: 'w-24 h-24 text-xs',
  medium: 'w-36 h-36 text-sm',
  high: 'w-48 h-48 text-base',
};

const colorMap = {
  low: 'bg-emerald-400/80 border-emerald-500 shadow-emerald-200',
  medium: 'bg-amber-300/80 border-amber-400 shadow-amber-200',
  high: 'bg-rose-400/80 border-rose-500 shadow-rose-200',
};

export const Bubble: React.FC<BubbleProps> = ({ task, onPop }) => {
  // Random initial position offset to make it feel more natural
  const randomDelay = Math.random() * 2;
  const randomDuration = 3 + Math.random() * 2;

  return (
    <motion.div
      layout
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        y: [0, -15, 0],
      }}
      exit={{ 
        y: 800, 
        scale: 0.2, 
        opacity: 0,
        transition: { 
          duration: 0.8, 
          ease: [0.32, 0, 0.67, 0] 
        } 
      }}
      transition={{
        scale: { type: 'spring', damping: 12, stiffness: 100 },
        y: {
          duration: randomDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: randomDelay
        }
      }}
      whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
      whileTap={{ scale: 0.9 }}
      onClick={() => onPop(task.id)}
      className={`
        ${sizeMap[task.urgency]}
        ${colorMap[task.energyCost]}
        rounded-full border-2 flex flex-col items-center justify-center text-center p-6
        cursor-pointer shadow-xl backdrop-blur-sm relative group
      `}
    >
      <span className="font-bold text-slate-800 leading-tight break-words max-w-full z-10">
        {task.name}
      </span>
      
      {/* Pop hint - Moved to bottom to avoid overlap with text */}
      <div className="absolute bottom-3 inset-x-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none">
        <div className="bg-white/60 backdrop-blur-md rounded-full px-3 py-0.5 text-[9px] font-black text-slate-700 uppercase tracking-[0.2em] border border-white/40 shadow-sm">
          Pop
        </div>
      </div>
    </motion.div>
  );
}
