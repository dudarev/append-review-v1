import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AboutDialogProps {
  trigger?: React.ReactNode;
}

export function AboutDialog({ trigger }: AboutDialogProps) {
  const Trigger = trigger ?? (
    <Button variant="ghost" size="icon" data-testid="button-about">
      <Info className="h-5 w-5" />
      <span className="sr-only">About</span>
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>About Append & Review</DialogTitle>
          <DialogDescription>
            A minimal append-and-review workflow inspired by Andrej Karpathy’s note.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <span className="font-medium">Version:</span>
            <span>v{import.meta.env.VITE_APP_VERSION}</span>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              Back up your data regularly. This app stores everything only in your browser’s localStorage. 
              Clearing site data, switching browsers/profiles, or some updates can wipe it. Suggested backups:
              <ul className="list-disc list-inside mt-1">
                <li>Copy your Markdown from the Append page into a file (e.g., notes.md).</li>
                <li>Optionally export localStorage via your browser’s developer tools.</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div>
            <div className="font-medium mb-2">Links</div>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              <li>
                <a
                  href="https://github.com/dudarev/append-review-v1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="https://karpathy.bearblog.dev/the-append-and-review-note/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Karpathy — The Append and Review Note
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/dudarev/append-review-v1/blob/main/CHANGELOG.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Changelog
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/dudarev/append-review-v1/issues/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Report an issue
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-medium mb-2">Keyboard shortcuts</div>
            <div className="space-y-1 text-gray-700 dark:text-gray-300">
              <div>
                Views: <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">1</kbd> Append,
                <kbd className="ml-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">2</kbd> Review,
                <kbd className="ml-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">3</kbd> Ranking,
                <kbd className="ml-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">4</kbd> Archive
              </div>
              <div>
                Review: <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">A</kbd> left wins,
                <kbd className="ml-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">L</kbd> right wins,
                <kbd className="ml-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">K</kbd> skip,
                <kbd className="ml-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">N</kbd> new pair
              </div>
            </div>
          </div>

          <div className="text-gray-600 dark:text-gray-400">
            <div className="font-medium mb-1">Data</div>
            <p>
              All data stays in your browser localStorage (key: <code>appendReview:v1</code>). No backend or
              network storage.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
