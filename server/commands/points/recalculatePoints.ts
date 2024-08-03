import {
  recalculateBattingPoints,
  recalculateBowlingPoints,
  recalculateFieldingPoints,
} from '../../services/pointService';

const args: string[] = process.argv.slice(2);

const command: string = args.length ? args[0] : '';

const battingPointsCalculate = async () => {
  console.log('Recalculating batting points');
  const calculated = await recalculateBattingPoints();
  if (calculated) console.log('Done. (batting)');
  else console.log('Failed. (batting)');
};

const bowlingPointsCalculate = async () => {
  console.log('Recalculating bowling points');
  const calculated = await recalculateBowlingPoints();
  if (calculated) console.log('Done. (bowling)');
  else console.log('Failed. (bowling)');
};

const fieldingPointsCalculate = async () => {
  console.log('Recalculating fielding points');
  const calculated = await recalculateFieldingPoints();
  if (calculated) console.log('Done. (fielding)');
  else console.log('Failed. (fielding)');
};

const allPointsCalculate = async () => {
  await battingPointsCalculate();
  await bowlingPointsCalculate();
  await fieldingPointsCalculate();
  console.log('All the points recalculated successfully.');
};

switch (command) {
  case 'batting':
    battingPointsCalculate();
    break;
  case 'bowling':
    bowlingPointsCalculate();
    break;
  case 'fielding':
    fieldingPointsCalculate();
    break;
  default:
    allPointsCalculate();
}
