interface BattingStatsInterface {
  score?: number;
  balls: number;
  sixes?: number;
  fours?: number;
  isOut?: boolean;
}

interface BowlingStatsInterface {
  wickets?: number;
  overs: number;
  conceded?: number;
  maidens?: number;
  numberOfDeliveriesPerOver?: number;
}

interface FieldingStatsInterface {
  catches?: number;
  stumps?: number;
  directHits?: number;
  indirectHits?: number;
}

export const calculateBattingPoints = ({
  score,
  balls,
  sixes,
  fours,
  isOut,
}: BattingStatsInterface) => {
  let totalPoints: number = 0;

  // 1 point if scored
  if (score && score > 0) totalPoints++;

  // 2 points per six off one ball
  totalPoints += 2 * (sixes || 0);

  // 1 point per four off one ball
  totalPoints += fours || 0;

  // Minus 10 points if dismissed for duck
  if (isOut && !score) totalPoints -= 10;

  // Points for strike rate
  const strikeRate: number = ((score || 0) / balls) * 100;
  if (strikeRate < 50) totalPoints -= 10;

  // Points for strike rate if scored more than 10 runs
  if ((score || 0) < 10) return totalPoints;

  if (strikeRate >= 100 && strikeRate < 125) totalPoints += 10;
  else if (strikeRate >= 125 && strikeRate < 150) totalPoints += 20;
  else if (strikeRate >= 150 && strikeRate < 175) totalPoints += 30;
  else if (strikeRate >= 175 && strikeRate < 200) totalPoints += 40;
  else if (strikeRate >= 200) totalPoints += 50;

  // Points for every 10 runs
  if ((score || 0) >= 10) totalPoints += 10;
  if ((score || 0) >= 20) totalPoints += 20;
  if ((score || 0) >= 30) totalPoints += 30;
  if ((score || 0) >= 40) totalPoints += 40;
  if ((score || 0) >= 50) totalPoints += 50;
  if ((score || 0) > 50) totalPoints += (score || 0) * 2;

  return totalPoints;
};

export const calculateBowlingPoints = ({
  wickets,
  overs,
  conceded,
  maidens,
  numberOfDeliveriesPerOver,
}: BowlingStatsInterface) => {
  let totalPoints: number = 0;

  // 40 points if maidens bowled
  if ((maidens || 0) > 0) totalPoints += 40;

  // Points for every wicket
  if ((wickets || 0) >= 1) totalPoints += 20;
  if ((wickets || 0) >= 2) totalPoints += 10;
  if ((wickets || 0) >= 3) totalPoints += 20;
  if ((wickets || 0) >= 4) totalPoints += 40;
  if ((wickets || 0) >= 5) totalPoints += 80;

  // Calculate total number of overs bowled if six deliveries in an over
  const totalNumberOfBalls =
    Math.floor(overs) * (numberOfDeliveriesPerOver || 6) +
    (overs - Math.floor(overs)) * 10;
  const oversIfSixDeliveriesPerOver =
    Math.floor(totalNumberOfBalls / 6) + (totalNumberOfBalls % 6) / 10;

  // Points for economy if bowled at least 2 overs
  if (oversIfSixDeliveriesPerOver < 2) return totalPoints;
  const economy = (conceded || 0) / oversIfSixDeliveriesPerOver;

  if (economy < 2) totalPoints += 30;
  else if (economy < 4) totalPoints += 20;
  else if (economy < 6) totalPoints += 10;
  else if (economy < 8) totalPoints += 0;
  else if (economy < 10) totalPoints -= 10;
  else if (economy < 12) totalPoints -= 20;
  else if (economy >= 12) totalPoints -= 30;

  return totalPoints;
};

export const calculateFieldingPoints = ({
  catches,
  stumps,
  directHits,
  indirectHits,
}: FieldingStatsInterface) => {
  let totalPoints: number = 50; // Always getting 50 points if an official player of the match

  totalPoints += 10 * (catches || 0);
  totalPoints += 20 * (stumps || 0);
  totalPoints += 20 * (directHits || 0);
  totalPoints += 10 * (indirectHits || 0);

  return totalPoints;
};
