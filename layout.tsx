import React from 'react';

interface RootLayoutProps {
  // Make children optional to resolve TS2322 in index.tsx:
  // "Property 'children' is missing in type '{}' but required in type 'RootLayoutProps'"
  children?: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-amber-200">
      {children}
    </div>
  );
}
