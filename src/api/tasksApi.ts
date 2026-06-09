import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockApi } from './mockClient';
import { Project, Task } from '../types';

export const QUERY_KEYS = {
  PROJECTS: 'projects',
  PROJECT: 'project',
  TASKS: 'tasks',
  TASK: 'task',
} as const;

// --- Projects Queries & Mutations ---

export const projectsQueryOptions = queryOptions({
  queryKey: [QUERY_KEYS.PROJECTS],
  queryFn: () => mockApi.getProjects(),
});

export const projectQueryOptions = (id: string) =>
  queryOptions({
    queryKey: [QUERY_KEYS.PROJECT, id],
    queryFn: () => mockApi.getProject(id),
    enabled: !!id,
  });

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newProject: Omit<Project, 'id' | 'createdAt'>) => mockApi.createProject(newProject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS] });
    },
  });
}

export function useUpdateProjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Omit<Project, 'id' | 'createdAt'>> }) =>
      mockApi.updateProject(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECT, data.id] });
    },
  });
}

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mockApi.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS] });
    },
  });
}

// --- Tasks Queries & Mutations ---

export const tasksQueryOptions = (projectId: string) =>
  queryOptions({
    queryKey: [QUERY_KEYS.TASKS, projectId],
    queryFn: () => mockApi.getTasks(projectId),
    enabled: !!projectId,
  });

export function useCreateTaskMutation(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newTask: Omit<Task, 'id' | 'createdAt'>) => mockApi.createTask(newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS, projectId] });
    },
  });
}

export function useUpdateTaskMutation(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Omit<Task, 'id' | 'createdAt'>> }) =>
      mockApi.updateTask(id, updates),
    // Optimistic Update for smooth drag-and-drop or fast edits
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.TASKS, projectId] });

      const previousTasks = queryClient.getQueryData<Task[]>([QUERY_KEYS.TASKS, projectId]);

      if (previousTasks) {
        queryClient.setQueryData<Task[]>(
          [QUERY_KEYS.TASKS, projectId],
          previousTasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
        );
      }

      return { previousTasks };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData([QUERY_KEYS.TASKS, projectId], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS, projectId] });
    },
  });
}

export function useDeleteTaskMutation(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mockApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS, projectId] });
    },
  });
}
