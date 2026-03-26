'use client';

import { Settings, User, LogOut } from 'lucide-react';
import GlobalSearch from './GlobalSearch';
import ThemeToggle from './ThemeToggle';
import NotificationPanel from './NotificationPanel';

export default function AppHeader() {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex-1 max-w-xl">
          <GlobalSearch />
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <NotificationPanel />

          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          <div className="flex items-center gap-2 pl-4 border-l border-gray-200 dark:border-gray-700">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </div>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
