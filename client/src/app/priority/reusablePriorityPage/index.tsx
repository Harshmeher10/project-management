"use client";

import { useAppSelector } from "@/app/redux";
import Header from "@/component/Header";
import ModalNewTask from "@/component/ModalNewTask";
import { RootState } from "@/app/redux"; 
import TaskCard from "@/component/TaskCard";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import {
  Priority,
  Task,
  useGetAuthUserQuery,
  useGetTasksByUserQuery,
} from "@/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useState } from "react";

type Props = {
  priority: Priority;
};

const columns: GridColDef[] = [
  {
    field: "title",
    headerName: "Title",
    width: 100,
  },
  {
    field: "description",
    headerName: "Description",
    width: 200,
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    renderCell: (params) => (
      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
        {params.value}
      </span>
    ),
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 75,
  },
  {
    field: "tags",
    headerName: "Tags",
    width: 130,
  },
  {
    field: "startDate",
    headerName: "Start Date",
    width: 130,
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    width: 130,
  },
  {
    field: "author",
    headerName: "Author",
    width: 150,
    renderCell: (params) => params.value.username || "Unknown",
  },
  {
    field: "assignee",
    headerName: "Assignee",
    width: 150,
    renderCell: (params) => params.value.username || "Unassigned",
  },
];

const ReusablePriorityPage = ({ priority }: Props) => {
  const [view, setView] = useState("list");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  const { data: currentUser } = useGetAuthUserQuery({});
  const userId = currentUser?.userDetails?.userId ?? null;
  const {
    data: tasks,
    isLoading,
    isError: isTasksError,
  } = useGetTasksByUserQuery(userId || 0, {
    skip: userId === null,
  });

  const isDarkMode = useAppSelector((state: RootState) => state.global.isDarkMode);

  const filteredTasks = tasks?.filter(
    (task: Task) => task.priority?.toString() === priority?.toString()
  ) || [];

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-lg text-gray-600 dark:text-gray-300">Loading tasks...</div>
    </div>
  );

  if (isTasksError) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-lg text-red-600 dark:text-red-400">Error fetching tasks</div>
    </div>
  );

  return (
    <div className="m-5 p-4">
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
      />
      <Header
        name={`${priority} Priority Tasks`}
        buttonComponent={
          <button
            className="mr-3 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 transition-colors duration-200"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            Add Task
          </button>
        }
      />
      <div className="mb-4 flex justify-start">
        <button
          className={`px-4 py-2 transition-colors duration-200 ${
            view === "list" 
              ? "bg-blue-500 text-white" 
              : "bg-white dark:bg-gray-800 dark:text-gray-200"
          } rounded-l border border-gray-200 dark:border-gray-700`}
          onClick={() => setView("list")}
        >
          List
        </button>
        <button
          className={`px-4 py-2 transition-colors duration-200 ${
            view === "table" 
              ? "bg-blue-500 text-white" 
              : "bg-white dark:bg-gray-800 dark:text-gray-200"
          } rounded-r border border-l-0 border-gray-200 dark:border-gray-700`}
          onClick={() => setView("table")}
        >
          Table
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            No {priority.toLowerCase()} priority tasks found
          </div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            Create a new task
          </button>
        </div>
      ) : view === "list" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task: Task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="h-[600px] w-full">
          <DataGrid
            rows={filteredTasks}
            columns={columns}
            checkboxSelection
            getRowId={(row) => row.id}
            className={dataGridClassNames}
            sx={dataGridSxStyles(isDarkMode)}
          />
        </div>
      )}
    </div>
  );
};

export default ReusablePriorityPage;