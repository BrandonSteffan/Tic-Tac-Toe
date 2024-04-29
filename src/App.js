import { useState } from "react";


function Square({value , onSquareCLick, winning}){
    let squareClass = "square " + (winning ? "winning-square" : "");
    return <button className={squareClass} onClick={onSquareCLick} >{value}</button> ;
}


function Board({ xIsNext, squares, onPlay, moves}){
    function handleClick(i) {
        if (squares[i] || calculateWinner(squares)) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        }
        onPlay(nextSquares);
    }

    const winner = calculateWinner(squares);
    let status;
    if(winner){
        status = "Winner " + winner[0];
    }
    else if(!winner && moves.length>9){
        status = "Draw";
    }
    else{
        status = "Next player : " + (xIsNext ? "X" : "O");
    }
    // return (
    //     <>
    //         <div className="status">{status}</div>
    //         <div className="board-row">
    //             <Square value={squares[0]} onSquareCLick={() => handleClick(0)} /> 
    //             <Square value={squares[1]} onSquareCLick={() => handleClick(1)} /> 
    //             <Square value={squares[2]} onSquareCLick={() => handleClick(2)} /> 
    //         </div> 
    //         <div className="board-row">
    //             <Square value={squares[3]} onSquareCLick={() => handleClick(3)} />
    //             <Square value={squares[4]} onSquareCLick={() => handleClick(4)} />
    //             <Square value={squares[5]} onSquareCLick={() => handleClick(5)} />
    //         </div> 
    //         <div className="board-row">
    //             <Square value={squares[6]} onSquareCLick={() => handleClick(6)} />
    //             <Square value={squares[7]} onSquareCLick={() => handleClick(7)} />
    //             <Square value={squares[8]} onSquareCLick={() => handleClick(8)} />
    //         </div>
    //     </>
    // ) ;
    let cols = [];
    for (let h = 0; h < 3; h++) {
        let rows = [];
        for (let j = 0; j < 3; j++) {
            let k = 3*h+j;
            let winningSquare = false;
            if(winner && (winner[1][0] === k || winner[1][1] === k || winner[1][2] === k)){
                winningSquare = true;
            }
            else{
                winningSquare = false;
            }
            rows.push(<Square value={squares[k]} onSquareCLick={()=> handleClick(k)} key={k} winning={winningSquare}/>);
        }
        cols.push(<div className="board-row" key={h}>{rows}</div>);
    };
    return ( 
        <>  
            <div className="status">{status}</div>
            {cols}
        </>
    
    );
    
}

export default function Game(){
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const [ascending, setAscending] = useState(true);
    const displayOrder = ascending ? "Ascending" : "Descending";
    const xIsNext = currentMove %2 === 0;
    const currentSquares = history[currentMove];

    function toggleDisplayOrder(){
        setAscending(!ascending);
    }

    function handlePlay(nextSquares){
        const  nextHistory = [...history.slice(0, currentMove+1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length -1);
    }

    function jumpTo(nextMove){
        setCurrentMove(nextMove);
    }

    const moves = history.map((squares, move) => {
        let description;
        if(move > 0){
            description = "Go to move #" + move;
        }
        else{
            description = "Go to game start";
        }
        if (move != currentMove) {
            return(
                <li key={move}>
                    <button onClick={()=> jumpTo(move)}>{description}</button>
                </li>
            );
        } else {
            return(
                <li key={move}>
                    <>{description}</>
                </li>
            );            
        }
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} moves={moves} />
            </div>
            <div className="game-info">
                <button onClick={toggleDisplayOrder}>{displayOrder}</button>
                <ul>{ascending ? moves : moves.slice().reverse()}</ul>
            </div>
        </div>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a,b,c] = lines[i];
        if(squares[a] && squares [a] === squares[b] && squares[a] === squares[c]){
            return [squares[a] , lines[i]];
        }
    }
    return null;
}
  