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
    expect(calculateBattingPoints(battingStats).totalPoints).toBe(21);
    expect(calculateBattingPoints(battingStats).strikeRate).toBe(150);
  });

  it('should correctly calculate points for a batsman who scored a duck', () => {
    const battingStats = {
      score: 0,
      balls: 5,
      sixes: 0,
      fours: 0,
      isOut: true,
    };
    expect(calculateBattingPoints(battingStats).totalPoints).toBe(-8);
    expect(calculateBattingPoints(battingStats).strikeRate).toBe(0);
  });

  it('should correctly calculate points for a batsman who scored a diamond duck', () => {
    const battingStats = {
      score: 0,
      balls: 0,
      sixes: 0,
      fours: 0,
      isOut: true,
    };
    expect(calculateBattingPoints(battingStats).totalPoints).toBe(-8);
    expect(calculateBattingPoints(battingStats).strikeRate).toBe(0);
  });

  it('should correctly calculate points for a batsman with strike rate above 200', () => {
    const battingStats = {
      score: 75,
      balls: 25,
      sixes: 4,
      fours: 8,
      isOut: false,
    };
    expect(calculateBattingPoints(battingStats).totalPoints).toBe(42);
    expect(calculateBattingPoints(battingStats).strikeRate).toBe(300);
  });

  it('should correctly calculate points for a batsman who stayed non striker end all the time', () => {
    const battingStats = {
      score: 0,
      balls: 0,
      sixes: 0,
      fours: 0,
      isOut: false,
    };
    expect(calculateBattingPoints(battingStats).totalPoints).toBe(0);
    expect(calculateBattingPoints(battingStats).strikeRate).toBe(0);
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
    expect(calculateBowlingPoints(bowlingStats).totalPoints).toBe(45);
    expect(calculateBowlingPoints(bowlingStats).economy).toBe(4.444);
  });

  it('should correctly calculate points for a bowler who bowled maidens', () => {
    const bowlingStats = {
      wickets: 0,
      overs: 3,
      conceded: 15,
      maidens: 2,
      numberOfDeliveriesPerOver: 6,
    };
    expect(calculateBowlingPoints(bowlingStats).totalPoints).toBe(35);
    expect(calculateBowlingPoints(bowlingStats).economy).toBe(5);
  });

  it('should correctly calculate points for a bowler who bowled less than 2 overs', () => {
    const bowlingStats = {
      wickets: 1,
      overs: 0.4,
      conceded: 10,
      maidens: 0,
      numberOfDeliveriesPerOver: 6,
    };
    expect(calculateBowlingPoints(bowlingStats).totalPoints).toBe(20);
    expect(calculateBowlingPoints(bowlingStats).economy).toBe(25);
  });

  it('should correctly calculate points for a bowler who bowled illegal bowls only', () => {
    const bowlingStats = {
      wickets: 0,
      overs: 0,
      conceded: 10,
      maidens: 0,
      numberOfDeliveriesPerOver: 6,
    };
    expect(calculateBowlingPoints(bowlingStats).totalPoints).toBe(0);
    expect(calculateBowlingPoints(bowlingStats).economy).toBe(10);
  });

  it('should correctly calculate points for a bowler who did not bowled', () => {
    const bowlingStats = {
      wickets: 0,
      overs: 0,
      conceded: 0,
      maidens: 0,
      numberOfDeliveriesPerOver: 6,
    };
    expect(calculateBowlingPoints(bowlingStats).totalPoints).toBe(0);
    expect(calculateBowlingPoints(bowlingStats).economy).toBe(0);
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
    expect(calculateFieldingPoints(fieldingStats)).toBe(28);
  });

  it('should correctly calculate points for a fielder who got indirect hits', () => {
    const fieldingStats = {
      catches: 1,
      stumps: 0,
      directHits: 0,
      indirectHits: 3,
    };
    expect(calculateFieldingPoints(fieldingStats)).toBe(26);
  });

  it('should correctly calculate points for a fielder who did not contribute in any way', () => {
    const fieldingStats = {
      catches: 0,
      stumps: 0,
      directHits: 0,
      indirectHits: 0,
    };
    expect(calculateFieldingPoints(fieldingStats)).toBe(0);
  });
});
