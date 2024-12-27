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
