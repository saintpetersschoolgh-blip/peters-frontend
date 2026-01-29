import React from 'react';

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <button
      type="button"
      onClick={() => (window.location.hash = `#${href}`)}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      }`}
    >
      {label}
    </button>
  );
}

export function SyllabusNav({ pathname }: { pathname: string }) {
  const items = [
    { href: '/teachers/syllabus', label: 'Overview', match: (p: string) => p === '/teachers/syllabus' },
    { href: '/teachers/syllabus/create', label: 'Add Syllabus', match: (p: string) => p.startsWith('/teachers/syllabus/create') },
    { href: '/teachers/syllabus/progress', label: 'Progress', match: (p: string) => p.startsWith('/teachers/syllabus/progress') },
    { href: '/teachers/syllabus/submit', label: 'Submit', match: (p: string) => p.startsWith('/teachers/syllabus/submit') },
    { href: '/teachers/syllabus/status', label: 'Status', match: (p: string) => p.startsWith('/teachers/syllabus/status') },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) => (
        <NavLink key={it.href} href={it.href} label={it.label} active={it.match(pathname)} />
      ))}
    </div>
  );
}

