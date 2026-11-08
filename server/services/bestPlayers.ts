export interface BestBatterSummary {
  playerId: number | string;
  totalPoints: number;
  totalScore: number;
  totalBalls: number;
}

export interface BestBowlerSummary {
  playerId: number | string;
  totalPoints: number;
  totalWickets: number;
  totalConceded: number;
}

export interface BestFielderSummary {
  playerId: number | string;
  totalPoints: number;
  totalCatches: number;
  totalStumps: number;
  totalDirectHits: number;
  totalIndirectHits: number;
}

interface BattingStatLike {
  playerId?: number | string | null;
  points?: unknown;
  totalPoints?: unknown;
  score?: unknown;
  totalScore?: unknown;
  balls?: unknown;
  totalBalls?: unknown;
}

interface BowlingStatLike {
  playerId?: number | string | null;
  points?: unknown;
  totalPoints?: unknown;
  wickets?: unknown;
  totalWickets?: unknown;
  conceded?: unknown;
  totalConceded?: unknown;
}

interface FieldingStatLike {
  playerId?: number | string | null;
  points?: unknown;
  totalPoints?: unknown;
  catches?: unknown;
  totalCatches?: unknown;
  stumps?: unknown;
  totalStumps?: unknown;
  directHits?: unknown;
  totalDirectHits?: unknown;
  indirectHits?: unknown;
  totalIndirectHits?: unknown;
}

const SERIES_LIMIT = 2;

const toNumber = (value: unknown) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const rankPlayers = <T extends { totalPoints: number }>(
  players: T[],
  limit: number,
  tieBreak: (left: T, right: T) => number,
) =>
  players
    .map((player, index) => ({ player, index }))
    .sort((left, right) => {
      const points = right.player.totalPoints - left.player.totalPoints;
      if (points) {
        return points;
      }
      const tied = tieBreak(left.player, right.player);
      if (tied) {
        return tied;
      }
      return right.index - left.index;
    })
    .slice(0, limit)
    .map((item) => item.player);

const compareBatters = (left: BestBatterSummary, right: BestBatterSummary) =>
  right.totalScore - left.totalScore || left.totalBalls - right.totalBalls;

const compareBowlers = (left: BestBowlerSummary, right: BestBowlerSummary) =>
  right.totalWickets - left.totalWickets ||
  left.totalConceded - right.totalConceded;

const dismissals = (player: BestFielderSummary) =>
  player.totalCatches +
  player.totalStumps +
  player.totalDirectHits +
  player.totalIndirectHits;

const compareFielders = (left: BestFielderSummary, right: BestFielderSummary) =>
  dismissals(right) - dismissals(left) ||
  right.totalStumps +
    right.totalDirectHits -
    (left.totalStumps + left.totalDirectHits) ||
  right.totalCatches - left.totalCatches;

export const pickBestPlayers = (
  battingStats: BattingStatLike[] = [],
  bowlingStats: BowlingStatLike[] = [],
  fieldingStats: FieldingStatLike[] = [],
  limit = SERIES_LIMIT,
) => {
  const batters = new Map<string, BestBatterSummary>();
  battingStats.forEach((stat) => {
    if (stat.playerId === undefined || stat.playerId === null) {
      return;
    }
    const key = String(stat.playerId);
    const current = batters.get(key) ?? {
      playerId: stat.playerId,
      totalPoints: 0,
      totalScore: 0,
      totalBalls: 0,
    };
    current.totalPoints += toNumber(stat.totalPoints ?? stat.points);
    current.totalScore += toNumber(stat.totalScore ?? stat.score);
    current.totalBalls += toNumber(stat.totalBalls ?? stat.balls);
    batters.set(key, current);
  });

  const bowlers = new Map<string, BestBowlerSummary>();
  bowlingStats.forEach((stat) => {
    if (stat.playerId === undefined || stat.playerId === null) {
      return;
    }
    const key = String(stat.playerId);
    const current = bowlers.get(key) ?? {
      playerId: stat.playerId,
      totalPoints: 0,
      totalWickets: 0,
      totalConceded: 0,
    };
    current.totalPoints += toNumber(stat.totalPoints ?? stat.points);
    current.totalWickets += toNumber(stat.totalWickets ?? stat.wickets);
    current.totalConceded += toNumber(stat.totalConceded ?? stat.conceded);
    bowlers.set(key, current);
  });

  const fielders = new Map<string, BestFielderSummary>();
  fieldingStats.forEach((stat) => {
    if (stat.playerId === undefined || stat.playerId === null) {
      return;
    }
    const key = String(stat.playerId);
    const current = fielders.get(key) ?? {
      playerId: stat.playerId,
      totalPoints: 0,
      totalCatches: 0,
      totalStumps: 0,
      totalDirectHits: 0,
      totalIndirectHits: 0,
    };
    current.totalPoints += toNumber(stat.totalPoints ?? stat.points);
    current.totalCatches += toNumber(stat.totalCatches ?? stat.catches);
    current.totalStumps += toNumber(stat.totalStumps ?? stat.stumps);
    current.totalDirectHits += toNumber(stat.totalDirectHits ?? stat.directHits);
    current.totalIndirectHits += toNumber(
      stat.totalIndirectHits ?? stat.indirectHits,
    );
    fielders.set(key, current);
  });

  const bestBatters = rankPlayers([...batters.values()], limit, compareBatters);
  const bestBowlers = rankPlayers([...bowlers.values()], limit, compareBowlers);
  const bestFielders = rankPlayers(
    [...fielders.values()],
    limit,
    compareFielders,
  );

  return {
    bestBatters,
    bestBowlers,
    bestFielders,
    bestBatter: bestBatters[0] ?? null,
    bestBowler: bestBowlers[0] ?? null,
  };
};
