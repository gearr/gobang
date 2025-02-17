import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { movePiece, tempMove } from '../store/gameSlice';
import './board.css';
import bg from '../assets/bg.jpg';
import { board_size } from '../config';
import { STATUS } from '../status';

/*
Help me implement a Board component using React with the following functionality:
Display a Gomoku board. When a user clicks on the board, convert the click position to the corresponding piece coordinates.
Internal state includes coordinates of all pieces on the board, history, and whose turn is next.
Don't use images, draw the board and pieces directly with CSS.
*/

const Board = () => {
  const dispatch = useDispatch();
  const { board, currentPlayer, history, status, size, loading, winner, depth, index } = useSelector((state) => state.game);

  const handleClick = (i, j) => {
    if (loading || status !== STATUS.GAMING) return;
    if (board[i][j] === 0) {
      dispatch(tempMove([i, j]))
      dispatch(movePiece({ position: [i, j], depth }));
    }
  };

  useEffect(() => {
    if (winner === 1 || winner === -1) {
      window.alert(winner === 1 ? 'Black wins' : 'White wins')
    }
  }, [winner]);

  const cellStyle = {
    width: `${375 / board_size}px`,
    height: `${375 / board_size}px`,
  };

  return (
    <div className="board" style={{ backgroundImage: `url(${bg})` }}>
      {board.map((row, i) => (
        <div key={i} className="board-row">
          {row.map((cell, j) => {
            let cellClassName = 'cell';
            if (i === 0) {
              cellClassName += ' top';
            }
            if (i === board_size - 1) {
              cellClassName += ' bottom';
            }
            if (j === 0) {
              cellClassName += ' left';
            }
            if (j === board_size - 1) {
              cellClassName += ' right';
            }
            let pieceClassname = 'piece';
            if (cell === 1) {
              pieceClassname += ' black';
            } else if (cell === -1) {
              pieceClassname += ' white';
            }
            let isLastCell = false;
            const lastMove = history[history.length - 1];
            if (lastMove && (lastMove.i === i && lastMove.j === j)) {
              isLastCell = true;
            }
            let number = 0;
            if (index) {
              for (let x = 0; x < history.length; x++) {
                if (history[x].i === i && history[x].j === j) {
                  number = x + 1;
                  break;
                }
              }
            }
            return (
              <div key={j} className={cellClassName} style={cellStyle} onClick={() => handleClick(i, j)}>
                {cell == 0 ? '' : <div className={pieceClassname}>{number === 0 ? '' : number}</div>}
                {isLastCell && <div className="last" />}
              </div>
            )
          })}
        </div>
      ))}
      {
        loading && <div className="loading">
          <div className="loading-text">AI is thinking...</div>
        </div>
      }
    </div>
  );
};

export default Board;
