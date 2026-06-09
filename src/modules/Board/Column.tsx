import { memo, useCallback, useState } from 'react';
import { useTranslation } from '../../i18n';
import { ColumnId, Task } from '../../types';
import { TaskCard } from './TaskCard';
import { useUpdateTaskMutation, useCreateTaskMutation } from '../../api/tasksApi';
import { Plus, X } from 'lucide-react';

interface ColumnProps {
  id: ColumnId;
  title: string;
  tasks: Task[];
  projectId: string;
}

export const Column = memo(function Column({ id, title, tasks, projectId }: ColumnProps) {
  const { t } = useTranslation();
  const updateTaskMutation = useUpdateTaskMutation(projectId);
  const createTaskMutation = useCreateTaskMutation(projectId);

  const [isAdding, setIsAdding] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const taskId = e.dataTransfer.getData('text/plain');
      if (!taskId) return;

      // If task is not in this column's current list, it means it's coming from another column
      updateTaskMutation.mutate({
        id: taskId,
        updates: { status: id },
      });
    },
    [id, tasks, updateTaskMutation]
  );

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    createTaskMutation.mutate(
      {
        projectId,
        title: taskTitle,
        description: '',
        status: id,
        priority: 'medium',
        tags: [],
      },
      {
        onSuccess: () => {
          setTaskTitle('');
          setIsAdding(false);
        },
      }
    );
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col h-full min-w-[280px] max-w-[350px] flex-1 bg-surface border rounded-xl p-4 transition-colors ${
        isDragOver ? 'border-primary/50 bg-primary/5' : 'border-border'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-text">{title}</h3>
          <span className="flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-background border border-border text-muted rounded-full">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="p-1 text-muted hover:text-text rounded hover:bg-background/50 transition-colors"
          title={t('board.addTask')}
          aria-label={t('board.addTask')}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Tasks List */}
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto min-h-[150px] max-h-[calc(100vh-280px)] pr-1">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}

        {tasks.length === 0 && !isAdding && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center border border-dashed border-border/50 rounded-lg text-muted text-xs">
            {t('common.noTasks')}
          </div>
        )}

        {/* Add Task Inline Form */}
        {isAdding && (
          <form onSubmit={handleAddTaskSubmit} className="p-3 bg-background border border-primary/30 rounded-lg space-y-3 shadow-inner">
            <input
              type="text"
              required
              autoFocus
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder={t('board.placeholderTitle')}
              className="w-full px-2.5 py-1.5 bg-surface border border-border rounded text-xs focus:outline-none focus:border-primary text-text placeholder-muted/50"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="p-1 text-muted hover:text-red-500 rounded hover:bg-red-500/10 transition-colors"
                title={t('common.cancel')}
                aria-label={t('common.cancel')}
              >
                <X className="w-4 h-4" />
              </button>
              <button
                type="submit"
                disabled={createTaskMutation.isPending}
                className="px-2.5 py-1 bg-primary hover:bg-primary/90 text-white font-medium rounded text-xs transition-colors disabled:opacity-50"
              >
                {t('common.create')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
});
