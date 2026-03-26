import './index.css'
import cImage from './assets/c.png'
import { useState } from 'react';
import Ceva,{Test2,Test3} from './components/test_comp.jsx'

function App() {
    function Square({value,onSquareClick}) {
        //const [value, setValue] = useState(null);

        return <button className="square" onClick={onSquareClick}>{value}</button>;
    }
    //const [squares, setSquares] = useState(Array(9).fill(null));
    //const [turnValue,setTurnValue] = useState(true);
    function Board({ turnValue, squares, onPlay }){
        function handleClick(i) {
            const nextSquares = squares.slice();
            if(!nextSquares[i] && !calculateWinner(nextSquares)) {
                if(turnValue){nextSquares[i]="X"}
                else{nextSquares[i]="O"}
                //setTurnValue(!turnValue);
                onPlay(nextSquares);
            }

            //setSquares(nextSquares);
        }
        const winner = calculateWinner(squares);
        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else {
            status = "Next player: " + (turnValue ? "X" : "O");
        }
        return(
            <>
                <div className="status">{status}</div>
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
            </>
        )
    }
    function Game() {
        //const [turnValue, setTurnValue] = useState([true]);
        const [history, setHistory] = useState([Array(9).fill(null)]);
        const [currentMove, setCurrentMove] = useState(0);
        //const [currentSquares,setCurrentSquares] = useState(history[history.length - 1]);
        //const [currentTurn,setCurrentTurn] = useState(turnValue[turnValue.length - 1]);
        //const [count, setCount] = useState(null);
        const currentSquares = history[currentMove];
        const turnValue = currentMove % 2 === 0;
        function handlePlay(nextSquares,nextValue) {
            const nextHistory = [
                ...history.slice(0, currentMove + 1),
                nextSquares
            ];
            setHistory(nextHistory);
            setCurrentMove(nextHistory.length - 1);
        }
        function jumpTo(move) {
            //const newHistory = history.slice(0,nextMove+1);
            //const newTurn = turnValue.slice(0,nextMove+1);
            //setHistory(newHistory);
            //setTurnValue(newTurn);
            setCurrentMove(move);
        }

        const moves = history.map((squares, move) => {
            let description;
            if (move > 0) {
                description = 'Go to move #' + move;
            } else {
                description = 'Go to game start';
            }
            return (
                <li key={move}>
                    <button onClick={() => jumpTo(move)}>{calculateWinner(squares) ? 'Winner move' : description}</button>
                </li>
            );
        });
        return (
            <div className="game">
                <div className="game-board">
                    <Board turnValue={turnValue} squares={currentSquares} onPlay={handlePlay} />
                </div>
                <div className="game-info">
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
    function calculateWinner(squares) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    }
    function Person(){
        return <Test3 aa={'test'} bb={'ceva'}/>;
    }
    function Lista(){
        const people=[
            'Creola Katherine Johnson: mathematician',
            'Mario José Molina-Pasquel Henríquez: chemist',
            'Mohammad Abdus Salam: physicist',
            'Percy Lavon Julian: chemist',
            'Subrahmanyan Chandrasekhar: astrophysicist'
        ];
        const per = people.filter(person => person.toLowerCase().includes('chemist'));
        for (let i = 0; i < per.length; i++) {
            per[i]=<li key={i}>{per[i]}</li>;
        }
        return <ul>{per}</ul>;
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
                <Game></Game>

                <Ceva/>
                <Test2/>
                <Person/>
                <Lista/>
            </div>

        </div>
        </>
    )
}

export default App
