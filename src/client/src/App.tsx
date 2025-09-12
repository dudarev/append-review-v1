import { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { useThemeContext } from "@/components/theme-provider";
import { MobileNav } from "@/components/mobile-nav";
import { SettingsDialog } from "@/components/settings-dialog";
import { AppendPage } from "@/pages/append";
import { ReviewPage } from "@/pages/review";
import { RankingPage } from "@/pages/ranking";
import { ArchivePage } from "@/pages/archive";
import { useNotes } from "@/hooks/use-notes";
import { Button } from "@/components/ui/button";
import { ClipboardList, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

function AppContent() {
  const [currentView, setCurrentView] = useState("append");
  const { theme, toggleTheme } = useThemeContext();
  const {
    data,
    activeNotes,
    archivedNotes,
    currentPair,
    updateMarkdown,
    parseAndApplyNotes,
    submitVote,
    generateNewPair,
    archiveNote,
    unarchiveNote,
    resetRankings,
    clearAllData,
    canReview,
  } = useNotes();

  // Keyboard shortcuts for view switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) {
        return; // Don't trigger shortcuts when typing in inputs
      }

      switch (e.key) {
        case '1':
          e.preventDefault();
          setCurrentView("append");
          break;
        case '2':
          e.preventDefault();
          setCurrentView("review");
          break;
        case '3':
          e.preventDefault();
          setCurrentView("ranking");
          break;
        case '4':
          e.preventDefault();
          setCurrentView("archive");
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-apply changes when switching from append to other views
  useEffect(() => {
    if (currentView !== "append") {
      parseAndApplyNotes();
    }
  }, [currentView, parseAndApplyNotes]);

  const navItems = [
    { id: "append", label: "Append" },
    { id: "review", label: "Review" },
    { id: "ranking", label: "Ranking" },
    { id: "archive", label: "Archive" },
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case "append":
        return (
          <AppendPage
            markdownContent={data.markdownContent}
            onMarkdownChange={updateMarkdown}
          />
        );
      case "review":
        return (
          <ReviewPage
            currentPair={currentPair}
            onVote={submitVote}
            onGenerateNewPair={generateNewPair}
            onArchive={archiveNote}
            canReview={canReview}
          />
        );
      case "ranking":
        return <RankingPage notes={activeNotes} />;
      case "archive":
        return (
          <ArchivePage
            archivedNotes={archivedNotes}
            onUnarchive={unarchiveNote}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Desktop Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 hidden md:block">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ClipboardList className="text-primary-500 text-xl h-6 w-6" />
            <h1 className="text-xl font-semibold">Append & Review</h1>
            <span className="text-xs text-gray-500 dark:text-gray-400 select-none">v{import.meta.env.VITE_APP_VERSION}</span>
          </div>
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <nav className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView(item.id)}
                  data-testid={`nav-desktop-${item.id}`}
                  className={cn(
                    "px-4 py-2 text-sm font-medium",
                    currentView === item.id
                      ? "bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  {item.label}
                </Button>
              ))}
            </nav>
            
            <SettingsDialog
              onResetRankings={resetRankings}
              onClearAllData={clearAllData}
            />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Header (compact) */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 md:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ClipboardList className="text-primary-500 h-5 w-5" />
            <span className="text-base font-semibold">Append & Review</span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 select-none">v{import.meta.env.VITE_APP_VERSION}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 pb-20 md:pb-6">
        {renderCurrentView()}
      </main>


      {/* Mobile Navigation */}
      <MobileNav currentView={currentView} onViewChange={setCurrentView} />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
