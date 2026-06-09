import { Project, Task } from '../types';

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const PROJECTS_KEY = 'taskflow_projects';
const TASKS_KEY = 'taskflow_tasks';

const initialProjects: Project[] = [
  {
    id: 'proj-taskflow',
    title: 'TaskFlow MVP',
    description: 'Разработка MVP таск-трекера для портфолио с современным стеком',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'proj-web',
    title: 'Web Admin',
    description: 'Рабочий проект по рефакторингу админ-панели и внедрению новых фич',
    createdAt: new Date().toISOString(),
  },
];

const initialTasks: Task[] = [
  {
    id: 'task-1',
    projectId: 'proj-taskflow',
    title: 'Настроить i18n локализацию',
    description: 'Добавить поддержку русского и английского языков с автоматическим сохранением выбранного языка в localStorage.',
    status: 'done',
    priority: 'high',
    tags: ['i18n', 'setup'],
    deadline: '2026-06-15',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    projectId: 'proj-taskflow',
    title: 'Реализовать нативный Drag-and-Drop',
    description: 'Написать чистую реализацию перетаскивания карточек задач между колонками с использованием HTML5 Drag and Drop API.',
    status: 'inProgress',
    priority: 'high',
    tags: ['dnd', 'ui'],
    deadline: '2026-06-10',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    projectId: 'proj-taskflow',
    title: 'Интегрировать TanStack Router',
    description: 'Настроить файловый роутинг и синхронизацию фильтров/поиска с URL Search Params.',
    status: 'todo',
    priority: 'medium',
    tags: ['router', 'setup'],
    deadline: '2026-06-12',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    projectId: 'proj-taskflow',
    title: 'Написать README.md',
    description: 'Подготовить профессиональное описание проекта на английском языке с разбором архитектурных решений.',
    status: 'todo',
    priority: 'low',
    tags: ['docs'],
    deadline: '2026-06-20',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-5',
    projectId: 'proj-web',
    title: 'Рефакторинг таблицы пользователей',
    description: 'Перевести старую таблицу на MUI X DataGrid с серверной фильтрацией.',
    status: 'done',
    priority: 'high',
    tags: ['mui-x', 'refactor'],
    createdAt: new Date().toISOString(),
  },
];

function getProjects(): Project[] {
  const stored = localStorage.getItem(PROJECTS_KEY);
  if (!stored) {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(initialProjects));
    return initialProjects;
  }
  return JSON.parse(stored);
}

function saveProjects(projects: Project[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

function getTasks(): Task[] {
  const stored = localStorage.getItem(TASKS_KEY);
  if (!stored) {
    localStorage.setItem(TASKS_KEY, JSON.stringify(initialTasks));
    return initialTasks;
  }
  return JSON.parse(stored);
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export const mockApi = {
  // Projects
  getProjects: async (): Promise<Project[]> => {
    await delay();
    return getProjects();
  },

  getProject: async (id: string): Promise<Project | undefined> => {
    await delay();
    return getProjects().find((p) => p.id === id);
  },

  createProject: async (project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> => {
    await delay();
    const projects = getProjects();
    const newProject: Project = {
      ...project,
      id: `proj-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    projects.push(newProject);
    saveProjects(projects);
    return newProject;
  },

  updateProject: async (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<Project> => {
    await delay();
    const projects = getProjects();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Project not found');
    const updated = { ...projects[index], ...updates };
    projects[index] = updated;
    saveProjects(projects);
    return updated;
  },

  deleteProject: async (id: string): Promise<void> => {
    await delay();
    const projects = getProjects().filter((p) => p.id !== id);
    saveProjects(projects);
    // Also delete tasks of this project
    const tasks = getTasks().filter((t) => t.projectId !== id);
    saveTasks(tasks);
  },

  // Tasks
  getTasks: async (projectId: string): Promise<Task[]> => {
    await delay();
    return getTasks().filter((t) => t.projectId === projectId);
  },

  getTask: async (id: string): Promise<Task | undefined> => {
    await delay();
    return getTasks().find((t) => t.id === id);
  },

  createTask: async (task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
    await delay();
    const tasks = getTasks();
    const newTask: Task = {
      ...task,
      id: `task-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    saveTasks(tasks);
    return newTask;
  },

  updateTask: async (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task> => {
    await delay();
    const tasks = getTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Task not found');
    const updated = { ...tasks[index], ...updates };
    tasks[index] = updated;
    saveTasks(tasks);
    return updated;
  },

  deleteTask: async (id: string): Promise<void> => {
    await delay();
    const tasks = getTasks().filter((t) => t.id !== id);
    saveTasks(tasks);
  },
};
