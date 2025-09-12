import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface AppendPageProps {
  markdownContent: string;
  onMarkdownChange: (content: string) => void;
}

export function AppendPage({ 
  markdownContent, 
  onMarkdownChange
}: AppendPageProps) {
  const [localContent, setLocalContent] = useState(markdownContent);

  // Debounced save
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localContent !== markdownContent) {
        onMarkdownChange(localContent);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localContent, markdownContent, onMarkdownChange]);

  // Update local content when prop changes
  useEffect(() => {
    setLocalContent(markdownContent);
  }, [markdownContent]);

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
        <h3 className="text-lg font-medium">Editor</h3>
        <div className={cn("space-y-4")}
        >
          <Textarea
            value={localContent}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder={defaultContent}
            className="h-96 font-mono text-sm resize-none"
            data-testid="textarea-markdown-editor"
          />
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
        <p><strong>Note extraction rules:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>Paragraphs separated by blank lines become individual notes</li>
          <li>Contiguous list items are grouped as one note</li>
          <li>Code blocks (``` or ~~~) are treated as single notes</li>
          <li>Headings, horizontal rules, and YAML front matter are excluded</li>
        </ul>
      </div>
    </div>
  );
}
