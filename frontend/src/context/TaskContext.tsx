import React, { createContext, useState, useEffect, ReactNode } from "react";

interface Task {
  id: number;
  title: string;
  date: string;
}

interface TaskContextProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export const TaskContext = createContext<TaskContextProps>({
  tasks: [],
  setTasks: () => {},
});

export const TaskProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const tasksData = [];

  useEffect(() => {
    setTasks(tasksData);
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TaskContext.Provider>
  );
};
