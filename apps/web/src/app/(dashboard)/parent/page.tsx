import Link from 'next/link';
import { Heart, TrendingUp, CalendarDays, MessageSquare, ArrowRight } from 'lucide-react';

const actions = [
  { href: '/progress', label: 'Progress Snapshot', detail: 'Track current learning momentum', icon: TrendingUp },
  { href: '/assignments', label: 'Assignment Check', detail: 'Review active and upcoming tasks', icon: CalendarDays },
  { href: '/courses', label: 'Course Overview', detail: 'See active classes and content scope', icon: MessageSquare },
  { href: '/dashboard', label: 'Family Summary', detail: 'Return to role summary dashboard', icon: Heart },
];

export default function ParentDashboard() {
  return (
    <div className="space-y-8 p-8">
      <header className="rounded-2xl bg-gradient-to-r from-teal-700 to-teal-500 p-6 text-white">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium">
          <Heart size={14} />
          Family View
        </div>
        <h1 className="text-3xl font-display font-bold">Parent Dashboard</h1>
        <p className="mt-2 text-sm text-white/85">Stay informed on student progress, assignments, and course activity.</p>
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
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <Icon size={18} />
              </div>
              <h2 className="font-semibold text-slate-900">{action.label}</h2>
              <p className="mt-1 text-sm text-slate-600">{action.detail}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-700">
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

