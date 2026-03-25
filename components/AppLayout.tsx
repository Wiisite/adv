'use client';

import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar />
      <AppHeader />
      <main className="ml-64 mt-16 p-6">
        {children}
      </main>
    </div>
  );
}
