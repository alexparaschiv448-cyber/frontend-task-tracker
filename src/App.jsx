import './index.css'
import cImage from './assets/c.png'

function App() {
    return (
        <div className="min-h-screen flex justify-center items-center">

            <div className="w-[90%] h-screen bg-white p-6">
                <h1 className="text-xl font-bold text-center">
                    Centered Container
                </h1>
                <p className="mt-4 text-center">
                    This container takes 90% of the page width.
                </p>
                <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
                    <div className="flex-shrink-0">
                        <img className="h-12 w-12" src={cImage} alt="ChitChat Logo"/>
                    </div>
                    <div>
                        <div className="text-xl font-medium text-black">ChitChat</div>
                        <p className="text-gray-500">You have a new message!</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default App
