import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '../i18n';
import { projectsQueryOptions, useCreateProjectMutation, useDeleteProjectMutation } from '../api/tasksApi';
import { Plus, Folder, Trash2, Calendar, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/')({
  component: ProjectsPage,
});

function ProjectsComponent() {
  const { t } = useTranslation();
  const { data: projects = [], isLoading, error } = useQuery(projectsQueryOptions);
  const createProjectMutation = useCreateProjectMutation();
  const deleteProjectMutation = useDeleteProjectMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createProjectMutation.mutate(
      { title, description },
      {
        onSuccess: () => {
          setTitle('');
          setDescription('');
          setIsModalOpen(false);
        },
      }
    );
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to project board
    if (confirm(t('board.deleteConfirmDesc'))) {
      deleteProjectMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <p className="text-red-500 font-medium">{t('common.error')}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-md text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl w-full mx-auto px-6 py-8 flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('common.projects')}</h1>
          <p className="text-muted text-sm mt-1">Управляйте своими рабочими пространствами и досками задач</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/95 text-white font-medium rounded-md text-sm transition-colors shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          <span>{t('common.createProject')}</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="flex-1 border border-dashed border-border rounded-lg flex flex-col items-center justify-center p-12 text-center">
          <Folder className="w-12 h-12 text-muted mb-4 stroke-[1.5]" />
          <h3 className="text-lg font-semibold">{t('common.noTasks')}</h3>
          <p className="text-muted text-sm mt-1 max-w-sm">Создайте свой первый проект, чтобы начать планирование и управление задачами.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 px-4 py-2 bg-surface hover:bg-surface/80 border border-border text-sm font-medium rounded-md transition-colors"
          >
            {t('common.createProject')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              to="/board/$projectId"
              params={{ projectId: project.id }}
              className="group block p-6 bg-surface border border-border rounded-xl hover:border-primary/50 transition-all hover:shadow-md hover:shadow-primary/5 cursor-pointer relative"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                  <Folder className="w-5 h-5" />
                </div>
                <button
                  onClick={(e) => handleDeleteProject(project.id, e)}
                  className="p-1.5 text-muted hover:text-red-500 rounded-md hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title={t('common.delete')}
                  aria-label={t('common.delete')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-1">
                {project.title}
              </h3>
              <p className="text-muted text-sm mt-2 line-clamp-2 min-h-[40px]">
                {project.description || t('board.noDescription')}
              </p>

              <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1 font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Open board
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-xl font-bold mb-4">{t('common.createProject')}</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label htmlFor="project-title" className="block text-sm font-medium mb-1.5">
                  {t('common.projectTitle')} <span className="text-red-500">*</span>
                </label>
                <input
                  id="project-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('common.placeholderProjectTitle')}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label htmlFor="project-desc" className="block text-sm font-medium mb-1.5">
                  {t('common.projectDesc')}
                </label>
                <textarea
                  id="project-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('common.placeholderProjectDesc')}
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium border border-border hover:bg-surface/50 rounded-md transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={createProjectMutation.isPending}
                  className="px-4 py-2 text-sm font-medium bg-primary hover:bg-primary/95 text-white rounded-md transition-colors disabled:opacity-50"
                >
                  {createProjectMutation.isPending ? t('common.loading') : t('common.create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectsPage() {
  return <ProjectsComponent />;
}
