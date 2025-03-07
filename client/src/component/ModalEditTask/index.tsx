import Modal from "@/component/Modal";
import { Priority, Status, Task, useUpdateTaskMutation } from "@/state/api";
import React, { useEffect, useState } from "react";
import { formatISO } from "date-fns";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
};

const ModalEditTask = ({ isOpen, onClose, task }: Props) => {
  const [updateTask, { isLoading }] = useUpdateTaskMutation();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState<Status>(task.status || Status.ToDo);
  const [priority, setPriority] = useState<Priority>(task.priority || Priority.Backlog);
  const [tags, setTags] = useState(task.tags || "");
  const [startDate, setStartDate] = useState(task.startDate?.split('T')[0] || "");
  const [dueDate, setDueDate] = useState(task.dueDate?.split('T')[0] || "");
  const [assignedUserId, setAssignedUserId] = useState(task.assignedUserId?.toString() || "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Update form when task prop changes
    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status || Status.ToDo);
    setPriority(task.priority || Priority.Backlog);
    setTags(task.tags || "");
    setStartDate(task.startDate?.split('T')[0] || "");
    setDueDate(task.dueDate?.split('T')[0] || "");
    setAssignedUserId(task.assignedUserId?.toString() || "");
    setError(null);
  }, [task]);

  const handleSubmit = async () => {
    try {
      setError(null);
      if (!title) {
        setError("Title is required");
        return;
      }

      const taskData = {
        title,
        description,
        status,
        priority,
        tags,
        startDate: startDate ? formatISO(new Date(startDate)) : undefined,
        dueDate: dueDate ? formatISO(new Date(dueDate)) : undefined,
        assignedUserId: assignedUserId ? parseInt(assignedUserId) : undefined,
      };

      await updateTask({
        taskId: task.id,
        task: taskData
      }).unwrap();
      onClose();
    } catch (err: any) {
      setError(err.data?.message || err.message || "Failed to update task");
    }
  };

  const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Edit Task">
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <div className="flex">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          </div>
        )}
        <input
          type="text"
          className={inputStyles}
          placeholder="Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className={inputStyles}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <select
            className={selectStyles}
            value={status}
            onChange={(e) =>
              setStatus(Status[e.target.value as keyof typeof Status])
            }
          >
            <option value={Status.ToDo}>To Do</option>
            <option value={Status.WorkInProgress}>Work In Progress</option>
            <option value={Status.UnderReview}>Under Review</option>
            <option value={Status.Completed}>Completed</option>
          </select>
          <select
            className={selectStyles}
            value={priority}
            onChange={(e) =>
              setPriority(Priority[e.target.value as keyof typeof Priority])
            }
          >
            <option value={Priority.Urgent}>Urgent</option>
            <option value={Priority.High}>High</option>
            <option value={Priority.Medium}>Medium</option>
            <option value={Priority.Low}>Low</option>
            <option value={Priority.Backlog}>Backlog</option>
          </select>
        </div>
        <input
          type="text"
          className={inputStyles}
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            className={inputStyles}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className={inputStyles}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <input
          type="text"
          className={inputStyles}
          placeholder="Assigned User ID"
          value={assignedUserId}
          onChange={(e) => setAssignedUserId(e.target.value)}
        />
        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors duration-200 ${
            isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Task"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalEditTask; 