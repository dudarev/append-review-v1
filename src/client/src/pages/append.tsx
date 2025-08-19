import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, FileText, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppendPageProps {
  markdownContent: string;
  onMarkdownChange: (content: string) => void;
  onApplyChanges: () => void;
  notesCount: number;
}

export function AppendPage({ 
  markdownContent, 
  onMarkdownChange, 
  onApplyChanges,
  notesCount 
}: AppendPageProps) {
  const [showPreview, setShowPreview] = useState(false);
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

  const previewContent = showPreview ? (
    <div className="prose dark:prose-invert max-w-none p-4 bg-gray-50 dark:bg-gray-800 rounded-lg h-96 overflow-y-auto">
      {localContent ? (
        <div dangerouslySetInnerHTML={{ 
          __html: localContent
            .replace(/\n/g, '<br/>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
        }} />
      ) : (
        <p className="text-gray-500 dark:text-gray-400 italic">No content to preview</p>
      )}
    </div>
  ) : null;

  return (
    <div className="space-y-6">
      <div className="md:hidden">
        <h2 className="text-2xl font-semibold mb-2">Append Notes</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          Paste or type Markdown content. Notes are automatically extracted from paragraphs, lists, and code blocks.
        </p>
      </div>

      {notesCount > 0 && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">
                {notesCount} note{notesCount !== 1 ? 's' : ''} extracted
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Editor Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Editor</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                data-testid="button-preview-toggle"
                className="lg:hidden"
              >
                <Eye className="h-4 w-4 mr-1" />
                {showPreview ? "Edit" : "Preview"}
              </Button>
              <Button
                onClick={onApplyChanges}
                size="sm"
                data-testid="button-apply-changes"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Apply Changes
              </Button>
            </div>
          </div>
          
          <div className={cn("space-y-4", showPreview && "lg:block hidden")}>
            <Textarea
              value={localContent}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder={defaultContent}
              className="h-96 font-mono text-sm resize-none"
              data-testid="textarea-markdown-editor"
            />
          </div>

          {/* Mobile Preview */}
          <div className={cn("lg:hidden", !showPreview && "hidden")}>
            {previewContent}
          </div>
        </div>

        {/* Desktop Preview */}
        <div className="hidden lg:block space-y-4">
          <h3 className="text-lg font-medium">Preview</h3>
          {previewContent || (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg h-96 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400 italic">No content to preview</p>
            </div>
          )}
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
