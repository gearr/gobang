import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { board_size } from '../config';
import { STATUS } from '../status';
import { start, end, move, undo } from '../bridge';

export const startGame = createAsyncThunk('game/start', async ({ board_size, aiFirst, depth }) => {
  const data = await start(board_size, aiFirst, depth);
  return data;
});

export const movePiece = createAsyncThunk('game/move', async ({ position, depth = 4 }) => {
  const data = await move(position, depth);
  return data;
});

export const endGame = createAsyncThunk('game/end', async (sessionId) => {
  const data = await end();
  return data;
});

export const undoMove = createAsyncThunk('game/undo', async (sessionId) => {
  const data = await undo();
  return data;
});

const initBoard = Array.from({ length: board_size }).map(() => Array.from({ length: board_size }).fill(0));

const initialState = {
  board: initBoard,
  aiFirst: true,
  currentPlayer: null,
  winner: null,
  history: [],
  status: STATUS.IDLE,
  sessionId: null,
  size: 15,
  loading: false,
  depth: 4, // Search depth
  index: false, // Whether to display sequence numbers
  score: 0,
  path: [],
  currentDepth: 0,
  debug: false, // Display debug panel
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    tempMove: (state, action) => {
      const p = action.payload
      state.board[p[0]][p[1]] = state.currentPlayer;
      state.history.push({
        i: p[0],
        j: p[1],
        role: state.currentPlayer,
      });
    },
    setAiFirst: (state, action) => {
      state.aiFirst = action.payload;
    },
    setDepth: (state, action) => {
      state.depth = Number(action.payload);
    },
    setIndex: (state, action) => {
      state.index = action.payload;
    },
    setDebug: (state, action) => {
      state.debug = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startGame.pending, (state) => {
        state.loading = true;
      })
      .addCase(startGame.fulfilled, (state, action) => {
        state.board = action.payload.board;
        state.currentPlayer = action.payload.current_player;
        state.winner = action.payload.winner;
        state.history = action.payload.history;
        state.status = STATUS.GAMING;
        state.sessionId = action.payload.session_id;
        state.size = action.payload.size;
        state.score = action.payload.score;
        state.path = action.payload.bestPath;
        state.currentDepth = action.payload.currentDepth;
        state.loading = false;
      })
      .addCase(movePiece.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(movePiece.fulfilled, (state, action) => {
        state.board = action.payload.board;
        state.currentPlayer = action.payload.current_player;
        state.winner = action.payload.winner;
        state.history = action.payload.history;
        state.score = action.payload.score;
        state.path = action.payload.bestPath;
        state.currentDepth = action.payload.currentDepth;
        state.loading = false;
        if (action.payload.winner !== 0) {
          state.status = STATUS.IDLE;
        }
      })
      .addCase(undoMove.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(undoMove.fulfilled, (state, action) => {
        state.board = action.payload.board;
        state.currentPlayer = action.payload.current_player;
        state.winner = action.payload.winner;
        state.history = action.payload.history;
        state.score = action.payload.score;
        state.path = action.payload.bestPath;
        state.currentDepth = action.payload.currentDepth;
        state.loading = false;
      })
      .addCase(endGame.fulfilled, (state) => {
        state.board = initialState.board;
        state.currentPlayer = initialState.currentPlayer;
        state.winner = initialState.winner;
        state.history = initialState.history;
        state.status = initialState.status;
        state.sessionId = initialState.sessionId;
        state.size = initialState.size;
        state.loading = initialState.loading;
        state.depth = initialState.depth;
        state.score = initialState.score;
        state.path = initialState.path;
        state.currentDepth = initialState.currentDepth;
      });
  },
});
export const { tempMove, setAiFirst, setDepth, setIndex, setDebug } = gameSlice.actions;
export default gameSlice.reducer;
