import { createContext, useState, useEffect, type ReactNode } from 'react';
import api from '@/services/api';

interface Task {
  id: string;
  title: string;
  task: string;
  dueDate: string;
  isCompleted: boolean;
  isImportant: boolean;
}

interface TaskContextType {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  activeFilter: 'all' | 'important' | 'completed' | 'uncompleted';
  setActiveFilter: (filter: 'all' | 'important' | 'completed' | 'uncompleted') => void;
  getAllTasks: (type?: 'all' | 'important' | 'completed' | 'uncompleted') => Promise<void>;
  loading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider ({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'important' | 'completed' | 'uncompleted'>('all');
  const [loading, setLoading] = useState(false);

  const getAllTasks = async (type: 'all' | 'important' | 'completed' | 'uncompleted' = activeFilter) => {
    setLoading(true);
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found');
      setLoading(false);
      return;
    }

    let url = `/tasks/${userId}`;
    if (type === 'important') url = `/tasks/important-task/${userId}`;
    if (type === 'completed') url = `/tasks/completed-task/${userId}`;
    if (type === 'uncompleted') url = `/tasks/uncompleted-task/${userId}`;

    try {
      const response = await api.get(url);
      const result = response.data;
      setTasks(result.data || []);
    } catch (error: unknown) {
      console.error('Fetch Tasks Error:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTasks();
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, setTasks, activeFilter, setActiveFilter, getAllTasks, loading }}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;