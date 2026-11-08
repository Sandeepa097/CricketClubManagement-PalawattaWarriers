export interface BestPlayerCard {
  id: string | number;
  name: string;
  avatar?: string | null;
  score: string;
}

interface BestPlayerSummary {
  playerId?: string | number | null;
  totalScore?: number | string | null;
  totalBalls?: number | string | null;
  totalWickets?: number | string | null;
  totalConceded?: number | string | null;
  totalCatches?: number | string | null;
  totalStumps?: number | string | null;
  totalDirectHits?: number | string | null;
  totalIndirectHits?: number | string | null;
}

interface ListedPlayer {
  id: string | number;
  name: string;
  avatar?: string | null;
}

const toNumber = (value: number | string | null | undefined) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatBestPlayer = (
  summary: BestPlayerSummary | null | undefined,
  players: ListedPlayer[],
  kind: 'batter' | 'bowler' | 'fielder',
): BestPlayerCard | null => {
  if (summary?.playerId === undefined || summary?.playerId === null) {
    return null;
  }

  const player = players.find((item) => item.id === summary.playerId);
  if (!player) {
    return null;
  }

  const score =
    kind === 'batter'
      ? `${summary.totalScore}/${summary.totalBalls}`
      : kind === 'bowler'
        ? `${summary.totalWickets}/${summary.totalConceded}`
        : `${
            toNumber(summary.totalCatches) +
            toNumber(summary.totalStumps) +
            toNumber(summary.totalDirectHits) +
            toNumber(summary.totalIndirectHits)
          }`;

  return {
    id: player.id,
    name: player.name,
    avatar: player.avatar,
    score,
  };
};

export const formatBestPlayers = (
  summaries: BestPlayerSummary[] | null | undefined,
  players: ListedPlayer[],
  kind: 'batter' | 'bowler' | 'fielder',
) =>
  (Array.isArray(summaries) ? summaries : [])
    .map((summary) => formatBestPlayer(summary, players, kind))
    .filter((player): player is BestPlayerCard => player !== null);
