export interface Task {
  id: number;
  user_id: string;
  title: string;
  is_done: boolean;
  due_date: string;
}

export interface CreateTaskDto {
  title: string;
  due_date: string;
}

export interface UpdateTaskDto {
  title?: string;
  isDone?: boolean;
  due_date?: string;
}

export interface User {
  id: string;
  email: string;
}
