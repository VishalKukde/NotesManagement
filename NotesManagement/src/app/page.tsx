import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus, Search } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 select-none">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Hero Header */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-primary/10 rounded-full">
                <BookOpen className="w-12 h-12 text-primary" />
              </div>
            </div>
            <h1 className="text-5xl font-bold tracking-tight">
              Notes Management System
            </h1>
            <p className="text-xl text-muted-foreground">
              Organize, manage, and access your notes with ease. Built with modern
              technologies for optimal performance and user experience.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 my-12">
            <div className="p-6 bg-card rounded-lg border border-border/50 hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Create Notes</h3>
              <p className="text-sm text-muted-foreground">
                Quickly create and save your notes with a clean, intuitive interface
              </p>
            </div>

            <div className="p-6 bg-card rounded-lg border border-border/50 hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Search & Filter</h3>
              <p className="text-sm text-muted-foreground">
                Find notes instantly with powerful full-text search capabilities
              </p>
            </div>

            <div className="p-6 bg-card rounded-lg border border-border/50 hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Organize Notes</h3>
              <p className="text-sm text-muted-foreground">
                View, edit, and manage all your notes in one centralized location
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/notes">
              <Button size="lg" className="gap-2">
                <BookOpen className="w-5 h-5" />
                View All Notes
              </Button>
            </Link>
            <Link href="/notes/create">
              <Button size="lg" variant="outline" className="gap-2">
                <Plus className="w-5 h-5" />
                Create New Note
              </Button>
            </Link>
          </div>

          {/* Tech Stack */}
          <div className="mt-16 pt-12 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-4">
              Built with modern technologies
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'Next.js 15',
                'React 18',
                'TypeScript',
                'MongoDB',
                'TailwindCSS',
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
