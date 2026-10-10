export type OurRole = 'bat' | 'field';

export type ExtraKind = 'wide' | 'noBall' | 'bye' | 'legBye';

export type WicketKind =
  | 'bowled'
  | 'caught'
  | 'stumped'
  | 'runOutDirect'
  | 'runOutIndirect';

export type MatchResult = 'won' | 'lost' | 'draw';

export interface BallEvent {
  type: 'ball';
  runs: number;
  extra: ExtraKind | null;
  wicket: boolean;
  nextBatsmanId?: number;
  wicketKind?: WicketKind;
  fielderId?: number;
}

export interface OpenersEvent {
  type: 'openers';
  strikerId: number;
  nonStrikerId: number;
}

export interface SwapEvent {
  type: 'swap';
}

export interface RetireEvent {
  type: 'retire';
  batsmanId: number;
  nextBatsmanId: number;
}

export interface BowlerEvent {
  type: 'bowler';
  bowlerId: number;
}

export interface EndInningsEvent {
  type: 'endInnings';
}

export type ScoringEvent =
  | BallEvent
  | OpenersEvent
  | SwapEvent
  | RetireEvent
  | BowlerEvent
  | EndInningsEvent;

export interface LiveDraft {
  version: 1;
  title: string;
  oppositeTeamId: number;
  oppositeTeamName: string;
  date: string;
  location: string;
  numberOfDeliveriesPerOver: number;
  firstRole: OurRole;
  events: ScoringEvent[];
}

export interface BatterFigure {
  id: number;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOut: boolean;
  retired: boolean;
}

export interface BowlerFigure {
  id: number;
  legalBalls: number;
  conceded: number;
  wickets: number;
  maidens: number;
  overs: number;
  currentOverBalls: number;
  currentOverConceded: number;
}

export interface FieldingFigure {
  id: number;
  catches: number;
  stumps: number;
  directHits: number;
  indirectHits: number;
}

export interface InningsState {
  role: OurRole;
  ended: boolean;
  runs: number;
  wickets: number;
  legalBalls: number;
  oversLabel: string;
  strikerId: number | null;
  nonStrikerId: number | null;
  batsmen: BatterFigure[];
  bowlerId: number | null;
  bowlers: BowlerFigure[];
  fielding: FieldingFigure[];
  thisOver: string[];
}

export interface LiveScoreState {
  innings: [InningsState, InningsState];
  currentInningsIndex: 0 | 1;
  matchEnded: boolean;
  current: InningsState;
}

interface MutableInnings {
  role: OurRole;
  ended: boolean;
  runs: number;
  wickets: number;
  legalBalls: number;
  strikerId: number | null;
  nonStrikerId: number | null;
  batsmen: BatterFigure[];
  bowlerId: number | null;
  bowlers: BowlerFigure[];
  fielding: FieldingFigure[];
  thisOver: string[];
  pendingOverReset: boolean;
}

const emptyBatter = (id: number): BatterFigure => ({
  id,
  runs: 0,
  balls: 0,
  fours: 0,
  sixes: 0,
  isOut: false,
  retired: false,
});

const emptyInnings = (role: OurRole): MutableInnings => ({
  role,
  ended: false,
  runs: 0,
  wickets: 0,
  legalBalls: 0,
  strikerId: null,
  nonStrikerId: null,
  batsmen: [],
  bowlerId: null,
  bowlers: [],
  fielding: [],
  thisOver: [],
  pendingOverReset: false,
});

export const formatOversLabel = (legalBalls: number, ballsPerOver: number) => {
  const completed = Math.floor(legalBalls / ballsPerOver);
  const remainder = legalBalls % ballsPerOver;
  return `${completed}.${remainder}`;
};

export const toOversDecimal = (legalBalls: number, ballsPerOver: number) => {
  const completed = Math.floor(legalBalls / ballsPerOver);
  const remainder = legalBalls % ballsPerOver;
  return Number((completed + remainder / 10).toFixed(1));
};

export const ballToken = (
  runs: number,
  extra: ExtraKind | null,
  wicket: boolean,
) => {
  let label = `${runs}`;
  if (extra === 'wide') label = `${Math.max(runs, 1)}wd`;
  else if (extra === 'noBall') label = runs > 0 ? `${runs}nb` : 'nb';
  else if (extra === 'bye') label = `${runs}b`;
  else if (extra === 'legBye') label = `${runs}lb`;
  if (wicket) label += 'W';
  return label;
};

export const wicketKindsFor = (extra: ExtraKind | null): WicketKind[] => {
  if (extra === 'wide') return ['stumped', 'runOutDirect', 'runOutIndirect'];
  if (extra === 'noBall' || extra === 'bye' || extra === 'legBye') {
    return ['runOutDirect', 'runOutIndirect'];
  }
  return ['bowled', 'caught', 'stumped', 'runOutDirect', 'runOutIndirect'];
};

export const wicketKindLabel: Record<WicketKind, string> = {
  bowled: 'Bowled',
  caught: 'Caught',
  stumped: 'Stumped',
  runOutDirect: 'Run out (direct)',
  runOutIndirect: 'Run out (indirect)',
};

const teamRunsFor = (ball: BallEvent) => {
  if (ball.extra === 'wide') return Math.max(ball.runs, 1);
  if (ball.extra === 'noBall') return 1 + ball.runs;
  return ball.runs;
};

const batterRunsFor = (ball: BallEvent) => {
  if (ball.extra === 'wide' || ball.extra === 'bye' || ball.extra === 'legBye') {
    return 0;
  }
  return ball.runs;
};

const bowlerRunsFor = (ball: BallEvent) => {
  if (ball.extra === 'bye' || ball.extra === 'legBye') return 0;
  if (ball.extra === 'wide') return Math.max(ball.runs, 1);
  if (ball.extra === 'noBall') return 1 + ball.runs;
  return ball.runs;
};

// The one-run penalty on a wide or no-ball does not change ends. Only runs the batters actually take do.
const runningRunsFor = (ball: BallEvent) => {
  if (ball.extra === 'wide') return Math.max(ball.runs, 1) - 1;
  return ball.runs;
};

const isLegalDelivery = (ball: BallEvent) =>
  ball.extra !== 'wide' && ball.extra !== 'noBall';

const creditsBowlerWicket = (kind: WicketKind | undefined) =>
  kind === 'bowled' || kind === 'caught' || kind === 'stumped';

const findBatter = (innings: MutableInnings, id: number) =>
  innings.batsmen.find((batter) => batter.id === id);

const ensureBatter = (innings: MutableInnings, id: number) => {
  const existing = findBatter(innings, id);
  if (existing) return existing;
  const batter = emptyBatter(id);
  innings.batsmen.push(batter);
  return batter;
};

const ensureBowler = (innings: MutableInnings, id: number) => {
  const existing = innings.bowlers.find((bowler) => bowler.id === id);
  if (existing) return existing;
  const bowler: BowlerFigure = {
    id,
    legalBalls: 0,
    conceded: 0,
    wickets: 0,
    maidens: 0,
    overs: 0,
    currentOverBalls: 0,
    currentOverConceded: 0,
  };
  innings.bowlers.push(bowler);
  return bowler;
};

const ensureFielder = (innings: MutableInnings, id: number) => {
  const existing = innings.fielding.find((fielder) => fielder.id === id);
  if (existing) return existing;
  const fielder: FieldingFigure = {
    id,
    catches: 0,
    stumps: 0,
    directHits: 0,
    indirectHits: 0,
  };
  innings.fielding.push(fielder);
  return fielder;
};

const swapStrike = (innings: MutableInnings) => {
  if (innings.strikerId == null || innings.nonStrikerId == null) return;
  const strikerId = innings.strikerId;
  innings.strikerId = innings.nonStrikerId;
  innings.nonStrikerId = strikerId;
};

const applyBall = (
  innings: MutableInnings,
  ball: BallEvent,
  ballsPerOver: number,
) => {
  if (innings.pendingOverReset) {
    innings.thisOver = [];
    innings.pendingOverReset = false;
  }

  const legal = isLegalDelivery(ball);
  innings.runs += teamRunsFor(ball);
  innings.thisOver.push(ballToken(ball.runs, ball.extra, ball.wicket));

  if (innings.role === 'bat' && innings.strikerId != null) {
    const batter = ensureBatter(innings, innings.strikerId);
    const batterRuns = batterRunsFor(ball);
    batter.runs += batterRuns;
    if (legal) batter.balls += 1;
    if (
      (ball.extra == null || ball.extra === 'noBall') &&
      (batterRuns === 4 || batterRuns === 6)
    ) {
      if (batterRuns === 4) batter.fours += 1;
      if (batterRuns === 6) batter.sixes += 1;
    }
    if (ball.wicket) {
      batter.isOut = true;
      innings.wickets += 1;
      if (
        ball.nextBatsmanId != null &&
        ball.nextBatsmanId !== innings.nonStrikerId
      ) {
        ensureBatter(innings, ball.nextBatsmanId);
        innings.strikerId = ball.nextBatsmanId;
      } else {
        innings.strikerId = null;
      }
    }
  }

  if (innings.role === 'field' && innings.bowlerId != null) {
    const bowler = ensureBowler(innings, innings.bowlerId);
    const conceded = bowlerRunsFor(ball);
    bowler.conceded += conceded;
    bowler.currentOverConceded += conceded;
    if (ball.wicket) {
      innings.wickets += 1;
      if (creditsBowlerWicket(ball.wicketKind)) bowler.wickets += 1;
      if (ball.fielderId != null && ball.wicketKind === 'caught') {
        ensureFielder(innings, ball.fielderId).catches += 1;
      }
      if (ball.fielderId != null && ball.wicketKind === 'stumped') {
        ensureFielder(innings, ball.fielderId).stumps += 1;
      }
      if (ball.fielderId != null && ball.wicketKind === 'runOutDirect') {
        ensureFielder(innings, ball.fielderId).directHits += 1;
      }
      if (ball.fielderId != null && ball.wicketKind === 'runOutIndirect') {
        ensureFielder(innings, ball.fielderId).indirectHits += 1;
      }
    }
  }

  if (legal) {
    innings.legalBalls += 1;
    if (innings.role === 'field' && innings.bowlerId != null) {
      const bowler = ensureBowler(innings, innings.bowlerId);
      bowler.legalBalls += 1;
      bowler.currentOverBalls += 1;
      if (
        bowler.currentOverBalls === ballsPerOver &&
        bowler.currentOverConceded === 0
      ) {
        bowler.maidens += 1;
      }
    }
  }

  const overComplete = legal && innings.legalBalls % ballsPerOver === 0;
  if (!ball.wicket && runningRunsFor(ball) % 2 === 1) swapStrike(innings);
  if (overComplete) {
    innings.bowlers.forEach((bowler) => {
      bowler.currentOverBalls = 0;
      bowler.currentOverConceded = 0;
    });
    innings.pendingOverReset = true;
    swapStrike(innings);
    if (innings.role === 'field') innings.bowlerId = null;
  }
};

const applyEvent = (
  innings: MutableInnings,
  event: ScoringEvent,
  ballsPerOver: number,
) => {
  if (event.type === 'openers') {
    if (innings.role !== 'bat') return;
    if (event.strikerId === event.nonStrikerId) return;
    if (innings.legalBalls > 0) return;
    innings.strikerId = event.strikerId;
    innings.nonStrikerId = event.nonStrikerId;
    ensureBatter(innings, event.strikerId);
    ensureBatter(innings, event.nonStrikerId);
    return;
  }

  if (event.type === 'swap') {
    if (innings.role !== 'bat') return;
    swapStrike(innings);
    return;
  }

  if (event.type === 'retire') {
    if (innings.role !== 'bat') return;
    const batter = findBatter(innings, event.batsmanId);
    if (!batter || batter.isOut || batter.retired) return;
    if (
      event.nextBatsmanId === innings.strikerId ||
      event.nextBatsmanId === innings.nonStrikerId
    ) {
      return;
    }
    batter.retired = true;
    ensureBatter(innings, event.nextBatsmanId);
    if (innings.strikerId === event.batsmanId) {
      innings.strikerId = event.nextBatsmanId;
    } else if (innings.nonStrikerId === event.batsmanId) {
      innings.nonStrikerId = event.nextBatsmanId;
    }
    return;
  }

  if (event.type === 'bowler') {
    if (innings.role !== 'field') return;
    ensureBowler(innings, event.bowlerId);
    innings.bowlerId = event.bowlerId;
    return;
  }

  if (event.type === 'ball') {
    if (
      innings.role === 'bat' &&
      (innings.strikerId == null || innings.nonStrikerId == null)
    ) {
      return;
    }
    if (innings.role === 'field' && innings.bowlerId == null) return;
    applyBall(innings, event, ballsPerOver);
  }
};

const publishInnings = (
  innings: MutableInnings,
  ballsPerOver: number,
): InningsState => ({
  role: innings.role,
  ended: innings.ended,
  runs: innings.runs,
  wickets: innings.wickets,
  legalBalls: innings.legalBalls,
  oversLabel: formatOversLabel(innings.legalBalls, ballsPerOver),
  strikerId: innings.strikerId,
  nonStrikerId: innings.nonStrikerId,
  batsmen: innings.batsmen.map((batter) => ({ ...batter })),
  bowlerId: innings.bowlerId,
  bowlers: innings.bowlers.map((bowler) => ({
    ...bowler,
    overs: toOversDecimal(bowler.legalBalls, ballsPerOver),
  })),
  fielding: innings.fielding.map((fielder) => ({ ...fielder })),
  thisOver: [...innings.thisOver],
});

export const reduceLiveScore = (draft: LiveDraft): LiveScoreState => {
  const ballsPerOver = draft.numberOfDeliveriesPerOver || 6;
  const innings: [MutableInnings, MutableInnings] = [
    emptyInnings(draft.firstRole),
    emptyInnings(draft.firstRole === 'bat' ? 'field' : 'bat'),
  ];
  let index: 0 | 1 = 0;
  let matchEnded = false;

  draft.events.forEach((event) => {
    if (event.type === 'endInnings') {
      innings[index].ended = true;
      if (index === 0) index = 1;
      else matchEnded = true;
      return;
    }
    if (innings[index].ended || matchEnded) return;
    applyEvent(innings[index], event, ballsPerOver);
  });

  const published: [InningsState, InningsState] = [
    publishInnings(innings[0], ballsPerOver),
    publishInnings(innings[1], ballsPerOver),
  ];

  return {
    innings: published,
    currentInningsIndex: index,
    matchEnded,
    current: published[index],
  };
};

export const canScoreBall = (innings: InningsState) => {
  if (innings.ended) return false;
  if (innings.role === 'bat') {
    return innings.strikerId != null && innings.nonStrikerId != null;
  }
  return innings.bowlerId != null;
};

export const suggestResult = (draft: LiveDraft): MatchResult => {
  const state = reduceLiveScore(draft);
  const ours = state.innings.find((innings) => innings.role === 'bat');
  const theirs = state.innings.find((innings) => innings.role === 'field');
  const ourRuns = ours?.runs || 0;
  const theirRuns = theirs?.runs || 0;
  if (ourRuns > theirRuns) return 'won';
  if (ourRuns < theirRuns) return 'lost';
  return 'draw';
};

export const toMatchPayload = (draft: LiveDraft, result: MatchResult) => {
  const state = reduceLiveScore(draft);
  const batting = state.innings.find((innings) => innings.role === 'bat');
  const bowling = state.innings.find((innings) => innings.role === 'field');
  const officialPlayerIds = new Set<number>();

  (batting?.batsmen || []).forEach((batter) => officialPlayerIds.add(batter.id));
  (bowling?.bowlers || []).forEach((bowler) => {
    if (bowler.legalBalls > 0 || bowler.conceded > 0 || bowler.wickets > 0) {
      officialPlayerIds.add(bowler.id);
    }
  });
  (bowling?.fielding || []).forEach((fielder) => {
    if (
      fielder.catches ||
      fielder.stumps ||
      fielder.directHits ||
      fielder.indirectHits
    ) {
      officialPlayerIds.add(fielder.id);
    }
  });

  return {
    isPPL: false as const,
    title: draft.title,
    oppositeTeamId: draft.oppositeTeamId,
    date: draft.date,
    location: draft.location,
    result,
    numberOfDeliveriesPerOver: draft.numberOfDeliveriesPerOver,
    officialPlayers: [...officialPlayerIds],
    teamATitle: null,
    teamBTitle: null,
    battingStats: (batting?.batsmen || []).map((batter) => ({
      id: batter.id,
      values: {
        score: batter.runs,
        balls: batter.balls,
        fours: batter.fours,
        sixes: batter.sixes,
        isOut: batter.isOut,
      },
    })),
    bowlingStats: (bowling?.bowlers || [])
      .filter(
        (bowler) =>
          bowler.legalBalls > 0 || bowler.conceded > 0 || bowler.wickets > 0,
      )
      .map((bowler) => ({
        id: bowler.id,
        values: {
          wickets: bowler.wickets,
          overs: bowler.overs,
          conceded: bowler.conceded,
          maidens: bowler.maidens,
        },
      })),
    fieldingStats: (bowling?.fielding || [])
      .filter(
        (fielder) =>
          fielder.catches ||
          fielder.stumps ||
          fielder.directHits ||
          fielder.indirectHits,
      )
      .map((fielder) => ({
        id: fielder.id,
        values: {
          catches: fielder.catches,
          stumps: fielder.stumps,
          directHits: fielder.directHits,
          indirectHits: fielder.indirectHits,
        },
      })),
  };
};
