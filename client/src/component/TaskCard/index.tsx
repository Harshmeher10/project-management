import { Task, Status as TaskStatus } from "@/state/api";
import { format } from "date-fns";
import { MoreVertical, Edit, Trash2, CheckSquare } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useUpdateTaskMutation, useDeleteTaskMutation } from '@/state/api';

type Props = {
  task: Task;
  onEdit?: (task: Task) => void;
};

const TaskCard = ({ task, onEdit }: Props) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const handleEdit = () => {
    if (onEdit) {
      onEdit(task);
    }
    setShowOptions(false);
  };

  const handleDelete = async () => {
    try {
      if (!task.id) {
        throw new Error('Task ID is required for deletion');
      }
      
      setIsDeleting(true);
      await deleteTask(task.id).unwrap();
      setShowDeleteConfirm(false);
      setShowOptions(false);
    } catch (error: any) {
      console.error('Failed to delete task:', error);
      alert(error.data?.message || error.message || 'Failed to delete task. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async () => {
    const newStatus = task.status === TaskStatus.Completed ? TaskStatus.WorkInProgress : TaskStatus.Completed;
    try {
      await updateTask({
        taskId: task.id,
        task: { status: newStatus }
      }).unwrap();
      setShowOptions(false);
    } catch (error) {
      console.error('Failed to update task status:', error);
      // TODO: Show error toast
    }
  };

  return (
    <div className="relative mb-3 rounded bg-white p-4 shadow dark:bg-gray-800 dark:text-white">
      <div className="absolute right-2 top-2">
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <MoreVertical className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
        {showOptions && (
          <div className="absolute right-0 mt-1 w-48 rounded-md bg-white py-1 shadow-lg dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
            <button
              onClick={handleEdit}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <Edit className="mr-3 h-4 w-4" />
              Edit Task
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <Trash2 className="mr-3 h-4 w-4" />
              Delete Task
            </button>
            <button
              onClick={handleStatusChange}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <CheckSquare className="mr-3 h-4 w-4" />
              {task.status === TaskStatus.Completed ? 'Mark as In Progress' : 'Mark as Completed'}
            </button>
          </div>
        )}
      </div>

      <div className="mt-2">
        {task.attachments && task.attachments.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap">
              <Image
                src={`https://pm-s2-images.s3.ap-south-1.amazonaws.com/${task.attachments[0].fileURL}`}
                alt={task.attachments[0].fileName}
                width={400}
                height={200}
                className="w-full rounded-lg object-cover"
              />
            </div>
          </div>
        )}

        <div className="mb-4">
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            {task.description || "No description provided"}
          </p>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <span className={`px-2 py-1 text-sm rounded ${
            task.status === TaskStatus.Completed
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
          }`}>
            {task.status}
          </span>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
            ${task.priority === 'Urgent' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
              task.priority === 'High' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' :
              task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
              task.priority === 'Low' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
            {task.priority}
          </span>
        </div>

        {task.tags && (
          <div className="mb-4 flex flex-wrap gap-2">
            {task.tags.split(',').map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        )}

        <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Start Date</p>
            <p>{task.startDate ? format(new Date(task.startDate), "PP") : "Not set"}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Due Date</p>
            <p>{task.dueDate ? format(new Date(task.dueDate), "PP") : "Not set"}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <span className="text-gray-500 dark:text-gray-400">Author:</span>
            <span className="ml-1 font-medium text-gray-900 dark:text-white">{task.author ? task.author.username : "Unknown"}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-500 dark:text-gray-400">Assignee:</span>
            <span className="ml-1 font-medium text-gray-900 dark:text-white">{task.assignee ? task.assignee.username : "Unassigned"}</span>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Task</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
