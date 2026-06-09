import { memo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from '@tanstack/react-router';
import { useTranslation } from '../../i18n';
import { projectQueryOptions, tasksQueryOptions } from '../../api/tasksApi';
import { Column } from './Column';
import { TaskDetailAside } from '../TaskDetail/TaskDetailAside';
import { ArrowLeft, Search, SlidersHorizontal, Folder } from 'lucide-react';
import { BoardSearch } from '../../routes/board.$projectId';
import { ColumnId, Task } from '../../types';

interface BoardProps {
  projectId: string;
  search: BoardSearch;
}

export const Board = memo(function Board({ projectId, search }: BoardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: '/board/$projectId' });

  // Queries
  const { data: project, isLoading: isProjectLoading } = useQuery(projectQueryOptions(projectId));
  const { data: tasks = [], isLoading: isTasksLoading } = useQuery(tasksQueryOptions(projectId));

  // Local state for search input (to allow smooth typing before navigation/debounce)
  const [searchQuery, setSearchQuery] = useState(search.q || '');

  // Debounce search query sync with URL
  useEffect(() => {
    const handler = setTimeout(() => {
      navigate({
        search: (prev: BoardSearch) => ({ ...prev, q: searchQuery || undefined }),
      });
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, navigate]);

  // Sync search input with URL search param when URL changes externally
  useEffect(() => {
    setSearchQuery(search.q || '');
  }, [search.q]);

  const handlePriorityFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const priority = e.target.value as 'low' | 'medium' | 'high' | 'all';
    navigate({
      search: (prev: BoardSearch) => ({
        ...prev,
        priority: priority === 'all' ? undefined : priority,
      }),
    });
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes((search.q || '').toLowerCase()) ||
      task.description.toLowerCase().includes((search.q || '').toLowerCase()) ||
      task.tags.some((tag) => tag.toLowerCase().includes((search.q || '').toLowerCase()));

    const matchesPriority = !search.priority || task.priority === search.priority;

    return matchesSearch && matchesPriority;
  });

  // Group tasks by column status
  const groupedTasks: Record<ColumnId, Task[]> = {
    todo: filteredTasks.filter((t) => t.status === 'todo'),
    inProgress: filteredTasks.filter((t) => t.status === 'inProgress'),
    done: filteredTasks.filter((t) => t.status === 'done'),
  };

  const isLoading = isProjectLoading || isTasksLoading;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <p className="text-muted font-medium">Project not found</p>
        <Link to="/" className="flex items-center gap-2 text-primary hover:underline text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span>{t('common.backToProjects')}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      {/* Board Sub-header */}
      <div className="px-6 py-4 border-b border-border bg-surface/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-1.5 text-muted hover:text-text hover:bg-surface border border-border/50 rounded-md transition-colors"
            title={t('common.backToProjects')}
            aria-label={t('common.backToProjects')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold tracking-tight">{project.title}</h2>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search Input */}
          <div className="relative min-w-[200px] max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('common.search')}
              className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-md text-sm text-text placeholder-muted/50 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Priority Filter */}
          <div className="relative flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-muted/60" />
            <select
              value={search.priority || 'all'}
              onChange={handlePriorityFilterChange}
              className="px-3 py-1.5 bg-background border border-border rounded-md text-sm text-text focus:outline-none focus:border-primary transition-colors cursor-pointer appearance-none pr-8"
            >
              <option value="all">{t('board.priority')}: All</option>
              <option value="low">{t('board.priorityLow')}</option>
              <option value="medium">{t('board.priorityMedium')}</option>
              <option value="high">{t('board.priorityHigh')}</option>
            </select>
            {/* Custom select arrow */}
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 border-l border-t border-muted/60 w-1.5 h-1.5 rotate-135"></div>
          </div>
        </div>
      </div>

      {/* Kanban Board Columns Container */}
      <div className="flex-1 overflow-x-auto p-6 flex gap-6 items-start">
        <Column
          id="todo"
          title={t('board.todo')}
          tasks={groupedTasks.todo}
          projectId={projectId}
        />
        <Column
          id="inProgress"
          title={t('board.inProgress')}
          tasks={groupedTasks.inProgress}
          projectId={projectId}
        />
        <Column
          id="done"
          title={t('board.done')}
          tasks={groupedTasks.done}
          projectId={projectId}
        />
      </div>

      {/* Task Details Side Panel */}
      <TaskDetailAside projectId={projectId} />
    </div>
  );
});
