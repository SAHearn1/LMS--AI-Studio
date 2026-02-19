import Link from 'next/link';
import { GraduationCap, PlusCircle, Sparkles, FilePenLine, Users, ArrowRight } from 'lucide-react';

const actions = [
  { href: '/courses/new', label: 'Create Course', detail: 'Publish a new instructional pathway', icon: PlusCircle },
  { href: '/lessons/generate', label: 'Generate Lesson', detail: 'Use AI to draft differentiated lessons', icon: Sparkles },
  { href: '/assignments/new', label: 'Create Assignment', detail: 'Design and assign student work', icon: FilePenLine },
  { href: '/students', label: 'View Students', detail: 'Check class roster and learner status', icon: Users },
];

export default function TeacherDashboard() {
  return (
    <div className="space-y-8 p-8">
      <header className="rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-500 p-6 text-white">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium">
          <GraduationCap size={14} />
          Teaching Workspace
        </div>
        <h1 className="text-3xl font-display font-bold">Teacher Dashboard</h1>
        <p className="mt-2 text-sm text-white/85">Build lessons, assign work, and monitor learners from one place.</p>
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
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <Icon size={18} />
              </div>
              <h2 className="font-semibold text-slate-900">{action.label}</h2>
              <p className="mt-1 text-sm text-slate-600">{action.detail}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-700">
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
