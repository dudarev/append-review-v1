import { AboutDialog } from "@/components/about-dialog";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 hidden md:block">
      <div className="max-w-6xl mx-auto w-full px-4 py-4 text-xs text-gray-500 dark:text-gray-400 flex flex-wrap items-center gap-x-4 gap-y-2">
        <a
          href="https://github.com/dudarev/append-review-v1"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          GitHub
        </a>
        <a
          href="https://karpathy.bearblog.dev/the-append-and-review-note/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Karpathy’s note
        </a>
        <AboutDialog
          trigger={
            <button className="underline" data-testid="link-about">
              About
            </button>
          }
        />
      </div>
    </footer>
  );
}
