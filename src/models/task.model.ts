export interface ResuestCreateTask {
  title: string;
  task: string;
  dueDate: Date;
  isCompleted: boolean;
  isImportant: boolean;
}

export interface RequestGetTasks {
  pages?: number;
  sizes?: number;
  title?: string;
  isCompleted?: boolean;
  isImportant?: boolean;
}

export interface RequestUpdateTask {
  title?: string;
  dueDate: Date;
  task?: string;
  isCompleted: boolean;
  isImportant: boolean;
}

export interface RequestCompletedTask {
  isCompleted: boolean;
}
