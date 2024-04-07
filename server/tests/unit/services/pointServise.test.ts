import {
  calculateBattingPoints,
  calculateBowlingPoints,
  calculateFieldingPoints,
} from '../../../services/pointService';

describe('calculateBattingPoints', () => {
  it('should correctly calculate points for a batsman who scored runs', () => {
    const battingStats = {
      score: 45,
      balls: 30,
      sixes: 2,
      fours: 5,
      isOut: false,
    };
    expect(calculateBattingPoints(battingStats)).toBe(140);
  });

  it('should correctly calculate points for a batsman who scored a duck', () => {
    const battingStats = {
      score: 0,
      balls: 5,
      sixes: 0,
      fours: 0,
      isOut: true,
    };
    expect(calculateBattingPoints(battingStats)).toBe(-20);
  });

  it('should correctly calculate points for a batsman with strike rate above 200', () => {
    const battingStats = {
      score: 75,
      balls: 25,
      sixes: 4,
      fours: 8,
      isOut: false,
    };
    expect(calculateBattingPoints(battingStats)).toBe(367);
  });
});

describe('calculateBowlingPoints', () => {
  it('should correctly calculate points for a bowler who took wickets and bowled economically', () => {
    const bowlingStats = {
      wickets: 3,
      overs: 4.5,
      conceded: 20,
      maidens: 1,
      numberOfDeliveriesPerOver: 6,
    };
    expect(calculateBowlingPoints(bowlingStats)).toBe(100);
  });

  it('should correctly calculate points for a bowler who bowled maidens', () => {
    const bowlingStats = {
      wickets: 0,
      overs: 3,
      conceded: 15,
      maidens: 2,
      numberOfDeliveriesPerOver: 6,
    };
    expect(calculateBowlingPoints(bowlingStats)).toBe(50);
  });

  it('should correctly calculate points for a bowler who bowled less than 2 overs', () => {
    const bowlingStats = {
      wickets: 1,
      overs: 1.4,
      conceded: 10,
      maidens: 0,
      numberOfDeliveriesPerOver: 6,
    };
    expect(calculateBowlingPoints(bowlingStats)).toBe(20);
  });
});

describe('calculateFieldingPoints', () => {
  it('should correctly calculate points for a fielder who took catches and stumps', () => {
    const fieldingStats = {
      catches: 2,
      stumps: 1,
      directHits: 0,
      indirectHits: 0,
    };
    expect(calculateFieldingPoints(fieldingStats)).toBe(90);
  });

  it('should correctly calculate points for a fielder who got indirect hits', () => {
    const fieldingStats = {
      catches: 1,
      stumps: 0,
      directHits: 0,
      indirectHits: 3,
    };
    expect(calculateFieldingPoints(fieldingStats)).toBe(90);
  });

  it('should correctly calculate points for a fielder who did not contribute in any way', () => {
    const fieldingStats = {
      catches: 0,
      stumps: 0,
      directHits: 0,
      indirectHits: 0,
    };
    expect(calculateFieldingPoints(fieldingStats)).toBe(50);
  });
});
