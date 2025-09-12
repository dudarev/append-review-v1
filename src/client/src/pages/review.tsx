import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw, ChevronUp, ChevronDown, SkipForward, Archive, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Note } from "@shared/schema";

interface ReviewPageProps {
  currentPair: { noteA: Note; noteB: Note } | null;
  onVote: (winner: "A" | "B" | "skip") => void;
  onGenerateNewPair: () => void;
  onArchive: (noteId: string) => void;
  canReview: boolean;
  reviewTextDensity: "compact" | "comfortable" | "expanded";
}

export function ReviewPage({ 
  currentPair, 
  onVote, 
  onGenerateNewPair,
  onArchive,
  canReview,
  reviewTextDensity,
}: ReviewPageProps) {
  const [isVoting, setIsVoting] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const heightClass = (isExpanded: boolean) => {
    if (isExpanded) return "max-h-[60vh]";
    switch (reviewTextDensity) {
      case "compact":
        return "max-h-24 md:max-h-28"; // 6-7rem
      case "expanded":
        return "max-h-56 md:max-h-64"; // 14-16rem
      case "comfortable":
      default:
        return "max-h-36 md:max-h-40"; // 9-10rem
    }
  };

  const toggleExpand = (noteId: string) => {
    setExpanded((prev) => ({ ...prev, [noteId]: !prev[noteId] }));
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentPair || isVoting) return;

      switch (e.key.toLowerCase()) {
        case 'a':
          e.preventDefault();
          handleVote("A");
          break;
        case 'l':
          e.preventDefault();
          handleVote("B");
          break;
        case 'k':
          e.preventDefault();
          handleVote("skip");
          break;
        case 'n':
          e.preventDefault();
          onGenerateNewPair();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPair, isVoting, onVote, onGenerateNewPair]);

  const handleVote = async (winner: "A" | "B" | "skip") => {
    setIsVoting(true);
    
    // Add small delay for better UX
    setTimeout(() => {
      onVote(winner);
      setIsVoting(false);
    }, 200);
  };

  if (!canReview) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <RotateCcw className="h-8 w-8 text-gray-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium">No Notes to Review</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            You need at least 2 notes to start reviewing. Go to the Append tab to add some notes from your Markdown content.
          </p>
        </div>
      </div>
    );
  }

  if (!currentPair) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <RotateCcw className="h-8 w-8 text-gray-400 animate-spin" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Loading Pair...</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Generating the next pair of notes to compare.
          </p>
        </div>
        <Button onClick={onGenerateNewPair} data-testid="button-generate-pair">
          Generate New Pair
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="md:hidden">
        <h2 className="text-2xl font-semibold mb-4">Review Notes</h2>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="h-64 relative">
            <CardContent className="p-6 h-full">
              <Button
                onClick={() => onArchive(currentPair.noteA.id)}
                disabled={isVoting}
                variant="ghost"
                size="sm"
                data-testid="button-archive-left"
                className="absolute top-2 right-2 z-10 h-8 px-2 text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
              >
                <Archive className="h-3 w-3 mr-1" />
                Archive
              </Button>
              <button
                onClick={() => toggleExpand(currentPair.noteA.id)}
                className="absolute bottom-2 right-2 z-10 h-8 px-2 text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                aria-label={expanded[currentPair.noteA.id] ? "Collapse" : "Expand"}
              >
                {expanded[currentPair.noteA.id] ? (
                  <span className="inline-flex items-center"><Minimize2 className="h-3 w-3 mr-1" /> Collapse</span>
                ) : (
                  <span className="inline-flex items-center"><Maximize2 className="h-3 w-3 mr-1" /> Expand</span>
                )}
              </button>

              <div className="flex flex-col h-full">
                <div className="flex-1 pr-2">
                  <div className="prose dark:prose-invert prose-sm max-w-none h-full relative">
                    <div className={`whitespace-pre-wrap break-words font-sans text-sm leading-6 text-gray-900 dark:text-gray-100 overflow-y-auto ${heightClass(!!expanded[currentPair.noteA.id])}`}>
                      {currentPair.noteA.text}
                    </div>
                    {!expanded[currentPair.noteA.id] && (
                      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="h-64 relative">
            <CardContent className="p-6 h-full">
              <Button
                onClick={() => onArchive(currentPair.noteB.id)}
                disabled={isVoting}
                variant="ghost"
                size="sm"
                data-testid="button-archive-right"
                className="absolute top-2 right-2 z-10 h-8 px-2 text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
              >
                <Archive className="h-3 w-3 mr-1" />
                Archive
              </Button>
              <button
                onClick={() => toggleExpand(currentPair.noteB.id)}
                className="absolute bottom-2 right-2 z-10 h-8 px-2 text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                aria-label={expanded[currentPair.noteB.id] ? "Collapse" : "Expand"}
              >
                {expanded[currentPair.noteB.id] ? (
                  <span className="inline-flex items-center"><Minimize2 className="h-3 w-3 mr-1" /> Collapse</span>
                ) : (
                  <span className="inline-flex items-center"><Maximize2 className="h-3 w-3 mr-1" /> Expand</span>
                )}
              </button>
              <div className="flex flex-col h-full">
                <div className="flex-1 pr-2">
                  <div className="prose dark:prose-invert prose-sm max-w-none h-full relative">
                    <div className={`whitespace-pre-wrap break-words font-sans text-sm leading-6 text-gray-900 dark:text-gray-100 overflow-y-auto ${heightClass(!!expanded[currentPair.noteB.id])}`}>
                      {currentPair.noteB.text}
                    </div>
                    {!expanded[currentPair.noteB.id] && (
                      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Desktop Voting Buttons */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => handleVote("A")}
            disabled={isVoting}
            size="lg"
            data-testid="button-vote-left"
            className="min-w-32"
          >
            <ChevronUp className="h-5 w-5 mr-2" />
            Left Wins (A)
          </Button>
          <Button
            onClick={() => handleVote("skip")}
            disabled={isVoting}
            variant="outline"
            size="lg"
            data-testid="button-vote-skip"
            className="min-w-24"
          >
            <SkipForward className="h-5 w-5 mr-2" />
            Skip (K)
          </Button>
          <Button
            onClick={() => handleVote("B")}
            disabled={isVoting}
            size="lg"
            data-testid="button-vote-right"
            className="min-w-32"
          >
            <ChevronDown className="h-5 w-5 mr-2" />
            Right Wins (L)
          </Button>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-4">
        {/* Stacked Cards */}
        <div className="space-y-4">
          <Card className="min-h-32 relative">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                  Top Note
                </span>
                <Button
                  onClick={() => onArchive(currentPair.noteA.id)}
                  disabled={isVoting}
                  variant="ghost"
                  size="sm"
                  data-testid="button-archive-top"
                  className="h-6 px-2 text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                >
                  <Archive className="h-3 w-3 mr-1" />
                  Archive
                </Button>
              </div>
              <div className="prose dark:prose-invert prose-sm max-w-none relative">
                <div className={`whitespace-pre-wrap break-words font-sans text-sm leading-6 text-gray-900 dark:text-gray-100 overflow-y-auto ${heightClass(!!expanded[currentPair.noteA.id])}`}>
                  {currentPair.noteA.text}
                </div>
                {!expanded[currentPair.noteA.id] && (
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
                )}
                <button
                  onClick={() => toggleExpand(currentPair.noteA.id)}
                  className="absolute -bottom-2 right-0 translate-y-full text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                  aria-label={expanded[currentPair.noteA.id] ? "Collapse" : "Expand"}
                >
                  {expanded[currentPair.noteA.id] ? (
                    <span className="inline-flex items-center"><Minimize2 className="h-3 w-3 mr-1" /> Collapse</span>
                  ) : (
                    <span className="inline-flex items-center"><Maximize2 className="h-3 w-3 mr-1" /> Expand</span>
                  )}
                </button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">VS</span>
            </div>
          </div>

          <Card className="min-h-32 relative">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                  Bottom Note
                </span>
                <Button
                  onClick={() => onArchive(currentPair.noteB.id)}
                  disabled={isVoting}
                  variant="ghost"
                  size="sm"
                  data-testid="button-archive-bottom"
                  className="h-6 px-2 text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                >
                  <Archive className="h-3 w-3 mr-1" />
                  Archive
                </Button>
              </div>
              <div className="prose dark:prose-invert prose-sm max-w-none relative">
                <div className={`whitespace-pre-wrap break-words font-sans text-sm leading-6 text-gray-900 dark:text-gray-100 overflow-y-auto ${heightClass(!!expanded[currentPair.noteB.id])}`}>
                  {currentPair.noteB.text}
                </div>
                {!expanded[currentPair.noteB.id] && (
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
                )}
                <button
                  onClick={() => toggleExpand(currentPair.noteB.id)}
                  className="absolute -bottom-2 right-0 translate-y-full text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                  aria-label={expanded[currentPair.noteB.id] ? "Collapse" : "Expand"}
                >
                  {expanded[currentPair.noteB.id] ? (
                    <span className="inline-flex items-center"><Minimize2 className="h-3 w-3 mr-1" /> Collapse</span>
                  ) : (
                    <span className="inline-flex items-center"><Maximize2 className="h-3 w-3 mr-1" /> Expand</span>
                  )}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Voting Buttons - Fixed at bottom */}
        <div className="fixed bottom-16 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex space-x-2">
            <Button
              onClick={() => handleVote("A")}
              disabled={isVoting}
              className="flex-1 h-12"
              data-testid="button-vote-top"
            >
              <ChevronUp className="h-5 w-5 mr-1" />
              Top Wins
            </Button>
            <Button
              onClick={() => handleVote("skip")}
              disabled={isVoting}
              variant="outline"
              className="px-6 h-12"
              data-testid="button-vote-skip-mobile"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => handleVote("B")}
              disabled={isVoting}
              className="flex-1 h-12"
              data-testid="button-vote-bottom"
            >
              <ChevronDown className="h-5 w-5 mr-1" />
              Bottom Wins
            </Button>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="hidden md:block text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
        <p>
          Keyboard shortcuts: <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">A</kbd> for left wins, 
          <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded mx-1">L</kbd> for right wins, 
          <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">K</kbd> to skip
        </p>
      </div>
    </div>
  );
}
