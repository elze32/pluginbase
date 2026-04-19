'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AppHeader } from '../../components/layout/AppHeader';
import { useSessionLogStore } from '../../stores/session-log-store';
import { DevStatusBar } from '../../components/dev/DevStatusBar';

export default function MainLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const pathname = usePathname();
  const log = useSessionLogStore(s => s.log);

  useEffect(() => {
    log({ type: 'page_view', path: pathname });
  }, [pathname, log]);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col">
      <AppHeader />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 md:py-12">
        {children}
      </main>
      <footer className="max-w-5xl mx-auto w-full px-6 py-12 border-t border-[var(--border)] text-center text-[var(--text-muted)] text-sm font-body mt-12">
        <p>© 2026 PluginBase — L'assistant de lucidité pour votre studio.</p>
      </footer>
      <DevStatusBar />
    </div>
  );
}
