import React, {useState, useEffect} from "react";

const Toast = ({ message, type , duration = 3000 ,show=false}) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        if (!show) return;

        setVisible(true);

        const timer = setTimeout(() => {
            setVisible(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [show, message, duration]);
    if (!visible) {return null;}
    const baseClasses =
        "fixed bottom-5 right-5 max-w-xs w-full p-4 rounded shadow-lg flex items-start space-x-3 text-white animate-slideIn";

    const typeClasses = {
        success: "bg-green-500",
        error: "bg-red-500",
    };

    return (
        <div className={`${baseClasses} ${typeClasses[type]}`}>
            {/* Icon */}
            <div className="flex-shrink-0">
                {type === "success" ? (
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                ) : (
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                )}
            </div>

            {/* Message */}
            <div className="flex-1 text-sm">{message}</div>

            {/* Close Button */}
            <button
                onClick={() => setVisible(false)}
                className="flex-shrink-0 text-white hover:text-gray-200"
            >
                ×
            </button>
        </div>
    );
};

export default Toast;