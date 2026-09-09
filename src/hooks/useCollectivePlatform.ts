import { useCallback, useEffect, useMemo, useState } from 'react';
import type { MouseEvent } from 'react';
import { ToastMessage } from '../components/Toast';
import {
  loadCollectives,
  saveCollectives,
  resetCollectivesToDefault,
} from '../utils/storage';
import {
  generateCollectiveOutcome,
  analyzeCollectiveWithAI,
  evaluateContributionQualityAndProgress,
} from '../utils/aiAnalysis';
import { avatarFor } from '../utils/avatar';
import {
  Collective,
  Contribution,
  CollectiveStage,
  ContributionType,
  InteractionActionType,
  Participant,
} from '../types/collective';
import { BackgroundThemeId, BACKGROUND_THEMES } from '../types/background';

export function useCollectivePlatform() {
  const [collectives, setCollectives] = useState<Collective[]>(() => loadCollectives());
  const [activeCollectiveId, setActiveCollectiveId] = useState<string | null>(null);
  const [workspaceView, setWorkspaceView] = useState<'canvas' | 'pathway'>('canvas');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  
  // Contribution modal state
  const [isAddContributionOpen, setIsAddContributionOpen] = useState(false);
  const [contributionParentNode, setContributionParentNode] = useState<Contribution | null>(null);
  const [contributionActionType, setContributionActionType] = useState<InteractionActionType | null>(null);

  // Outcome & AI Insight state
  const [isViewingOutcome, setIsViewingOutcome] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);

  // Invite & Multi-User Modal State
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteCollective, setInviteCollective] = useState<Collective | null>(null);

  // Current User identity (customizable by visitor)
  const [currentUser, setCurrentUser] = useState<Participant>(() => {
    try {
      const saved = localStorage.getItem('co_collective_user');
      if (saved) {
        const parsed = JSON.parse(saved) as Participant;
        return { ...parsed, avatar: avatarFor(parsed.name || 'Indrajeetsinh (Co-Builder)') };
      }
    } catch (e) {
      // fallback
    }
    return {
      id: `user-${Date.now()}`,
      name: 'Indrajeetsinh (Co-Builder)',
      avatar: avatarFor('Indrajeetsinh (Co-Builder)'),
      role: 'Full-Stack Builder',
      contributionsCount: 0,
      isOnline: true,
    };
  });

  // Background Theme State
  const [currentThemeId, setCurrentThemeId] = useState<BackgroundThemeId>(() => {
    try {
      const saved = localStorage.getItem('co_collective_bg_theme');
      if (saved && BACKGROUND_THEMES.some(t => t.id === saved)) {
        return saved as BackgroundThemeId;
      }
    } catch (e) {
      // fallback
    }
    return 'blueprint';
  });

  const [particlesEnabled, setParticlesEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('co_collective_particles');
      if (saved !== null) return saved === 'true';
    } catch (e) {
      // fallback
    }
    return true;
  });

  const [isBgModalOpen, setIsBgModalOpen] = useState(false);

  // Save current user to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('co_collective_user', JSON.stringify(currentUser));
    } catch (e) {
      // ignore
    }
  }, [currentUser]);

  // Save background preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('co_collective_bg_theme', currentThemeId);
    } catch (e) {
      // ignore
    }
  }, [currentThemeId]);

  useEffect(() => {
    try {
      localStorage.setItem('co_collective_particles', String(particlesEnabled));
    } catch (e) {
      // ignore
    }
  }, [particlesEnabled]);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'info' | 'warn' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Check URL query param on initial mount (?collective=col-...)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const collectiveIdFromUrl = params.get('collective');
      if (collectiveIdFromUrl) {
        const target = collectives.find(c => c.id === collectiveIdFromUrl);
        if (target) {
          setActiveCollectiveId(target.id);
          setIsViewingOutcome(target.stage === 'COMPLETE');
        }
      }
    } catch (e) {
      console.error('URL params parsing error', e);
    }
  }, []);

  // Keep URL query in sync when active collective changes
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (activeCollectiveId) {
        url.searchParams.set('collective', activeCollectiveId);
      } else {
        url.searchParams.delete('collective');
      }
      window.history.replaceState({}, '', url.toString());
    } catch (e) {
      // ignore
    }
  }, [activeCollectiveId]);

  // Sync state to storage whenever collectives change
  useEffect(() => {
    saveCollectives(collectives);
  }, [collectives]);

  // Active Collective
  const activeCollective = useMemo(() => {
    if (!activeCollectiveId) return null;
    return collectives.find(c => c.id === activeCollectiveId) || null;
  }, [collectives, activeCollectiveId]);

  // Overall platform statistics for Hero
  const totalBuilders = useMemo(() => {
    const set = new Set<string>();
    collectives.forEach(c => c.participants.forEach(p => set.add(p.name)));
    return set.size;
  }, [collectives]);

  const totalContributions = useMemo(() => {
    return collectives.reduce((acc, c) => acc + c.contributions.length, 0);
  }, [collectives]);

  // Handlers
  const handleSelectCollective = (col: Collective) => {
    setActiveCollectiveId(col.id);
    setIsViewingOutcome(col.stage === 'COMPLETE');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDiscovery = () => {
    setActiveCollectiveId(null);
    setIsViewingOutcome(false);
  };

  const handleOpenInvite = (targetCol?: Collective | null) => {
    const col = targetCol || activeCollective;
    if (col) {
      setInviteCollective(col);
      setIsInviteOpen(true);
    }
  };

  const handleAddParticipant = (collectiveId: string, participant: Participant) => {
    setCollectives(prev => prev.map(col => {
      if (col.id === collectiveId) {
        const exists = col.participants.some(p => p.id === participant.id || p.name.toLowerCase() === participant.name.toLowerCase());
        const updatedParticipants = exists 
          ? col.participants 
          : [participant, ...col.participants];

        const nextProgress = col.progress === 0 ? 10 : col.progress;

        return {
          ...col,
          participants: updatedParticipants,
          participantCount: updatedParticipants.length,
          progress: nextProgress,
          isUserJoined: true,
        };
      }
      return col;
    }));
    setCurrentUser(participant);
    addToast(`${participant.name} joined as ${participant.role}!`, 'success');
  };

  const handleToggleJoin = (collectiveId: string, e?: MouseEvent) => {
    if (e) e.stopPropagation();
    setCollectives(prev => prev.map(col => {
      if (col.id === collectiveId) {
        const nextJoined = !col.isUserJoined;
        const nextCount = nextJoined ? col.participantCount + 1 : Math.max(0, col.participantCount - 1);
        
        let nextParticipants = [...col.participants];
        let nextProgress = col.progress;
        let nextStage = col.stage;

        if (nextJoined) {
          const userParticipant: Participant = {
            id: currentUser.id || `user-${Date.now()}`,
            name: currentUser.name || 'Indrajeetsinh (Co-Builder)',
            avatar: currentUser.avatar || avatarFor(currentUser.name || 'Indrajeetsinh (Co-Builder)'),
            role: currentUser.role || 'Co-Builder',
            contributionsCount: 0,
            isOnline: true,
          };
          nextParticipants = [userParticipant, ...nextParticipants];
          if (nextProgress === 0) {
            nextProgress = 10;
          }
          addToast(`Joined ${col.title} as ${userParticipant.name}`, 'success');
        } else {
          nextParticipants = nextParticipants.filter(p => p.id !== currentUser.id && !p.name.includes(currentUser.name));
          if (nextParticipants.length === 0 && col.contributions.length === 0) {
            nextProgress = 0;
            nextStage = 'FORMING';
          }
          addToast(`Left ${col.title}`, 'info');
        }

        return {
          ...col,
          isUserJoined: nextJoined,
          participantCount: nextCount,
          participants: nextParticipants,
          progress: nextProgress,
          stage: nextStage,
        };
      }
      return col;
    }));
  };

  const handleCreateCollective = (newColData: Omit<Collective, 'id' | 'createdAt' | 'updatedAt' | 'progress' | 'participantCount' | 'participants' | 'contributions' | 'stage'>) => {
    const newId = `col-${Date.now()}`;
    const userParticipant: Participant = {
      id: `user-${Date.now()}`,
      name: 'You (Initiator)',
      avatar: avatarFor('You (Initiator)'),
      role: 'Initiator',
      contributionsCount: 0,
      isOnline: true,
    };

    const newCollective: Collective = {
      ...newColData,
      id: newId,
      stage: 'FORMING',
      progress: 15,
      participantCount: 1,
      participants: [userParticipant],
      contributions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isUserJoined: true,
    };

    setCollectives(prev => [newCollective, ...prev]);
    setActiveCollectiveId(newId);
    setIsViewingOutcome(false);
    addToast(`Collective "${newCollective.title}" is now open for builders!`, 'success');
  };

  const handleOpenAddWithAction = (action: InteractionActionType, parentNode: Contribution) => {
    setContributionParentNode(parentNode);
    setContributionActionType(action);
    setIsAddContributionOpen(true);
  };

  const handleOpenAddNewSeed = () => {
    setContributionParentNode(null);
    setContributionActionType(null);
    setIsAddContributionOpen(true);
  };

  const handleAddContribution = (data: {
    title: string;
    content: string;
    type: ContributionType;
    actionType?: InteractionActionType;
    parentId?: string;
    tags: string[];
    author: Participant;
  }) => {
    if (!activeCollectiveId) return;

    setCollectives(prev => prev.map(col => {
      if (col.id === activeCollectiveId) {
        // AI Analysis evaluates perspective substance, relevance, and milestone criteria
        const evaluation = evaluateContributionQualityAndProgress(data, col);

        const newContribution: Contribution = {
          id: `node-${Date.now()}`,
          collectiveId: col.id,
          author: data.author,
          type: data.type,
          actionType: data.actionType,
          parentId: data.parentId,
          title: data.title,
          content: data.content,
          tags: data.tags,
          votes: { endorse: 1, insightful: 0, challenge: 0 },
          userVote: 'endorse',
          createdAt: new Date().toISOString(),
          status: 'integrated',
        };

        const nextContributions = [...col.contributions, newContribution];
        let nextProgress = col.progress;
        let nextStage: CollectiveStage = col.stage;

        if (evaluation.isApproved) {
          nextProgress = Math.min(100, Math.max(col.progress + evaluation.progressIncrement, evaluation.stageAdvanced ? 35 : col.progress + evaluation.progressIncrement));
          if (evaluation.stageAdvanced) {
            nextStage = evaluation.newStage;
          }
          addToast(
            `AI Evaluated (${evaluation.score}/100 - ${evaluation.qualityRating}): ${evaluation.feedback} (+${evaluation.progressIncrement}% Progress)`,
            'success'
          );
          if (evaluation.stageAdvanced && evaluation.stageMilestoneMessage) {
            setTimeout(() => {
              addToast(`🚀 ${evaluation.stageMilestoneMessage}`, 'success');
            }, 800);
          }
        } else {
          // Perspective lacks substance, warn user but keep as draft discussion note
          addToast(
            `⚠️ ${evaluation.feedback}`,
            'warn'
          );
        }

        // Add author to participants if not present
        const authorExists = col.participants.some(p => p.name === data.author.name);
        const nextParticipants = authorExists
          ? col.participants.map(p => p.name === data.author.name ? { ...p, contributionsCount: p.contributionsCount + 1 } : p)
          : [{ ...data.author, contributionsCount: 1 }, ...col.participants];

        const updatedCol: Collective = {
          ...col,
          contributions: nextContributions,
          progress: nextProgress,
          stage: nextStage,
          participantCount: nextParticipants.length,
          participants: nextParticipants,
          isUserJoined: true,
          updatedAt: new Date().toISOString(),
        };

        // If completed or finalizing with sufficient discussion, auto-synthesize outcome
        if (nextContributions.length >= 3 && (nextStage === 'FINALIZING' || nextStage === 'COMPLETE')) {
          updatedCol.outcome = generateCollectiveOutcome(updatedCol);
        }

        return updatedCol;
      }
      return col;
    }));
  };

  const handleVoteNode = (nodeId: string, voteType: 'endorse' | 'insightful' | 'challenge') => {
    if (!activeCollectiveId) return;

    setCollectives(prev => prev.map(col => {
      if (col.id === activeCollectiveId) {
        return {
          ...col,
          contributions: col.contributions.map(node => {
            if (node.id === nodeId) {
              const currentVotes = { ...node.votes };
              // If already voted this, toggle off
              if (node.userVote === voteType) {
                currentVotes[voteType] = Math.max(0, currentVotes[voteType] - 1);
                return { ...node, votes: currentVotes, userVote: null };
              }

              // Otherwise increment new and decrement previous
              if (node.userVote) {
                currentVotes[node.userVote] = Math.max(0, currentVotes[node.userVote] - 1);
              }
              currentVotes[voteType] = (currentVotes[voteType] || 0) + 1;

              return { ...node, votes: currentVotes, userVote: voteType };
            }
            return node;
          }),
        };
      }
      return col;
    }));

    addToast(`Recorded consensus signal`, 'info');
  };

  const handleAdvanceStage = (newStage: CollectiveStage) => {
    if (!activeCollectiveId) return;

    setCollectives(prev => prev.map(col => {
      if (col.id === activeCollectiveId) {
        let nextProgress = col.progress;
        if (newStage === 'FORMING') nextProgress = 25;
        else if (newStage === 'BUILDING') nextProgress = 55;
        else if (newStage === 'REFINING') nextProgress = 75;
        else if (newStage === 'FINALIZING') nextProgress = 90;
        else if (newStage === 'COMPLETE') nextProgress = 100;

        const updated: Collective = {
          ...col,
          stage: newStage,
          progress: nextProgress,
        };

        if (col.contributions.length >= 3 && (newStage === 'FINALIZING' || newStage === 'COMPLETE')) {
          updated.outcome = generateCollectiveOutcome(updated);
        }

        return updated;
      }
      return col;
    }));

    addToast(`Collective moved to stage: ${newStage}`, 'info');
  };

  const handleOpenOutcome = () => {
    if (!activeCollective) return;

    // Discussions required check before revealing/generating AI outcome
    if (activeCollective.contributions.length < 3) {
      addToast(
        `Discussions required! Co-builders must contribute at least 3 perspectives (currently ${activeCollective.contributions.length}/3) before AI can synthesize an outcome.`,
        'warn'
      );
      return;
    }

    // Generate outcome if not present
    if (!activeCollective.outcome) {
      const generatedOutcome = generateCollectiveOutcome(activeCollective);
      setCollectives(prev => prev.map(col => {
        if (col.id === activeCollective.id) {
          return {
            ...col,
            outcome: generatedOutcome,
            stage: col.stage === 'FORMING' || col.stage === 'BUILDING' ? 'FINALIZING' : col.stage,
          };
        }
        return col;
      }));
    }
    setIsViewingOutcome(true);
  };

  const handleAnalyzeWithAI = async () => {
    if (!activeCollective) return;

    // Discussions required check before running AI analysis
    if (activeCollective.contributions.length < 3) {
      addToast(
        `Discussions required! At least 3 perspectives must be discussed before running AI analysis.`,
        'warn'
      );
      return;
    }

    setIsAIModalOpen(true);
    setIsAILoading(true);

    const insight = await analyzeCollectiveWithAI(activeCollective);

    setCollectives(prev => prev.map(col => {
      if (col.id === activeCollective.id) {
        return {
          ...col,
          aiInsight: insight,
        };
      }
      return col;
    }));

    setIsAILoading(false);
  };

  const handleResetData = () => {
    const initial = resetCollectivesToDefault();
    setCollectives(initial);
    setActiveCollectiveId(null);
    setIsViewingOutcome(false);
    addToast('Reset platform data to sample state', 'warn');
  };



  const currentTheme = BACKGROUND_THEMES.find(t => t.id === currentThemeId) || BACKGROUND_THEMES[0];

  return {
    collectives, activeCollective, activeCollectiveId, workspaceView, setWorkspaceView,
    isCreateOpen, setIsCreateOpen, isComparisonOpen, setIsComparisonOpen,
    isAddContributionOpen, setIsAddContributionOpen, contributionParentNode, contributionActionType,
    isViewingOutcome, setIsViewingOutcome, isAIModalOpen, setIsAIModalOpen, isAILoading,
    isInviteOpen, setIsInviteOpen, inviteCollective, currentUser,
    currentThemeId, setCurrentThemeId, currentTheme, particlesEnabled, setParticlesEnabled,
    isBgModalOpen, setIsBgModalOpen, toasts, dismissToast, totalBuilders, totalContributions,
    handleSelectCollective, handleBackToDiscovery, handleOpenInvite, handleAddParticipant,
    handleToggleJoin, handleCreateCollective, handleOpenAddWithAction, handleOpenAddNewSeed,
    handleAddContribution, handleVoteNode, handleAdvanceStage, handleOpenOutcome, handleAnalyzeWithAI,
    handleResetData, addToast,
  };
}
