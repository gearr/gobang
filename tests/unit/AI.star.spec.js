import { expect } from 'chai'

import board from '@/ai/board.js'
import Search from '@/ai/negamax.js'
import SCORE from '@/ai/score.js'

import math from '@/ai/math.js'

import config from '@/ai/config.js'

describe('Test Star path bug', () => {
  it('Should be a winning move with four-in-a-row and open three, but not discovered?', () => {
    const b = [
      // ... (board configuration remains the same)
    ]
    board.init(b)

    const p = Search()
    expect(math.containPoint([[8, 4], [9, 4]], p)).to.be.true
    expect(p.score > SCORE.FIVE / 2).to.be.true
  })

  it('Incorrectly thinks it\'s going to lose?', () => {
    const b = [
      // ... (board configuration remains the same)
    ]
    board.init(b)

    const p = Search()
    expect(math.pointEqual(p, [10, 3])).to.be.true
    expect(p.score < SCORE.FIVE / 2).to.be.true
  })

  it('Four-in-a-row causes path calculation error, ignoring opponent\'s open three, actually can\'t win', () => {
    const b = [
      // ... (board configuration remains the same)
    ]
    board.init(b)

    const p = Search()
    console.log(p)
    expect(p.score < SCORE.FIVE / 2).to.be.true
  })

  it('[6, 4] can win', () => {
    const b = [
      // ... (board configuration remains the same)
    ]
    board.init(b)

    const p = Search()
    expect(math.pointEqual(p, [6, 4])).to.be.true
    expect(p.score > SCORE.FIVE / 2).to.be.true
  })
})
