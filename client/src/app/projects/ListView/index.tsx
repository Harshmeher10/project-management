import Header from "@/component/Header";
import TaskCard from "@/component/TaskCard";
import ModalEditTask from "@/component/ModalEditTask";
import { Task, useGetTasksQuery } from "@/state/api";
import React, { useState } from "react";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const ListView = ({ id, setIsModalNewTaskOpen }: Props) => {
  const [isModalEditTaskOpen, setIsModalEditTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalEditTaskOpen(true);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred while fetching tasks</div>;

  return (
    <div className="px-4 pb-8 xl:px-6">
      {editingTask && (
        <ModalEditTask
          isOpen={isModalEditTaskOpen}
          onClose={() => {
            setIsModalEditTaskOpen(false);
            setEditingTask(null);
          }}
          task={editingTask}
        />
      )}
      <div className="pt-5">
        <Header
          name="List"
          buttonComponent={
            <button
              className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              Add Task
            </button>
          }
          isSmallText
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {tasks?.map((task: Task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onEdit={handleEditTask}
          />
        ))}
      </div>
    </div>
  );
};

export default ListView;