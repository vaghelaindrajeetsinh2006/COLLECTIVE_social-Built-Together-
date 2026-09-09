import React, { useState, useEffect } from 'react';
import { 
  X, 
  GitMerge, 
  Lightbulb, 
  AlertTriangle, 
  Shuffle, 
  CheckCircle2, 
  FileText,
  Sparkles,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { Contribution, ContributionType, InteractionActionType, Participant } from '../../types/collective';
import { avatarFor } from '../../utils/avatar';
import type { LucideIcon } from 'lucide-react';

interface AddContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectiveTitle: string;
  parentNode?: Contribution | null;
  initialActionType?: InteractionActionType | null;
  currentUser?: Participant;
  onAddContribution: (data: {
    title: string;
    content: string;
    type: ContributionType;
    actionType?: InteractionActionType;
    parentId?: string;
    tags: string[];
    author: Participant;
  }) => void;
}

const TYPE_OPTIONS: { type: ContributionType; label: string; desc: string; icon: LucideIcon; color: string }[] = [
  { type: 'idea', label: 'Seed Idea', desc: 'A new foundational concept or perspective', icon: Lightbulb, color: 'text-amber-400 border-amber-400/40 bg-amber-400/10' },
  { type: 'improvement', label: 'Improvement (Build)', desc: 'Expand, operationalize, or detail an existing idea', icon: GitMerge, color: 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10' },
  { type: 'concern', label: 'Challenge / Concern', desc: 'Stress-test risks, bottlenecks, or unaddressed flaws', icon: AlertTriangle, color: 'text-rose-400 border-rose-400/40 bg-rose-400/10' },
  { type: 'alternative', label: 'Remix / Alternative', desc: 'Synthesize opposing points or propose a hybrid version', icon: Shuffle, color: 'text-purple-400 border-purple-400/40 bg-purple-400/10' },
  { type: 'evidence', label: 'Evidence & Research', desc: 'Data, case studies, or field precedents', icon: FileText, color: 'text-sky-400 border-sky-400/40 bg-sky-400/10' },
  { type: 'suggestion', label: 'Constructive Suggestion', desc: 'Tactical refinement or process tweak', icon: Sparkles, color: 'text-indigo-400 border-indigo-400/40 bg-indigo-400/10' },
];

export const AddContributionModal: React.FC<AddContributionModalProps> = ({
  isOpen,
  onClose,
  collectiveTitle,
  parentNode,
  initialActionType,
  currentUser,
  onAddContribution,
}) => {
  const [type, setType] = useState<ContributionType>('idea');
  const [actionType, setActionType] = useState<InteractionActionType | undefined>(undefined);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState(currentUser?.name || 'Indrajeetsinh (Co-Builder)');
  const [authorRole, setAuthorRole] = useState(currentUser?.role || 'Co-Builder');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Proposal']);
  const [error, setError] = useState<string | null>(null);

  // Sync author if currentUser changes
  useEffect(() => {
    if (currentUser?.name) {
      setAuthorName(currentUser.name);
      setAuthorRole(currentUser.role || 'Co-Builder');
    }
  }, [currentUser]);

  // Sync initial action or parent node
  useEffect(() => {
    if (initialActionType === 'build') {
      setType('improvement');
      setActionType('build');
      if (parentNode && !title.startsWith('Build:')) {
        setTitle(`Build: ${parentNode.title}`);
      }
    } else if (initialActionType === 'challenge') {
      setType('concern');
      setActionType('challenge');
      if (parentNode && !title.startsWith('Challenge:')) {
        setTitle(`Challenge: ${parentNode.title}`);
      }
    } else if (initialActionType === 'remix') {
      setType('alternative');
      setActionType('remix');
      if (parentNode && !title.startsWith('Remix:')) {
        setTitle(`Remix: ${parentNode.title}`);
      }
    } else {
      setType('idea');
      setActionType(undefined);
      setTitle('');
    }
  }, [initialActionType, parentNode, isOpen]);

  if (!isOpen) return null;

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/^#/, '');
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagInput('');
      }
    }
  };

  const removeTag = (t: string) => {
    setTags(tags.filter(item => item !== t));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a contribution title.');
      return;
    }
    if (!content.trim()) {
      setError('Please provide constructive thoughts or specifications.');
      return;
    }

    onAddContribution({
      title: title.trim(),
      content: content.trim(),
      type,
      actionType: actionType || (type === 'improvement' ? 'build' : type === 'concern' ? 'challenge' : type === 'alternative' ? 'remix' : undefined),
      parentId: parentNode?.id,
      tags: tags.length > 0 ? tags : ['Contribution'],
      author: {
        id: `user-${Date.now()}`,
        name: authorName.trim() || 'Community Builder',
        avatar: avatarFor(authorName.trim() || 'Community Builder'),
        role: authorRole.trim() || 'Co-Builder',
        contributionsCount: 1,
      },
    });

    // Reset
    setTitle('');
    setContent('');
    setError(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-contribution-title"
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
              PEER CONTRIBUTION
            </div>
            <h2 id="add-contribution-title" className="font-display text-2xl font-bold tracking-tight text-white">
              {initialActionType === 'build' ? 'Build On This Idea' : initialActionType === 'challenge' ? 'Challenge This Perspective' : initialActionType === 'remix' ? 'Remix & Synthesize' : 'Add to Collective'}
            </h2>
            <p className="text-neutral-400 text-xs mt-1">
              For: <span className="text-neutral-200 font-medium">{collectiveTitle}</span>
            </p>
          </div>
          <button
            id="close-contribution-modal"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Parent Node Context if building/challenging/remixing */}
        {parentNode && (
          <div className="mt-4 p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
            <div className="flex items-center gap-2 text-neutral-400 font-mono text-[10px] uppercase mb-1">
              <span>Connected Anchor:</span>
              <span className="font-semibold text-amber-400">{parentNode.author.name}</span>
            </div>
            <div className="font-display font-semibold text-white truncate">{parentNode.title}</div>
            <p className="text-neutral-400 text-[11px] line-clamp-2 mt-0.5">{parentNode.content}</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Type Selector */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-300 mb-2">
              Contribution Mode
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TYPE_OPTIONS.map((opt) => {
                const isSelected = type === opt.type;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => {
                      setType(opt.type);
                      if (opt.type === 'improvement') setActionType('build');
                      else if (opt.type === 'concern') setActionType('challenge');
                      else if (opt.type === 'alternative') setActionType('remix');
                      else setActionType(undefined);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? `${opt.color} ring-1 ring-amber-400 font-semibold`
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-mono mb-1">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{opt.label}</span>
                    </div>
                    <span className="text-[10px] text-neutral-500 line-clamp-1">{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
              Title <span className="text-amber-400">*</span>
            </label>
            <input
              id="contribution-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build: Autonomous Peer Roster for Equipment Maintenance"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
              Perspective &amp; Actionable Content <span className="text-amber-400">*</span>
            </label>
            <textarea
              id="contribution-content-input"
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Detail your insight, actionable improvement, or constructive stress-test..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          {/* Author Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">
                Your Builder Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">
                Your Domain Role
              </label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                placeholder="e.g. Systems Thinker, Student, Designer"
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">
              Tags <span className="text-neutral-500 text-[10px] font-sans">(Press Enter to add)</span>
            </label>
            <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-neutral-950 border border-neutral-800">
              {tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-neutral-800 text-amber-300 border border-neutral-700">
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-rose-400 cursor-pointer">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tag..."
                className="flex-1 min-w-[100px] bg-transparent text-xs text-white focus:outline-none px-1"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="submit-contribution-btn"
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs tracking-wider uppercase transition flex items-center gap-2 shadow-md shadow-amber-400/20 active:scale-98 cursor-pointer"
            >
              <span>INJECT INTO COLLECTIVE</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
