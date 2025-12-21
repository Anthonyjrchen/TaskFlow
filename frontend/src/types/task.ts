export interface Task {
  id: number;
  user_id: string;
  title: string;
  isDone: boolean;
  dueDate: string;
}

export interface CreateTaskDto {
  title: string;
  dueDate: string;
}

export interface UpdateTaskDto {
  title?: string;
  isDone?: boolean;
  dueDate?: string;
}

export interface User {
  id: string;
  email: string;
}
