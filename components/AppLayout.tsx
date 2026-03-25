'use client';

import { useEffect, useState } from 'react';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppSidebar />
      <div className="flex-1 flex flex-col ml-64">
        <AppHeader />
        <main className="flex-1 p-6 mt-16">
          {children}
        </main>
      </div>
    </div>
  );
}
