export interface Task {
  id: number;
  user_id: string;
  title: string;
  is_done: boolean;
}

export interface CreateTaskDto {
  title: string;
}

export interface UpdateTaskDto {
  title?: string;
  isDone?: boolean;
}

export interface User {
  id: string;
  email: string;
}
