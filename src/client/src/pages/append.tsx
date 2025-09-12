import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface AppendPageProps {
  markdownContent: string;
  onMarkdownChange: (content: string) => void;
}

export function AppendPage({ 
  markdownContent, 
  onMarkdownChange
}: AppendPageProps) {
  const [localContent, setLocalContent] = useState(markdownContent);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const savedTimerRef = useRef<number | null>(null);
  const fadeTimerRef = useRef<number | null>(null);
  const [isFadingSaved, setIsFadingSaved] = useState(false);
  const RULES_OPEN_KEY = "append:rulesOpen";
  const [rulesOpen, setRulesOpen] = useState(false);

  // Debounced save + indicator
  useEffect(() => {
    if (localContent !== markdownContent) {
      setIsSaving(true);
      setShowSaved(false);
      setIsFadingSaved(false);
      if (savedTimerRef.current) {
        window.clearTimeout(savedTimerRef.current);
        savedTimerRef.current = null;
      }
      if (fadeTimerRef.current) {
        window.clearTimeout(fadeTimerRef.current);
        fadeTimerRef.current = null;
      }
    }

    const timer = setTimeout(() => {
      if (localContent !== markdownContent) {
        onMarkdownChange(localContent);
        setIsSaving(false);
        setShowSaved(true);
        setIsFadingSaved(false);
        if (savedTimerRef.current) window.clearTimeout(savedTimerRef.current);
        savedTimerRef.current = window.setTimeout(() => {
          setIsFadingSaved(true);
          if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
          fadeTimerRef.current = window.setTimeout(() => {
            setShowSaved(false);
            setIsFadingSaved(false);
            fadeTimerRef.current = null;
          }, 220);
          savedTimerRef.current = null;
        }, 1400);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localContent, markdownContent, onMarkdownChange]);

  // Cleanup any timers on unmount
  useEffect(() => {
    return () => {
      if (savedTimerRef.current) window.clearTimeout(savedTimerRef.current);
      if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
    };
  }, []);

  // Update local content when prop changes
  useEffect(() => {
    setLocalContent(markdownContent);
  }, [markdownContent]);

  // Persist rules collapsed/expanded preference
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RULES_OPEN_KEY);
      if (raw != null) {
        setRulesOpen(raw === "1");
      }
    } catch {
      // ignore
    }
  }, []);

  const handleRulesChange = (val: string) => {
    const open = val === "rules";
    setRulesOpen(open);
    try {
      localStorage.setItem(RULES_OPEN_KEY, open ? "1" : "0");
    } catch {
      // ignore
    }
  };

  const handleContentChange = (value: string) => {
    setLocalContent(value);
  };

  const defaultContent = `# My Notes

## Key Ideas
- Important concept one
- Another crucial point

## Code Example
\`\`\`javascript
function prioritizeNotes() {
  // Implementation here
}
\`\`\`

## Questions
- What are the main challenges?
- How can we improve the process?

Remember to separate notes with blank lines!`;

  return (
    <div className="space-y-6">
      <div className="md:hidden">
        <h2 className="text-2xl font-semibold mb-2">Append Notes</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          Paste or type Markdown content. Notes are automatically extracted from paragraphs, lists, and code blocks.
        </p>
      </div>

      {/* Editor only (full width) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">Editor</h3>
          <span
            className={cn(
              "text-xs transition-opacity duration-200",
              isSaving || (showSaved && !isFadingSaved) ? "opacity-100" : "opacity-0",
              showSaved && !isSaving ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"
            )}
            aria-live="polite"
            data-testid="editor-save-indicator"
          >
            {isSaving ? "Saving…" : showSaved ? "Saved" : ""}
          </span>
        </div>
        <div className={cn("space-y-4")}
        >
          <Textarea
            value={localContent}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder={defaultContent}
            className="min-h-[24rem] h-[50vh] md:h-[60vh] font-mono text-sm resize-none"
            data-testid="textarea-markdown-editor"
          />
        </div>
      </div>

      <Accordion
        type="single"
        collapsible
        value={rulesOpen ? "rules" : ""}
        onValueChange={handleRulesChange}
      >
        <AccordionItem value="rules">
          <AccordionTrigger className="text-sm">Note extraction rules</AccordionTrigger>
          <AccordionContent>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <ul className="list-disc list-inside space-y-1">
                <li>Paragraphs separated by blank lines become individual notes</li>
                <li>Contiguous list items are grouped as one note</li>
                <li>Code blocks (``` or ~~~) are treated as single notes</li>
                <li>Headings, horizontal rules, and YAML front matter are excluded</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
