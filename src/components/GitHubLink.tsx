import { Github } from 'lucide-react'

export function GitHubLink() {
  return (
    <a
      href="https://github.com/cursor-online-piano"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
      aria-label="GitHub repository"
    >
      <Github className="w-6 h-6" />
    </a>
  )
} 