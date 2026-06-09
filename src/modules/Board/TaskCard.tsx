import { memo, useCallback } from 'react';
import { useTranslation } from '../../i18n';
import { Task } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { useBoardUiStore } from '../store';
import { useDeleteTaskMutation } from '../../api/tasksApi';
import { Trash2, Calendar, Tag } from 'lucide-react';

interface TaskCardProps {
  task: Task;
}

export const TaskCard = memo(function TaskCard({ task }: TaskCardProps) {
  const { t } = useTranslation();
  const setSelectedTaskId = useBoardUiStore((s) => s.setSelectedTaskId);
  const setIsAsideOpen = useBoardUiStore((s) => s.setIsAsideOpen);
  const deleteTaskMutation = useDeleteTaskMutation(task.projectId);

  const handleCardClick = useCallback(() => {
    setSelectedTaskId(task.id);
    setIsAsideOpen(true);
  }, [task.id, setSelectedTaskId, setIsAsideOpen]);

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent opening sidebar
      if (confirm(t('board.deleteConfirmDesc'))) {
        deleteTaskMutation.mutate(task.id);
      }
    },
    [task.id, deleteTaskMutation, t]
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      e.dataTransfer.setData('text/plain', task.id);
      e.dataTransfer.effectAllowed = 'move';
      // Add a visual effect while dragging
      const target = e.currentTarget as HTMLElement;
      target.style.opacity = '0.4';
    },
    [task.id]
  );

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '1';
  }, []);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleCardClick}
      className="group p-4 bg-background border border-border rounded-lg hover:border-primary/50 transition-all shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-semibold text-sm text-text group-hover:text-primary transition-colors line-clamp-2">
          {task.title}
        </h4>
        <button
          onClick={handleDeleteClick}
          className="p-1 text-muted hover:text-red-500 rounded hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          title={t('common.delete')}
          aria-label={t('common.delete')}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-muted text-xs line-clamp-2 mb-4">
        {task.description || t('board.noDescription')}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        <Badge variant={task.priority}>
          {t(`board.priority${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`)}
        </Badge>

        {task.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="default" className="flex items-center gap-0.5">
            <Tag className="w-2.5 h-2.5 text-muted" />
            <span>{tag}</span>
          </Badge>
        ))}
      </div>

      {task.deadline && (
        <div className="flex items-center gap-1 text-[10px] text-muted">
          <Calendar className="w-3 h-3" />
          <span>{new Date(task.deadline).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
});
