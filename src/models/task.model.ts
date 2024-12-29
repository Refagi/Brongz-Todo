export interface ResuestCreateTask {
  title: string;
  task: string;
}

export interface RequestGetTasks {
  pages: number;
  sizes: number;
  titles?: string;
  completes?: boolean;
  favorites?: boolean;
}

export interface RequestUpdateTask {
  title?: string;
  task?: string;
}

export interface RequestCompletedTask {
  isCompleted: boolean;
}
