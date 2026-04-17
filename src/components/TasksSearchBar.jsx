import { useState } from "react";

export default function TasksSearchBar({onClickButton,onChangePriority,onClickDue,onChangeNumber,onChangeStatus,onChangeTitle,order,pageLimit,onClickSearch}) {

    return (
        <div className="w-full h-[70px] bg-blue-100 flex items-center px-6 gap-6 shadow-sm">

            {/* Status Dropdown */}
            <select
                onChange={onChangeStatus}
                className="bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-md focus:outline-none"
            >
                <option>Any</option>
                <option>New</option>
                <option>In Progress</option>
                <option>Done</option>
            </select>
            {/* Priority Dropdown */}
            <select
                onChange={onChangePriority}
                className="bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-md focus:outline-none"
            >
                <option>Any</option>
                <option>0 - Highest</option>
                <option>1 - High</option>
                <option>2 - Medium</option>
                <option>3 - Low</option>
                <option>4 - Lowest</option>
            </select>

            {/* Due Date Sort Button */}
            <button
                onClick={onClickDue}
                className="text-blue-100 hover:text-white hover:bg-blue-800 px-4 py-2 rounded-md transition duration-200 flex items-center gap-2 bg-blue-600"
            >
                Due Date
                <span>{order ?  "↓": "↑"}</span>
            </button>

            {/* New "+" Button */}
            <button
                className="text-blue-100 hover:text-white hover:bg-blue-800 px-4 py-2 rounded-md transition duration-200 bg-blue-600"
                onClick={onClickButton}
            >
                +
            </button>

            {/* Search Input */}

            <div className="flex items-center ml-auto">
                <input
                    type="number"
                    min={1}
                    max={12}
                    value={pageLimit}
                    onChange={onChangeNumber}
                    className="w-20 bg-white border border-gray-300 px-3 py-2 rounded-md focus:outline-none text-center mr-4"
                />
                <input
                    type="text"
                    placeholder="Search"
                    onChange={onChangeTitle}
                    className="bg-white border border-gray-300 px-3 py-2 rounded-l-md focus:outline-none"
                />
                <button onClick={onClickSearch}
                        className="text-blue-100 hover:text-white hover:bg-blue-800 px-4 py-2 rounded-r-md transition duration-200 bg-blue-600"
                >
                    Filter
                </button>
            </div>
        </div>
    );
}