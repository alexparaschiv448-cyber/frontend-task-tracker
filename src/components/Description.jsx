import '../index.css'

export default function Description({handleChange}) {
    return (
        <>
            <textarea
                placeholder="Description"
                onChange={handleChange}
                className="
                ml-4
                w-[40%]
                min-h-[200px]
                p-4
                rounded-lg
                border
                border-gray-300
                bg-white
                text-gray-800
                placeholder-gray-400
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:border-blue-500
                resize-none
                shadow-sm
                transition
                duration-200
              "
            />
        </>
    )
}