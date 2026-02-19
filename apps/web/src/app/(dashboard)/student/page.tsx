import Link from 'next/link';
import { BookOpen, ClipboardList, TrendingUp, Sprout, ArrowRight } from 'lucide-react';

const actions = [
  { href: '/courses', label: 'Browse Courses', detail: 'Continue enrolled learning tracks', icon: BookOpen },
  { href: '/assignments', label: 'My Assignments', detail: 'Complete and submit pending work', icon: ClipboardList },
  { href: '/progress', label: 'Track Progress', detail: 'Review achievement and completion rate', icon: TrendingUp },
  { href: '/dashboard', label: 'Learning Overview', detail: 'Return to your personalized summary', icon: Sprout },
];

export default function StudentDashboard() {
  return (
    <div className="space-y-8 p-8">
      <header className="rounded-2xl bg-gradient-to-r from-sky-700 to-sky-500 p-6 text-white">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium">
          <BookOpen size={14} />
          Learning Hub
        </div>
        <h1 className="text-3xl font-display font-bold">Student Dashboard</h1>
        <p className="mt-2 text-sm text-white/85">Stay on track with courses, assignments, and progress goals.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {actions.map(action => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
                <Icon size={18} />
              </div>
              <h2 className="font-semibold text-slate-900">{action.label}</h2>
              <p className="mt-1 text-sm text-slate-600">{action.detail}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-sky-700">
                Open
                <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
