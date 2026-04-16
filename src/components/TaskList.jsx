import React from "react";

const getStatusStyles = (status) => {
    switch (status) {
        case "New":
            return "bg-gray-200 text-gray-700";
        case "In Progress":
            return "bg-blue-200 text-blue-800";
        case "Done":
            return "bg-green-200 text-green-800";
        default:
            return "bg-gray-200 text-gray-700";
    }
};

const getPriorityStyles = (priority) => {
    switch (priority) {
        case "0 - Highest":
            return "bg-red-500 text-white";
        case "1 - High":
            return "bg-orange-400 text-white";
        case "2 - Medium":
            return "bg-yellow-300 text-black";
        case "3 - Low":
            return "bg-yellow-100 text-black";
        case "4 - Lowest":
            return "bg-white text-gray-700 border";
        default:
            return "bg-gray-200 text-gray-700";
    }
};

const TaskList = ({ tasks }) => {
    if (!tasks || tasks.length === 0) {
        return (
            <div className="text-gray-500 text-center py-4">
                No tasks available
            </div>
        );
    }

    return (
        <div className="flex flex-wrap w-full">
            {tasks.map((task, index) => (
                <div key={index} className="w-1/3 p-2 box-border">
                    <div
                        className="bg-white rounded-lg p-4 h-[180px] flex flex-col justify-between"
                        style={{
                            boxShadow:
                                "0 2px 6px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.06)",
                        }}
                    >
                        {/* TOP SECTION */}
                        <div className="relative h-1/3">
                            {/* Title */}
                            <div className="text-center font-semibold text-gray-900">
                                {task.title}
                            </div>

                            {/* Due date */}
                            <div className="absolute right-0 top-0 text-xs text-gray-500">
                                {new Date(task.duedate).toLocaleString()}
                            </div>

                            {/* Status + Priority */}
                            <div className="absolute right-0 top-6 flex flex-col gap-1 items-end">
                                <span
                                    className={`text-xs px-2 py-1 rounded-full ${getStatusStyles(
                                        task.status
                                    )}`}
                                >
                                    {task.status}
                                </span>

                                <span
                                    className={`text-xs px-2 py-1 rounded-full ${getPriorityStyles(
                                        task.priority
                                    )}`}
                                >
                                    {task.priority}
                                </span>
                            </div>
                        </div>

                        {/* DESCRIPTION */}
                        <div className="h-2/5 overflow-hidden text-sm text-gray-600 mt-4 whitespace-pre-wrap break-words line-clamp-3 text-left">
                            {task.description}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TaskList;