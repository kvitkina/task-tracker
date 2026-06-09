export type TaskPriority = 'low' | 'medium' | 'high';
export type ColumnId = 'todo' | 'inProgress' | 'done';

export interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: ColumnId;
  priority: TaskPriority;
  tags: string[];
  deadline?: string;
  createdAt: string;
}
