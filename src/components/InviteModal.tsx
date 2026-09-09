import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  Users, 
  Link as LinkIcon, 
  UserPlus, 
  Sparkles, 
  Send, 
  MessageCircle, 
  Mail, 
  Globe, 
  CheckCircle2,
  HelpCircle,
  Zap,
  LogOut
} from 'lucide-react';
import { Collective, Participant } from '../types/collective';
import { avatarFor } from '../utils/avatar';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  collective: Collective;
  onAddParticipant: (collectiveId: string, participant: Participant) => void;
  currentUser?: Participant;
  onToggleJoin?: (collectiveId: string) => void;
}

const PRESET_AVATARS = [
  avatarFor('Alex Rivera'),
  avatarFor('Maya Chen'),
  avatarFor('Jordan Lee'),
  avatarFor('Samira Khan'),
  avatarFor('Dev Patel'),
  avatarFor('Riley Morgan'),
];

const PRESET_ROLES = [
  'Full-Stack Developer',
  'UI/UX Designer',
  'AI & ML Engineer',
  'Product Strategist',
  'Domain Researcher',
  'Community Advocate',
  'Ethicist / Critic',
];

export const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onClose,
  collective,
  onAddParticipant,
  currentUser,
  onToggleJoin,
}) => {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<'share' | 'addMember' | 'guide'>('share');

  // Add collaborator form state
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState(PRESET_ROLES[0]);
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[1]);
  const [memberAddedSuccess, setMemberAddedSuccess] = useState(false);

  if (!isOpen) return null;

  // Build the shareable link with query parameter
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}?collective=${encodeURIComponent(collective.id)}`
    : `https://github.com/collective`; // Local preview fallback; share URLs are derived from the current site.

  const shareText = `Join me in co-creating "${collective.title}" on Collective! Goal: ${collective.goal}`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Invitation to collaborate on: ${collective.title}`);
    const body = encodeURIComponent(`Hi,\n\nI invite you to collaborate with us on "${collective.title}".\n\nGoal: ${collective.goal}\n\nJoin the collective workspace here:\n${shareUrl}\n\nLet's build together!`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newParticipant: Participant = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: newMemberName.trim(),
      avatar: selectedAvatar,
      role: newMemberRole,
      contributionsCount: 0,
      isOnline: true,
    };

    onAddParticipant(collective.id, newParticipant);
    setMemberAddedSuccess(true);
    setNewMemberName('');
    setTimeout(() => {
      setMemberAddedSuccess(false);
    }, 2800);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="w-full max-w-xl rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 sm:p-7 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-invite-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
          aria-label="Close invite modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="pr-10 mb-5">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
            <Share2 className="w-3.5 h-3.5" />
            <span>Multi-User Collaboration &bull; Join Hub</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">
            Invite &amp; Join Co-Builders
          </h2>
          <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
            Share <span className="text-neutral-200 font-semibold">{collective.title}</span> so other people can join, contribute ideas, and shape collective decisions.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-neutral-950 border border-neutral-800 mb-6">
          <button
            id="tab-share-link"
            onClick={() => setTab('share')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer ${
              tab === 'share'
                ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>Share Link</span>
          </button>

          <button
            id="tab-add-member"
            onClick={() => setTab('addMember')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer ${
              tab === 'addMember'
                ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-amber-400" />
            <span>Join / Add Member</span>
          </button>

          <button
            id="tab-guide"
            onClick={() => setTab('guide')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer ${
              tab === 'guide'
                ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>How it Works</span>
          </button>
        </div>

        {/* Tab 1: Share Link */}
        {tab === 'share' && (
          <div className="space-y-5">
            {/* Direct Link Box */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                Direct Collective Invite Link
              </label>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-950 border border-neutral-800">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="w-full bg-transparent text-xs text-amber-300 font-mono px-2 py-1 outline-none truncate selection:bg-amber-400/20"
                />
                <button
                  id="copy-invite-link-btn"
                  onClick={handleCopy}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                    copied
                      ? 'bg-emerald-400 text-neutral-950 shadow-sm'
                      : 'bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-sm'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-neutral-500 font-mono mt-1.5">
                Anyone with this link lands directly inside this collective workspace.
              </p>
            </div>

            {/* Quick Share Buttons */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                Instant Share Via
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  onClick={handleShareWhatsApp}
                  className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/40 text-neutral-300 hover:text-emerald-400 text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={handleShareTelegram}
                  className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-sky-500/40 text-neutral-300 hover:text-sky-400 text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Send className="w-4 h-4 text-sky-400" />
                  <span>Telegram</span>
                </button>

                <button
                  onClick={handleShareTwitter}
                  className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/40 text-neutral-300 hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-neutral-400" />
                  <span>X / Twitter</span>
                </button>

                <button
                  onClick={handleShareEmail}
                  className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-purple-500/40 text-neutral-300 hover:text-purple-300 text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-purple-400" />
                  <span>Email</span>
                </button>
              </div>
            </div>

            {/* Current Active Roster Snippet */}
            <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80">
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                <span className="font-mono uppercase text-[10px] text-neutral-500">
                  Current Co-Builders ({collective.participantCount}):
                </span>
                <div className="flex items-center gap-2">
                  {collective.isUserJoined && onToggleJoin && (
                    <button
                      id="modal-leave-collective-btn"
                      onClick={() => {
                        onToggleJoin(collective.id);
                        onClose();
                      }}
                      className="text-[10px] font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1 hover:underline cursor-pointer transition"
                      title="Leave this community"
                    >
                      <LogOut className="w-2.5 h-2.5" />
                      <span>Leave Collective</span>
                    </button>
                  )}
                  <span className="text-amber-400 font-mono text-[10px]">
                    {collective.stage} STAGE
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto pr-1">
                {collective.participants.length > 0 ? (
                  collective.participants.map((p) => (
                    <div 
                      key={p.id}
                      className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-200"
                    >
                      <img 
                        src={p.avatar} 
                        alt={p.name} 
                        className="w-4 h-4 rounded-full object-cover"
                        referrerPolicy="no-referrer" 
                      />
                      <span className="font-medium text-[11px] truncate max-w-[110px]">{p.name}</span>
                      <span className="text-[9px] text-neutral-500 font-mono">{p.role}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-neutral-500 italic py-1">
                    No builders joined yet. Switch to &quot;Join / Add Member&quot; tab to be the first!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Join as Co-Builder or Add Teammate */}
        {tab === 'addMember' && (
          <form onSubmit={handleAddMemberSubmit} className="space-y-4">
            <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs text-amber-300/90 leading-relaxed">
              Add yourself or a collaborator with a custom role so their contributions and perspective are credited in this collective.
            </div>

            {memberAddedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Collaborator successfully added to this collective!</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                Collaborator / Your Name
              </label>
              <input
                id="collaborator-name-input"
                type="text"
                required
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="e.g., Indrajeetsinh, Sarah Connor, Dev Patel"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                Role / Expertise
              </label>
              <div className="grid grid-cols-2 gap-1.5 mb-2">
                {PRESET_ROLES.slice(0, 4).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setNewMemberRole(role)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] text-left truncate transition cursor-pointer border ${
                      newMemberRole === role
                        ? 'bg-amber-400/10 border-amber-400/40 text-amber-300 font-semibold'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value)}
                placeholder="Or type custom role..."
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                Select Profile Avatar
              </label>
              <div className="flex items-center gap-3">
                {PRESET_AVATARS.map((avatar, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`relative p-0.5 rounded-full transition cursor-pointer ring-2 ${
                      selectedAvatar === avatar ? 'ring-amber-400 ring-offset-2 ring-offset-neutral-900' : 'ring-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={avatar}
                      alt={`Avatar ${idx + 1}`}
                      className="w-8 h-8 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                id="submit-add-collaborator-btn"
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 active:scale-98 cursor-pointer"
              >
                <UserPlus className="w-4 h-4 stroke-[2.5]" />
                <span>Join &amp; Add Collaborator to Collective</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: How Multi-User Joining Works (Clear Explanation) */}
        {tab === 'guide' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
              <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span>How Other Users Can Join (બીજા લોકો કેવી રીતે જોડાય?)</span>
              </h3>

              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-200">Share the Direct Link</h4>
                    <p className="text-neutral-400 text-[11px] leading-relaxed">
                      Click <strong className="text-amber-300">"Copy Link"</strong> or share via WhatsApp/Telegram. Anyone opening that link lands immediately inside this project.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-200">Click "Join as Builder"</h4>
                    <p className="text-neutral-400 text-[11px] leading-relaxed">
                      Any collaborator visiting the page simply clicks the <strong className="text-white">"Join as Builder"</strong> button in the top bar. They can set their name, role, and avatar.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-200">Contribute &amp; Remix Together</h4>
                    <p className="text-neutral-400 text-[11px] leading-relaxed">
                      They can click <strong className="text-white">"Contribute"</strong> or click on any node to Build upon it, Challenge risks, or Remix solutions. Each contribution displays their name and increases collective progress!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-400/10 text-purple-400 border border-purple-400/30 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-200">Synthesize &amp; AI Reality-Check</h4>
                    <p className="text-neutral-400 text-[11px] leading-relaxed">
                      When all contributors finish refining, click <strong className="text-purple-300">"Synthesize Outcome"</strong>. AI analyzes everyone's inputs, produces the final spec, and evaluates feasibility and impact.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setTab('share')}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs transition inline-flex items-center gap-2 cursor-pointer border border-neutral-700"
              >
                <LinkIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Go to Copy &amp; Share Link</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
