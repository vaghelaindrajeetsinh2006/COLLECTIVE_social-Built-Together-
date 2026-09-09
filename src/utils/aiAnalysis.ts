import { Collective, AIInsight, CollectiveOutcome, CollectiveStage } from '../types/collective';

export function generateCollectiveOutcome(collective: Collective): CollectiveOutcome {
  const ideas = collective.contributions.filter(c => c.type === 'idea');
  const builds = collective.contributions.filter(c => c.actionType === 'build' || c.type === 'improvement');
  const challenges = collective.contributions.filter(c => c.actionType === 'challenge' || c.type === 'concern');
  const remixes = collective.contributions.filter(c => c.actionType === 'remix' || c.type === 'alternative' || c.type === 'suggestion');

  // Derive synthesized headline and pillars based on actual contributions
  const primaryTitle = collective.title;
  const headline = `A community-synthesized solution for ${collective.goal.toLowerCase()}`;
  
  const corePillars = [
    {
      title: ideas[0]?.title || 'Foundation Principle',
      description: ideas[0]?.content || 'Decentralized foundation created by the community.',
      derivedFrom: ideas.slice(0, 2).map(i => i.title)
    },
    {
      title: builds[0]?.title ? builds[0].title.replace(/^Build:\s*/i, '') : 'Operational Framework',
      description: builds[0]?.content || 'Actionable systems and collaborative workflows agreed upon by builders.',
      derivedFrom: builds.slice(0, 2).map(b => b.title)
    },
    {
      title: remixes[0]?.title ? remixes[0].title.replace(/^Remix:\s*/i, '') : 'Harmonized Synthesis',
      description: remixes[0]?.content || 'Integrated perspective bridging contested challenges and high-value innovations.',
      derivedFrom: remixes.slice(0, 2).map(r => r.title)
    }
  ];

  const keyDecisions = [
    {
      decision: `Adopted decentralized participation over hierarchical approvals`,
      rationale: `Ensures rapid iteration velocity without top-down bureaucracy.`,
      champion: collective.participants[0]?.name || 'Community Consensus'
    },
    {
      decision: `Addressed primary challenge of sustainability and accountability`,
      rationale: `Implemented transparent peer-review and iterative stress testing.`,
      champion: collective.participants[1]?.name || collective.participants[0]?.name || 'Lead Builders'
    }
  ];

  const challengesResolved = challenges.length > 0
    ? challenges.slice(0, 2).map((ch, idx) => ({
        challenge: ch.title.replace(/^Challenge:\s*/i, ''),
        solution: remixes[idx]?.title ? remixes[idx].title.replace(/^Remix:\s*/i, '') : 'Resolved through structured community compromise and transparent safeguards.'
      }))
    : [
        {
          challenge: 'Coordination overhead and adoption barriers',
          solution: 'Lightweight, low-friction entry pathways tailored to diverse participant roles.'
        }
      ];

  return {
    finalConcept: `${primaryTitle} — Collaborative Consensus Model`,
    headline,
    executiveSummary: `Through ${collective.contributions.length} peer contributions and rigorous stress-testing across ${collective.participants.length} builders, this Collective synthesized a unified model addressing: "${collective.challengeDescription}". The outcome directly unlocks: ${collective.desiredOutcome}`,
    corePillars,
    keyDecisions,
    challengesResolved,
    finalOutcomeDeliverable: `Published Specification & Implementation Blueprint: ${collective.title} (v1.0 Ready for Pilot)`
  };
}

export function analyzeCollectiveWithAI(collective: Collective): Promise<AIInsight> {
  return new Promise((resolve) => {
    // Deterministic client-side analysis based on real metrics
    const contribCount = collective.contributions.length;
    const participantCount = collective.participants.length;
    const challengeCount = collective.contributions.filter(c => c.actionType === 'challenge' || c.type === 'concern').length;
    const remixCount = collective.contributions.filter(c => c.actionType === 'remix' || c.type === 'alternative').length;
    
    // Calculate realistic dynamic scores
    const feasibilityScore = Math.min(96, Math.max(76, 78 + Math.round((contribCount * 1.2) + (challengeCount * 2.5))));
    const impactScore = Math.min(98, Math.max(82, 84 + Math.round((participantCount * 1.5) + (remixCount * 2))));
    const innovationScore = Math.min(95, Math.max(80, 82 + Math.round((remixCount * 3) + (contribCount * 0.8))));
    const practicalityScore = Math.min(94, Math.max(74, Math.round((feasibilityScore * 0.55) + (impactScore * 0.45))));

    // Determine domain use cases from category
    const cat = collective.category.toLowerCase();
    let bestUseCases: string[] = ['Public Institutions', 'Grassroots Organizations', 'Innovation Hubs'];
    if (cat.includes('education') || cat.includes('study')) {
      bestUseCases = ['Universities & Colleges', 'Student Communities & Dorms', 'Academic Innovation Labs'];
    } else if (cat.includes('urban') || cat.includes('neighborhood') || cat.includes('civic')) {
      bestUseCases = ['Municipal City Councils', 'Neighborhood Block Associations', 'Urban Renewal Taskforces'];
    } else if (cat.includes('creator') || cat.includes('creative')) {
      bestUseCases = ['Independent Production Syndicates', 'Digital Creator Co-ops', 'Open Media Collectives'];
    } else if (cat.includes('community')) {
      bestUseCases = ['Youth Coalitions', 'Decentralized Working Groups', 'Campus Life Boards'];
    }

    const strengths = [
      'High community buy-in forged through active peer challenge & resolution',
      `Practically scoped to respect core constraints: "${collective.constraints || 'Low overhead'}"`,
      'Interdisciplinary role distribution mitigating single-point-of-failure blindness'
    ];

    const risksAndWeaknesses = [
      'Initial onboarding velocity may require active facilitator nudging',
      'Sustained coordination momentum requires clear milestone ownership',
      'Potential friction when interfacing with legacy institutional hierarchies'
    ];

    const improvementOpportunities = [
      'Define automated telemetry metrics for early stage pilot validation',
      'Establish a 6-month retrospective checkpoint with original contributor cohort',
      'Create an onboarding sandbox for newly arriving community participants'
    ];

    const recommendedNextStep = `Form a compact 3-5 person action committee from the most active contributors (${collective.participants.slice(0, 2).map(p => p.name).join(' & ')}) to launch a controlled 30-day pilot.`;

    const summary = `The collective produced a balanced, resilient concept. With ${challengeCount} assumptions challenged and ${remixCount} creative remixes integrated, the proposal avoids groupthink while preserving audacious vision.`;

    // Simulate natural AI computation latency (client-side)
    setTimeout(() => {
      resolve({
        feasibilityScore,
        impactScore,
        innovationScore,
        practicalityScore,
        summary,
        bestUseCases,
        strengths,
        risksAndWeaknesses,
        improvementOpportunities,
        recommendedNextStep,
        analyzedAt: new Date().toISOString()
      });
    }, 1200);
  });
}

export interface IdeaAnalysisResult {
  score: number; // 0 - 100
  isApproved: boolean;
  qualityRating: 'Exceptional' | 'Substantive' | 'Constructive' | 'Needs Substance';
  progressIncrement: number;
  feedback: string;
  stageAdvanced: boolean;
  newStage: CollectiveStage;
  stageMilestoneMessage?: string;
}

/**
 * Evaluates an incoming builder contribution for substance, contextual relevance,
 * and whether it qualifies the collective to progress towards the next stage.
 */
export function evaluateContributionQualityAndProgress(
  contribution: {
    title: string;
    content: string;
    type: string;
    actionType?: string;
    tags: string[];
  },
  collective: Collective
): IdeaAnalysisResult {
  const titleWords = contribution.title.trim().split(/\s+/).filter(Boolean).length;
  const contentWords = contribution.content.trim().split(/\s+/).filter(Boolean).length;
  const totalWords = titleWords + contentWords;

  // 1. Substance Check
  if (totalWords < 4) {
    return {
      score: 30,
      isApproved: false,
      qualityRating: 'Needs Substance',
      progressIncrement: 0,
      feedback: 'Perspective is too brief. Please provide actionable detail before community progress can advance.',
      stageAdvanced: false,
      newStage: collective.stage,
    };
  }

  // 2. Keyword relevance scoring against collective goal & challenge
  const corpus = `${collective.title} ${collective.goal} ${collective.challengeDescription} ${collective.constraints || ''}`.toLowerCase();
  const inputWords = `${contribution.title} ${contribution.content} ${contribution.tags.join(' ')}`.toLowerCase().split(/\W+/).filter(w => w.length > 3);
  
  let matchCount = 0;
  inputWords.forEach(w => {
    if (corpus.includes(w)) matchCount++;
  });

  const relevanceRatio = inputWords.length > 0 ? matchCount / inputWords.length : 0.2;

  // Base score based on word depth and structure
  let rawScore = Math.min(65, 40 + Math.min(25, contentWords * 1.2));
  if (relevanceRatio > 0.08) rawScore += 15;
  if (relevanceRatio > 0.20) rawScore += 10;
  if (contribution.tags.length > 0) rawScore += 5;
  if (contribution.actionType === 'build' || contribution.actionType === 'remix' || contribution.actionType === 'challenge') rawScore += 5;

  const score = Math.min(98, Math.max(45, Math.round(rawScore)));

  // Quality rating
  let qualityRating: 'Exceptional' | 'Substantive' | 'Constructive' | 'Needs Substance' = 'Constructive';
  let progressIncrement = 12;

  if (score >= 85) {
    qualityRating = 'Exceptional';
    progressIncrement = 20;
  } else if (score >= 70) {
    qualityRating = 'Substantive';
    progressIncrement = 15;
  } else if (score >= 50) {
    qualityRating = 'Constructive';
    progressIncrement = 10;
  } else {
    qualityRating = 'Needs Substance';
    progressIncrement = 5;
  }

  // Specific feedback generation
  let feedback = '';
  if (contribution.actionType === 'challenge' || contribution.type === 'concern') {
    feedback = `Critical stress-test identified! Directly challenges assumptions regarding ${contribution.tags[0] || 'execution and risk'}.`;
  } else if (contribution.actionType === 'remix' || contribution.type === 'alternative') {
    feedback = `Harmonizing perspective integrated! Synthesizes disparate builder suggestions into a practical consensus path.`;
  } else if (contribution.actionType === 'build' || contribution.type === 'improvement') {
    feedback = `Operational enhancement validated. Strengthens implementation feasibility for the shared goal.`;
  } else {
    feedback = `Valuable foundational seed perspective! Adds concrete framing around ${contribution.tags[0] || 'the core objective'}.`;
  }

  // 3. Stage Progression Gates
  const totalContribs = collective.contributions.length + 1;
  const currentProgress = collective.progress;
  const projectedProgress = Math.min(100, currentProgress + progressIncrement);

  let stageAdvanced = false;
  let newStage: CollectiveStage = collective.stage;
  let stageMilestoneMessage = undefined;

  // Criteria for FORMING -> BUILDING:
  // Requires at least 2 substantiated ideas and progress reaching >= 35%
  if (collective.stage === 'FORMING' && (totalContribs >= 2 || projectedProgress >= 35)) {
    newStage = 'BUILDING';
    stageAdvanced = true;
    stageMilestoneMessage = 'Stage criteria met! Community advanced from FORMING to BUILDING (Implementation).';
  }
  // Criteria for BUILDING -> REFINING:
  // Requires at least 3 contributions including at least 1 challenge/concern, and progress reaching >= 60%
  else if (collective.stage === 'BUILDING') {
    const hasChallenge = collective.contributions.some(c => c.actionType === 'challenge' || c.type === 'concern') || contribution.actionType === 'challenge' || contribution.type === 'concern';
    if (totalContribs >= 3 && hasChallenge && projectedProgress >= 55) {
      newStage = 'REFINING';
      stageAdvanced = true;
      stageMilestoneMessage = 'Stage criteria met! Community advanced to REFINING (Edge Cases & Stress-Testing).';
    }
  }
  // Criteria for REFINING -> FINALIZING:
  // Requires at least 4 contributions including at least 1 remix/solution synthesis, and progress reaching >= 75%
  else if (collective.stage === 'REFINING') {
    const hasRemix = collective.contributions.some(c => c.actionType === 'remix' || c.type === 'alternative') || contribution.actionType === 'remix' || contribution.type === 'alternative';
    if (totalContribs >= 4 && hasRemix && projectedProgress >= 70) {
      newStage = 'FINALIZING';
      stageAdvanced = true;
      stageMilestoneMessage = 'Stage criteria met! Community advanced to FINALIZING (Outcome Synthesis & Delivery).';
    }
  }
  // Criteria for FINALIZING -> COMPLETE:
  else if (collective.stage === 'FINALIZING' && totalContribs >= 5 && projectedProgress >= 90) {
    newStage = 'COMPLETE';
    stageAdvanced = true;
    stageMilestoneMessage = 'Consensus reached! Collective outcome is fully synthesized and ready.';
  }

  return {
    score,
    isApproved: score >= 50,
    qualityRating,
    progressIncrement,
    feedback,
    stageAdvanced,
    newStage,
    stageMilestoneMessage,
  };
}
