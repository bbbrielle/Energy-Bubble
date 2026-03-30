/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Plus, Info, Trash2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task } from './types';
import TaskForm from './components/TaskForm';
import { Bubble } from './components/Bubble';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('energy-bubbles');
    return saved ? JSON.parse(saved) : [];
  });
  const [completedCount, setCompletedCount] = useState<number>(() => {
    const saved = localStorage.getItem('energy-completed-count');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(!localStorage.getItem('intro-seen'));

  useEffect(() => {
    localStorage.setItem('energy-bubbles', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('energy-completed-count', completedCount.toString());
  }, [completedCount]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const popTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setCompletedCount((prev) => prev + 1);
  };

  const clearAll = () => {
    if (window.confirm('Clear all bubbles and progress?')) {
      setTasks([]);
      setCompletedCount(0);
    }
  };

  const closeIntro = () => {
    setShowIntro(false);
    localStorage.setItem('intro-seen', 'true');
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 p-6 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">
            Energy<span className="text-indigo-600">Bubble</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium">ADHD-Friendly Task Flow</p>
        </div>
        
        <div className="flex gap-3 pointer-events-auto">
          <button 
            onClick={() => setShowIntro(true)}
            className="p-3 bg-white shadow-sm border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Info size={20} />
          </button>
          {tasks.length > 0 && (
            <button 
              onClick={clearAll}
              className="p-3 bg-white shadow-sm border border-slate-200 rounded-2xl text-rose-500 hover:bg-rose-50 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
      </header>

      {/* Main Bubble Area */}
      <main className="w-full h-screen pt-48 pb-48 px-6 flex flex-wrap items-center justify-center gap-4 overflow-y-auto content-center max-w-5xl mx-auto">
        <AnimatePresence mode="popLayout">
          {tasks.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center space-y-4 max-w-xs"
            >
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto text-indigo-600 animate-float">
                <Plus size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Your space is clear</h2>
              <p className="text-slate-500">Add a task to see it as a bubble. Focus on what matches your energy right now.</p>
            </motion.div>
          ) : (
            tasks.map((task) => (
              <Bubble key={task.id} task={task} onPop={popTask} />
            ))
          )}
        </AnimatePresence>
      </main>

      {/* Completion Tray (Shadows) */}
      <div className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none z-30 px-10 pb-6 flex flex-wrap-reverse items-end justify-center gap-2 overflow-hidden">
        <AnimatePresence>
          {Array.from({ length: completedCount }).map((_, i) => (
            <motion.div
              key={`shadow-${i}`}
              initial={{ y: -500, opacity: 0, scale: 2 }}
              animate={{ y: 0, opacity: 0.3, scale: 1 }}
              className="w-4 h-4 rounded-full bg-slate-400 blur-[1px]"
              transition={{ 
                type: 'spring', 
                damping: 20, 
                stiffness: 100,
                delay: 0.1 
              }}
            />
          ))}
        </AnimatePresence>
        
        {completedCount > 0 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {completedCount} Completed
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-10 left-0 right-0 flex justify-center z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFormOpen(true)}
          className="bg-slate-900 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 font-bold text-lg hover:bg-indigo-600 transition-colors group"
        >
          <Plus className="group-hover:rotate-90 transition-transform duration-300" />
          Add Task
        </motion.button>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isFormOpen && (
          <TaskForm onAddTask={addTask} onClose={() => setIsFormOpen(false)} />
        )}

        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-900/40 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl space-y-6"
            >
              <div className="space-y-2 text-center">
                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto text-white rotate-3">
                  <Zap size={32} />
                </div>
                <h2 className="text-2xl font-display font-black text-slate-900 pt-4">Welcome to Energy Bubble</h2>
              </div>
              
              <div className="space-y-4 text-slate-600">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center text-indigo-600 font-bold">1</div>
                  <p><span className="font-bold text-slate-800">Size = Urgency.</span> Bigger bubbles need your attention sooner.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center text-indigo-600 font-bold">2</div>
                  <p><span className="font-bold text-slate-800">Color = Energy.</span> Pick a bubble that matches how you feel right now.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center text-indigo-600 font-bold">3</div>
                  <p><span className="font-bold text-slate-800">Pop to finish.</span> Click a bubble when you're done to clear it.</p>
                </div>
              </div>

              <button
                onClick={closeIntro}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all"
              >
                Got it!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-200/20 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
