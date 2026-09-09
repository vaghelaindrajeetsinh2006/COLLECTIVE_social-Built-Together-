export type CollectiveStage = 'FORMING' | 'BUILDING' | 'REFINING' | 'FINALIZING' | 'COMPLETE';

export type ContributionType = 
  | 'idea' 
  | 'improvement' 
  | 'alternative' 
  | 'concern' 
  | 'evidence' 
  | 'suggestion';

export type InteractionActionType = 'build' | 'challenge' | 'remix';

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  role: string;
  contributionsCount: number;
  isOnline?: boolean;
}

export interface Contribution {
  id: string;
  collectiveId: string;
  author: Participant;
  type: ContributionType;
  title: string;
  content: string;
  parentId?: string; // ID of parent contribution this builds/challenges/remixes upon
  actionType?: InteractionActionType; // if created via build, challenge, or remix
  tags: string[];
  votes: {
    endorse: number;
    insightful: number;
    challenge: number;
  };
  userVote?: 'endorse' | 'insightful' | 'challenge' | null;
  createdAt: string;
  status: 'active' | 'integrated' | 'resolved' | 'remixed';
  position?: { x: number; y: number }; // For spatial canvas rendering
}

export interface AIInsight {
  feasibilityScore: number;
  impactScore: number;
  innovationScore: number;
  practicalityScore: number;
  summary: string;
  bestUseCases: string[];
  strengths: string[];
  risksAndWeaknesses: string[];
  improvementOpportunities: string[];
  recommendedNextStep: string;
  analyzedAt: string;
}

export interface CollectiveOutcome {
  finalConcept: string;
  headline: string;
  executiveSummary: string;
  corePillars: { title: string; description: string; derivedFrom: string[] }[];
  keyDecisions: { decision: string; rationale: string; champion: string }[];
  challengesResolved: { challenge: string; solution: string }[];
  finalOutcomeDeliverable: string;
}

export interface Collective {
  id: string;
  title: string;
  goal: string;
  challengeDescription: string;
  category: string;
  stage: CollectiveStage;
  progress: number; // 0 - 100
  participantCount: number;
  participants: Participant[];
  contributions: Contribution[];
  constraints?: string;
  desiredOutcome: string;
  createdAt: string;
  updatedAt: string;
  isUserJoined?: boolean;
  outcome?: CollectiveOutcome;
  aiInsight?: AIInsight;
}
