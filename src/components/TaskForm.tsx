import React, { useState } from 'react';
import { Plus, X, Zap, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task, Urgency, EnergyCost } from '../types';

interface TaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

export default function TaskForm({ onAddTask, onClose }: TaskFormProps) {
  const [name, setName] = useState('');
  const [urgency, setUrgency] = useState<Urgency>('medium');
  const [energyCost, setEnergyCost] = useState<EnergyCost>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddTask({ name, urgency, energyCost });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-display font-bold text-slate-800">New Task</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Task Name</label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-indigo-500 focus:outline-none transition-all text-lg"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <AlertCircle size={14} /> Urgency (Size)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as Urgency[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setUrgency(level)}
                  className={`py-2 rounded-xl border-2 transition-all capitalize font-medium ${
                    urgency === level
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200'
                      : 'border-slate-100 text-slate-600 hover:border-slate-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Zap size={14} /> Energy Cost (Color)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as EnergyCost[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setEnergyCost(level)}
                  className={`py-2 rounded-xl border-2 transition-all capitalize font-medium ${
                    energyCost === level
                      ? level === 'low' ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100' :
                        level === 'medium' ? 'bg-amber-400 border-amber-400 text-white shadow-lg shadow-amber-100' :
                        'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-100'
                      : 'border-slate-100 text-slate-600 hover:border-slate-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Plus size={20} /> Create Bubble
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
