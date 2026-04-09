import React from "react";
import {Link} from "react-router-dom";


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

const ProjectList = ({ projects }) => {
    if (!projects || projects.length === 0) {
        return (
            <div className="text-gray-500 text-center py-4">
                No projects available
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 w-full ">
            {projects.map((project, index) => (
                <div
                    key={index}
                    className="w-full bg-white rounded-lg px-4 flex h-[60px] items-center
                     border border-gray-100 transition-shadow hover:shadow-lg relative"
                    style={{
                        boxShadow:
                            "0 -2px 6px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.06)",
                    }}
                >
                    {/* LEFT: Status */}
                    <div className="flex-1 flex justify-start">
            <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusStyles(
                    project.status
                )}`}
            >
              {project.status}
            </span>
                    </div>

                    {/* CENTER: Name */}
                    <div className="flex-1 flex justify-center">
                        <div className="text-base font-semibold text-gray-900 tracking-wide">
                            <Link to={`/project/${project.id}`}>{project.name}</Link>
                        </div>
                    </div>

                    {/* RIGHT: Date */}
                    <div className="flex-1 flex justify-end">
                        <div className="text-sm text-gray-500">
                            {new Date(project.creation_date).toLocaleString()}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProjectList;