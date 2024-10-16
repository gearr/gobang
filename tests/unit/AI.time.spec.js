import { expect, assert } from 'chai'

import board from '@/ai/board.js'
import Search from '@/ai/negamax.js'
import SCORE from '@/ai/score.js'

describe('Test Time', () => {
  it('Opening time', () => {
    const b = [
      // ... (board configuration remains the same)
    ]
    board.init(b);

    Search();
  })

  it('Will it be slow when there are too many meaningless four-in-a-row', () => {
    const b = [
      // ... (board configuration remains the same)
    ]
    board.init(b);

    const p = Search();
  })

  it('There is a winning move here, only [6, 5] and [5, 4] are winning moves', function () {
    const b = [
      // ... (board configuration remains the same)
    ];
    board.init(b);
    var p = Search(1, 10);
    assert.ok(p.score > SCORE.THREE);
    assert.ok((p[0] == 6 && p[1] === 5) || (p[0] == 5 && p[1] === 4));
  });

  it('Test VCT bug, there should be no winning move here', function () {
    const b = [
      // ... (board configuration remains the same)
    ];
    board.init(b);
    var p = Search();
    assert.ok(p.score < SCORE.FIVE / 2)
  });

  it('Test four-in-a-row and open three bug', function () {
    const b = [
      // ... (board configuration remains the same)
    ];
    board.init(b);
    var p = Search();
    // Four-in-a-row and open three
    assert.ok(p.score > SCORE.FOUR);
  });
})
