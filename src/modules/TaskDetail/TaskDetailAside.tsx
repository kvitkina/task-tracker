import { memo, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '../../i18n';
import { useBoardUiStore } from '../store';
import { useUpdateTaskMutation, useDeleteTaskMutation, QUERY_KEYS } from '../../api/tasksApi';
import { Task, ColumnId, TaskPriority } from '../../types';
import { X, Calendar, Tag, AlertCircle, Trash2, CheckCircle2 } from 'lucide-react';

interface TaskDetailAsideProps {
  projectId: string;
}

export const TaskDetailAside = memo(function TaskDetailAside({ projectId }: TaskDetailAsideProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const selectedTaskId = useBoardUiStore((s) => s.selectedTaskId);
  const isAsideOpen = useBoardUiStore((s) => s.isAsideOpen);
  const setSelectedTaskId = useBoardUiStore((s) => s.setSelectedTaskId);
  const setIsAsideOpen = useBoardUiStore((s) => s.setIsAsideOpen);

  const updateTaskMutation = useUpdateTaskMutation(projectId);
  const deleteTaskMutation = useDeleteTaskMutation(projectId);

  // Form local state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ColumnId>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [tagsInput, setTagsInput] = useState('');
  const [deadline, setDeadline] = useState('');

  // Find the selected task from the cached tasks list
  const tasks = queryClient.getQueryData<Task[]>([QUERY_KEYS.TASKS, projectId]) || [];
  const task = tasks.find((t) => t.id === selectedTaskId);

  // Sync form state when selected task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setPriority(task.priority);
      setTagsInput(task.tags.join(', '));
      setDeadline(task.deadline || '');
    }
  }, [task]);

  // Handle Escape key to close panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAsideOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAsideOpen]);

  const handleClose = () => {
    setIsAsideOpen(false);
    setSelectedTaskId(null);
  };

  const handleSave = () => {
    if (!selectedTaskId || !title.trim()) return;

    const parsedTags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    updateTaskMutation.mutate({
      id: selectedTaskId,
      updates: {
        title,
        description,
        status,
        priority,
        tags: parsedTags,
        deadline: deadline || undefined,
      },
    });
  };

  const handleDelete = () => {
    if (!selectedTaskId) return;
    if (confirm(t('board.deleteConfirmDesc'))) {
      deleteTaskMutation.mutate(selectedTaskId, {
        onSuccess: () => {
          handleClose();
        },
      });
    }
  };

  if (!isAsideOpen || !task) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Aside Panel */}
      <aside className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-surface border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm text-text">{t('board.taskDetails')}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="p-2 text-muted hover:text-red-500 rounded-md hover:bg-red-500/10 transition-colors"
              title={t('common.delete')}
              aria-label={t('common.delete')}
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleClose}
              className="p-2 text-muted hover:text-text rounded-md hover:bg-background/50 transition-colors"
              title={t('common.cancel')}
              aria-label={t('common.cancel')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content / Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSave}
              placeholder={t('board.placeholderTitle')}
              className="w-full text-xl font-bold bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none pb-1 transition-colors"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted tracking-wider uppercase">
              {t('common.projectDesc')}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleSave}
              placeholder={t('board.placeholderDesc')}
              rows={4}
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-text placeholder-muted/50 focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted tracking-wider uppercase flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{t('board.selectColumn')}</span>
              </label>
              <select
                value={status}
                onChange={(e) => {
                  const val = e.target.value as ColumnId;
                  setStatus(val);
                  updateTaskMutation.mutate({ id: task.id, updates: { status: val } });
                }}
                className="w-full px-3 py-1.5 bg-background border border-border rounded-md text-sm text-text focus:outline-none focus:border-primary cursor-pointer transition-colors"
              >
                <option value="todo">{t('board.todo')}</option>
                <option value="inProgress">{t('board.inProgress')}</option>
                <option value="done">{t('board.done')}</option>
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted tracking-wider uppercase flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{t('board.priority')}</span>
              </label>
              <select
                value={priority}
                onChange={(e) => {
                  const val = e.target.value as TaskPriority;
                  setPriority(val);
                  updateTaskMutation.mutate({ id: task.id, updates: { priority: val } });
                }}
                className="w-full px-3 py-1.5 bg-background border border-border rounded-md text-sm text-text focus:outline-none focus:border-primary cursor-pointer transition-colors"
              >
                <option value="low">{t('board.priorityLow')}</option>
                <option value="medium">{t('board.priorityMedium')}</option>
                <option value="high">{t('board.priorityHigh')}</option>
              </select>
            </div>

            {/* Deadline */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted tracking-wider uppercase flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{t('board.deadline')}</span>
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => {
                  const val = e.target.value;
                  setDeadline(val);
                  updateTaskMutation.mutate({ id: task.id, updates: { deadline: val || undefined } });
                }}
                className="w-full px-3 py-1.5 bg-background border border-border rounded-md text-sm text-text focus:outline-none focus:border-primary cursor-pointer transition-colors"
              />
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted tracking-wider uppercase flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                <span>{t('board.tags')}</span>
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                onBlur={handleSave}
                placeholder="e.g. bug, ui, core"
                className="w-full px-3 py-1.5 bg-background border border-border rounded-md text-sm text-text placeholder-muted/50 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-background/50 flex items-center justify-between text-xs text-muted">
          <span>
            Created: {new Date(task.createdAt).toLocaleDateString()}
          </span>
          {updateTaskMutation.isPending && (
            <span className="text-primary animate-pulse font-medium">Saving...</span>
          )}
        </div>
      </aside>
    </>
  );
});
