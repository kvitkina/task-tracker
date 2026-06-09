import { createRootRoute, Outlet, Link } from '@tanstack/react-router';
import { useTranslation, Langs, setLang, getCurrentLang } from '../i18n';
import { Globe, Moon, Sun, KanbanSquare } from 'lucide-react';
import { useState, useEffect } from 'react';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { t } = useTranslation();
  const currentLang = getCurrentLang();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme as 'dark' | 'light');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleThemeToggle = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLangToggle = () => {
    const nextLang = currentLang === Langs.ru ? Langs.en : Langs.ru;
    setLang(nextLang);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-text transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-border bg-background/80 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight hover:opacity-90">
          <KanbanSquare className="w-6 h-6 text-primary" />
          <span>{t('common.title')}</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <button
            onClick={handleLangToggle}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md border border-border hover:bg-surface/50 transition-colors"
            title={t('common.selectLanguage')}
            aria-label={t('common.selectLanguage')}
          >
            <Globe className="w-4 h-4 text-muted" />
            <span>{currentLang === Langs.ru ? 'EN' : 'RU'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-md border border-border hover:bg-surface/50 transition-colors"
            title={t('common.theme')}
            aria-label={t('common.theme')}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-yellow-500" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
