import './control.css';
import { useDispatch, useSelector } from 'react-redux';
import { startGame, endGame, undoMove, setAiFirst, setDepth, setIndex, setDebug } from '../store/gameSlice';
import { board_size } from '../config';
import { Button, Switch, Select } from 'antd';
import { STATUS } from '../status';
import { useCallback } from 'react';

function Control() {
  const dispatch = useDispatch();
  const { loading, winner, status, history, aiFirst, depth, index, score, path, currentDepth, debug } = useSelector((state) => state.game);
  const start = useCallback(() => {
    dispatch(startGame({ board_size, aiFirst, depth }));
  }, [dispatch, board_size, aiFirst, depth]);
  const end = useCallback(() => {
    dispatch(endGame());
  }, [dispatch]);
  const undo = useCallback(() => {
    dispatch(undoMove());
  }, [dispatch]);
  const onFirstChange = useCallback((checked) => {
    dispatch(setAiFirst(checked));
  }, [dispatch]);
  const onDepthChange = useCallback((value) => {
    dispatch(setDepth(value));
  }, [dispatch]);
  const onIndexChange = useCallback((checked) => {
    dispatch(setIndex(checked));
  }, [dispatch]);
  const onDebugChange = useCallback((checked) => {
    dispatch(setDebug(checked));
  }, [dispatch]);
  return (
    <div className="control">
      <div className="buttons">
        <Button className="button" type="primary" onClick={start} disabled={loading || status !== STATUS.IDLE}>Start</Button>
        <Button className="button" type="primary" onClick={undo} disabled={loading || status !== STATUS.GAMING || history.length === 0}>Undo</Button>
        <Button className="button" type="primary" onClick={end} disabled={loading || status !== STATUS.GAMING}>Surrender</Button>
      </div>
      <div className="setting">
        <div className="setting-row">
          <div className="setting-item">
            AI First: <Switch defaultChecked={aiFirst} onChange={onFirstChange} disabled={loading} />
          </div>
          <div className="setting-item">
            Difficulty:
            <Select
              defaultValue={String(depth)}
              style={{ width: 160 }}
              onChange={onDepthChange}
              disabled={loading}
              options={[
                { value: '2', label: 'Easy (2-10 layers) Very Fast' },
                { value: '4', label: 'Simple (4-12 layers) Fast' },
                { value: '6', label: 'Normal (6-14 layers) Slow' },
                { value: '8', label: 'Hard (8-16 layers) Very Slow' },
              ]}
            />
          </div>
        </div>
        <div className="setting-row">
          <div className="setting-item">
            Index: <Switch defaultChecked={index} onChange={onIndexChange} />
          </div>
          <div className="setting-item">
            Debug: <Switch defaultChecked={debug} onChange={onDebugChange} disabled={loading} />
          </div>
        </div>
      </div>
      {
        debug && <div className="status">
          <div className="status-item">Score: {score}</div>
          <div className="status-item">Depth: {path?.length || 0}</div>
          <div className="status-item">Thinking: {JSON.stringify(path)}</div>
          <div className="status-item">History: {JSON.stringify(history.map(h => [h.i, h.j]))}</div>
        </div>
      }
    </div>
  );
}

export default Control;
