import Link from 'next/link';
import { Shield, Users, BookOpen, FileText, TrendingUp, ArrowRight } from 'lucide-react';

const actions = [
  { href: '/students', label: 'Manage Users', detail: 'Review learners and staff records', icon: Users },
  { href: '/courses', label: 'Review Courses', detail: 'Audit curriculum and publication status', icon: BookOpen },
  { href: '/assignments', label: 'Monitor Assignments', detail: 'Track submissions and grading flow', icon: FileText },
  { href: '/progress', label: 'System Progress', detail: 'Inspect performance and completion trends', icon: TrendingUp },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8 p-8">
      <header className="rounded-2xl bg-gradient-to-r from-primary-700 to-primary-500 p-6 text-white">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium">
          <Shield size={14} />
          Admin Console
        </div>
        <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-white/85">Operational control center for users, curriculum, and system health.</p>
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
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                <Icon size={18} />
              </div>
              <h2 className="font-semibold text-slate-900">{action.label}</h2>
              <p className="mt-1 text-sm text-slate-600">{action.detail}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-700">
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
