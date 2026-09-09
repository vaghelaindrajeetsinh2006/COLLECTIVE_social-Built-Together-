import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DiscoverySection } from './components/DiscoverySection';
import { SocialComparisonModal } from './components/SocialComparisonModal';
import { CreateCollectiveModal } from './components/CreateCollectiveModal';
import { WorkspaceHeader } from './components/Workspace/WorkspaceHeader';
import { SpatialNetworkCanvas } from './components/Workspace/SpatialNetworkCanvas';
import { PathwayListView } from './components/Workspace/PathwayListView';
import { AddContributionModal } from './components/Workspace/AddContributionModal';
import { CollectiveResultView } from './components/Workspace/CollectiveResultView';
import { AIInsightModal } from './components/Workspace/AIInsightModal';
import { InviteModal } from './components/InviteModal';
import { BackgroundSelectorModal } from './components/BackgroundSelectorModal';
import { AmbientBackgroundCanvas } from './components/AmbientBackgroundCanvas';
import { ToastContainer } from './components/Toast';
import { useCollectivePlatform } from './hooks/useCollectivePlatform';
import { Palette } from 'lucide-react';
import { BACKGROUND_THEMES } from './types/background';

export default function App() {
  const {
    collectives, activeCollective, workspaceView, setWorkspaceView,
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
  } = useCollectivePlatform();

  return (
    <div className={`min-h-screen ${currentTheme.bgClass} text-neutral-100 flex flex-col selection:bg-amber-400/30 selection:text-amber-200 relative transition-colors duration-500`}>
      {/* Theme Dynamic Ambient Particles Layer */}
      <AmbientBackgroundCanvas themeId={currentThemeId} enabled={particlesEnabled} />

      {/* Navigation */}
      <Navbar
        activeCollective={activeCollective}
        onBackToDiscovery={handleBackToDiscovery}
        onOpenCreate={() => setIsCreateOpen(true)}
        onOpenComparison={() => setIsComparisonOpen(true)}
        onResetData={handleResetData}
        onOpenBackgroundModal={() => setIsBgModalOpen(true)}
        currentThemeName={currentTheme.name}
        themeAccentColor={currentTheme.accentColor}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {!activeCollective ? (
          /* HOMEPAGE & DISCOVERY */
          <div className="space-y-4">
            {/* Hero Section */}
            <Hero
              onStartCollective={() => setIsCreateOpen(true)}
              onExploreCollectives={() => {
                const el = document.getElementById('discovery-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              totalCollectives={collectives.length}
              totalBuilders={totalBuilders}
              totalContributions={totalContributions}
            />

            {/* Discovery Section (WHAT ARE PEOPLE BUILDING TOGETHER?) */}
            <DiscoverySection
              collectives={collectives}
              onSelectCollective={handleSelectCollective}
              onToggleJoin={(id, e) => handleToggleJoin(id, e)}
              onOpenInvite={(col) => handleOpenInvite(col)}
              onStartCollective={() => setIsCreateOpen(true)}
            />
          </div>
        ) : (
          /* COLLECTIVE WORKSPACE (Visual centerpiece) */
          <div className="animate-in fade-in duration-200">
            {/* Workspace Header */}
            <WorkspaceHeader
              collective={activeCollective}
              activeView={workspaceView}
              onChangeView={setWorkspaceView}
              onOpenAddContribution={handleOpenAddNewSeed}
              onOpenOutcome={handleOpenOutcome}
              onToggleJoin={() => handleToggleJoin(activeCollective.id)}
              onOpenInvite={() => handleOpenInvite(activeCollective)}
              onAdvanceStage={handleAdvanceStage}
              onBack={handleBackToDiscovery}
            />

            {/* Content: Outcome View vs Spatial Canvas vs Pathway */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {isViewingOutcome && activeCollective.outcome ? (
                <CollectiveResultView
                  collective={activeCollective}
                  outcome={activeCollective.outcome}
                  onAnalyzeWithAI={handleAnalyzeWithAI}
                  onBackToCanvas={() => setIsViewingOutcome(false)}
                />
              ) : workspaceView === 'canvas' ? (
                <SpatialNetworkCanvas
                  collective={activeCollective}
                  onSelectNodeAction={handleOpenAddWithAction}
                  onVoteNode={handleVoteNode}
                  onOpenOutcome={handleOpenOutcome}
                  onAddNewIdea={handleOpenAddNewSeed}
                />
              ) : (
                <PathwayListView
                  collective={activeCollective}
                  onSelectNodeAction={handleOpenAddWithAction}
                  onVoteNode={handleVoteNode}
                  onAddNewIdea={handleOpenAddNewSeed}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-neutral-900 bg-neutral-950 py-8 text-neutral-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-neutral-300">COLLECTIVE</span>
            <span>&bull;</span>
            <span className="text-neutral-400">Social, Built Together.</span>
          </div>
          <div className="text-center sm:text-right font-mono text-[11px] text-neutral-500">
            “Humans build the idea. AI helps understand its potential.”
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CreateCollectiveModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreateCollective={handleCreateCollective}
      />

      <SocialComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        onStartCollective={() => setIsCreateOpen(true)}
      />

      <AddContributionModal
        isOpen={isAddContributionOpen}
        onClose={() => setIsAddContributionOpen(false)}
        collectiveTitle={activeCollective?.title || ''}
        parentNode={contributionParentNode}
        initialActionType={contributionActionType}
        currentUser={currentUser}
        onAddContribution={handleAddContribution}
      />

      {inviteCollective && (
        <InviteModal
          isOpen={isInviteOpen}
          onClose={() => setIsInviteOpen(false)}
          collective={inviteCollective}
          onAddParticipant={handleAddParticipant}
          currentUser={currentUser}
          onToggleJoin={handleToggleJoin}
        />
      )}

      {activeCollective && (
        <AIInsightModal
          isOpen={isAIModalOpen}
          onClose={() => setIsAIModalOpen(false)}
          collective={activeCollective}
          insight={activeCollective.aiInsight || null}
          isLoading={isAILoading}
        />
      )}

      {/* Background Selector Modal */}
      <BackgroundSelectorModal
        isOpen={isBgModalOpen}
        onClose={() => setIsBgModalOpen(false)}
        currentThemeId={currentThemeId}
        onSelectTheme={(themeId) => {
          setCurrentThemeId(themeId);
          const theme = BACKGROUND_THEMES.find(t => t.id === themeId);
          addToast(`Theme switched to ${theme?.name || themeId}`, 'info');
        }}
        particlesEnabled={particlesEnabled}
        onToggleParticles={() => {
          setParticlesEnabled(prev => {
            const next = !prev;
            addToast(`Ambient particles ${next ? 'enabled' : 'disabled'}`, 'info');
            return next;
          });
        }}
      />

      {/* Quick Floating Background Switcher Button */}
      <button
        id="quick-floating-bg-btn"
        onClick={() => setIsBgModalOpen(true)}
        className="fixed bottom-4 right-4 z-30 px-3 py-1.5 rounded-full bg-neutral-900/90 hover:bg-neutral-850 border border-neutral-700/80 backdrop-blur-md text-neutral-300 hover:text-white text-xs font-semibold shadow-lg shadow-black/40 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
        title="Change workspace background theme"
        aria-label="Change workspace background theme"
      >
        <Palette className="w-3.5 h-3.5 text-amber-400" />
        <span className="hidden sm:inline">{currentTheme.name}</span>
        <span 
          className="w-2 h-2 rounded-full ml-0.5 shadow-sm" 
          style={{ backgroundColor: currentTheme.accentColor }} 
        />
      </button>

      {/* Floating toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
