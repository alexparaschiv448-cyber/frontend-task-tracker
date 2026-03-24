import './index.css'
import cImage from './assets/c.png'
import { useState } from 'react';

function App() {
    function Square({value,onSquareClick}) {
        //const [value, setValue] = useState(null);

        return <button className="square" onClick={onSquareClick}>{value}</button>;
    }
    const [squares, setSquares] = useState(Array(9).fill(null));
    function handleClick(i) {
        const nextSquares = squares.slice();
        nextSquares[i] = "X";
        setSquares(nextSquares);
    }
    return (
        <>
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

                <br/>
                <br/>
                <br/>
                <br/>
                <div className="board-row">
                    <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
                    <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
                    <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
                </div>
                <div className="board-row">
                    <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
                    <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
                    <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
                </div>
                <div className="board-row">
                    <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
                    <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
                    <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
                </div>


            </div>

        </div>
        </>
    )
}

export default App
