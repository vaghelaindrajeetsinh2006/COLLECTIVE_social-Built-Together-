import React, { useState } from 'react';
import { X, Sparkles, Plus, AlertCircle, ArrowRight } from 'lucide-react';
import { Collective } from '../types/collective';

interface CreateCollectiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCollective: (newCollective: Omit<Collective, 'id' | 'createdAt' | 'updatedAt' | 'progress' | 'participantCount' | 'participants' | 'contributions' | 'stage'>) => void;
}

const CATEGORY_PRESETS = [
  'Education & Campus',
  'Community & Culture',
  'Urban Life & Public Space',
  'Creative Economy',
  'Civic & Neighborhood',
  'Focus & Productivity',
  'Health & Well-being',
  'Climate & Sustainability',
];

export const CreateCollectiveModal: React.FC<CreateCollectiveModalProps> = ({
  isOpen,
  onClose,
  onCreateCollective,
}) => {
  const [title, setTitle] = useState('');
  const [goal, setGoal] = useState('');
  const [challengeDescription, setChallengeDescription] = useState('');
  const [category, setCategory] = useState(CATEGORY_PRESETS[0]);
  const [constraints, setConstraints] = useState('');
  const [desiredOutcome, setDesiredOutcome] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a collective title.');
      return;
    }
    if (!goal.trim()) {
      setError('Please describe what you are trying to build.');
      return;
    }
    if (!challengeDescription.trim()) {
      setError('Please describe the challenge or problem.');
      return;
    }
    if (!desiredOutcome.trim()) {
      setError('Please provide the desired collective outcome.');
      return;
    }

    onCreateCollective({
      title: title.trim(),
      goal: goal.trim(),
      challengeDescription: challengeDescription.trim(),
      category: category.trim(),
      constraints: constraints.trim() || undefined,
      desiredOutcome: desiredOutcome.trim(),
    });

    // Reset form
    setTitle('');
    setGoal('');
    setChallengeDescription('');
    setConstraints('');
    setDesiredOutcome('');
    setError(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-collective-title"
    >
      <div
        className="relative w-full max-w-2xl my-8 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 sm:p-8 text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-neutral-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/20 mb-2">
              <Sparkles className="w-3 h-3" />
              NEW SHARED MISSION
            </div>
            <h2 id="create-collective-title" className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Start a Collective
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1">
              Assemble co-builders around a tangible challenge. No followers or feeds — just collaborative creation.
            </p>
          </div>
          <button
            id="close-create-modal"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          {/* Collective Title */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
              Collective Title <span className="text-amber-400">*</span>
            </label>
            <input
              id="collective-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design a Better College Experience"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Goal: What are you trying to build? */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
              What are you trying to build? <span className="text-amber-400">*</span>
            </label>
            <input
              id="collective-goal-input"
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Rethink campus life, study pods, and community vitality for the modern learner"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Describe the challenge */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
              Describe the Challenge <span className="text-amber-400">*</span>
            </label>
            <textarea
              id="collective-challenge-input"
              rows={3}
              value={challengeDescription}
              onChange={(e) => setChallengeDescription(e.target.value)}
              placeholder="What core problem or tension exists? Why do conventional approaches fail?"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
                Category
              </label>
              <select
                id="collective-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {CATEGORY_PRESETS.map((cat) => (
                  <option key={cat} value={cat} className="bg-neutral-900 text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Optional constraints */}
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
                Constraints <span className="text-neutral-500 font-sans normal-case">(Optional)</span>
              </label>
              <input
                id="collective-constraints-input"
                type="text"
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="e.g. Budget-neutral; zero permits needed"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Desired outcome */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
              Desired Outcome <span className="text-amber-400">*</span>
            </label>
            <input
              id="collective-outcome-input"
              type="text"
              value={desiredOutcome}
              onChange={(e) => setDesiredOutcome(e.target.value)}
              placeholder="e.g. A published campus spatial blueprint & student action charter"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* CTA */}
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="submit-create-collective"
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs tracking-wider uppercase transition flex items-center gap-2 shadow-md shadow-amber-400/20 active:scale-98 cursor-pointer"
            >
              <span>START BUILDING</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
