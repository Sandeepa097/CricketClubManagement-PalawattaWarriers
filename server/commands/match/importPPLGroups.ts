import fs from 'fs';
import { randomUUID } from 'crypto';
import { Op, Transaction } from 'sequelize';
import sequelizeConnection from '../../config/sequelizeConnection';
import { Match, PPLGroup } from '../../models';

type ArgumentKey = 'file' | 'dry-run';

interface CommandArguments {
  file?: string;
  dryRun: boolean;
}

interface CsvRow {
  matchIdA: number;
  matchIdB: number;
  groupTitle?: string;
  titleA?: string;
  titleB?: string;
}

const parseArguments = (): CommandArguments => {
  const commandArguments: CommandArguments = {
    dryRun: false,
  };

  process.argv.forEach((argument) => {
    if (!argument.startsWith('--')) return;

    const [rawKey, rawValue] = argument.slice(2).split('=');
    const key = rawKey as ArgumentKey;

    if (key === 'dry-run') {
      commandArguments.dryRun = rawValue !== 'false';
      return;
    }

    if (key === 'file') {
      commandArguments.file = rawValue;
    }
  });

  return commandArguments;
};

const parseCsvContent = (content: string): string[][] => {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentValue = '';
  let inQuotes = false;

  for (let index = 0; index < content.length; index++) {
    const currentCharacter = content[index];
    const nextCharacter = content[index + 1];

    if (currentCharacter === '"') {
      if (inQuotes && nextCharacter === '"') {
        currentValue += '"';
        index++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (currentCharacter === ',' && !inQuotes) {
      currentRow.push(currentValue.trim());
      currentValue = '';
      continue;
    }

    if ((currentCharacter === '\n' || currentCharacter === '\r') && !inQuotes) {
      if (currentCharacter === '\r' && nextCharacter === '\n') {
        index++;
      }

      currentRow.push(currentValue.trim());
      if (currentRow.some((value) => value.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentValue = '';
      continue;
    }

    currentValue += currentCharacter;
  }

  if (currentValue.length > 0 || currentRow.length > 0) {
    currentRow.push(currentValue.trim());
    if (currentRow.some((value) => value.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
};

const getColumnValue = (row: Record<string, string>, keys: string[]) => {
  for (let index = 0; index < keys.length; index++) {
    const value = row[keys[index]];
    if (value !== undefined) {
      return value;
    }
  }

  return undefined;
};

const normalizeCsvRows = (content: string): CsvRow[] => {
  const parsedRows = parseCsvContent(content);
  if (!parsedRows.length) {
    return [];
  }

  const headers = parsedRows[0].map((header) => header.trim().toLowerCase());
  const dataRows = parsedRows.slice(1);

  return dataRows.map((columns, rowIndex) => {
    const mappedRow = headers.reduce<Record<string, string>>(
      (acc, header, index) => {
        acc[header] = columns[index] || '';
        return acc;
      },
      {},
    );

    const matchIdA = Number(
      getColumnValue(mappedRow, [
        'matchida',
        'match_id_a',
        'firstmatchid',
        'match1id',
      ]),
    );
    const matchIdB = Number(
      getColumnValue(mappedRow, [
        'matchidb',
        'match_id_b',
        'secondmatchid',
        'match2id',
      ]),
    );

    if (!matchIdA || !matchIdB) {
      throw new Error(
        `Invalid CSV at row ${rowIndex + 2}. Required headers: matchIdA, matchIdB, groupTitle?, titleA?, titleB?`,
      );
    }

    return {
      matchIdA,
      matchIdB,
      groupTitle:
        getColumnValue(mappedRow, [
          'grouptitle',
          'group_title',
          'pplgrouptitle',
          'ppl_title',
          'matchtitle',
        ]) || undefined,
      titleA:
        getColumnValue(mappedRow, [
          'titlea',
          'title_a',
          'teamatitle',
          'team1title',
        ]) || undefined,
      titleB:
        getColumnValue(mappedRow, [
          'titleb',
          'title_b',
          'teambtitle',
          'team2title',
        ]) || undefined,
    };
  });
};

const validateRows = async (rows: CsvRow[]) => {
  if (!rows.length) {
    throw new Error('CSV file does not contain any data rows.');
  }

  const allMatchIds = rows.flatMap((row) => [row.matchIdA, row.matchIdB]);
  const duplicateMatchId = allMatchIds.find(
    (matchId, index) => allMatchIds.indexOf(matchId) !== index,
  );

  if (duplicateMatchId) {
    throw new Error(`Match id ${duplicateMatchId} is repeated in the CSV.`);
  }

  const matches = await Match.findAll({
    where: {
      id: {
        [Op.in]: allMatchIds,
      },
    },
  });

  const matchById = matches.reduce<Record<number, any>>((acc, match) => {
    acc[match.dataValues.id] = match;
    return acc;
  }, {});

  rows.forEach((row) => {
    if (row.matchIdA === row.matchIdB) {
      throw new Error(
        `Row with match ${row.matchIdA} pairs the same match twice.`,
      );
    }

    const matchA = matchById[row.matchIdA];
    const matchB = matchById[row.matchIdB];

    if (!matchA || !matchB) {
      throw new Error(
        `Could not find both matches for pair ${row.matchIdA}, ${row.matchIdB}.`,
      );
    }

    if (matchA.dataValues.oppositeTeamId || matchB.dataValues.oppositeTeamId) {
      throw new Error(
        `Pair ${row.matchIdA}, ${row.matchIdB} contains a non-PPL match.`,
      );
    }

    if (matchA.dataValues.pplGroupId || matchB.dataValues.pplGroupId) {
      throw new Error(
        `Pair ${row.matchIdA}, ${row.matchIdB} already belongs to a PPL group.`,
      );
    }

    if (matchA.dataValues.pplTeamSide || matchB.dataValues.pplTeamSide) {
      throw new Error(
        `Pair ${row.matchIdA}, ${row.matchIdB} already has team side information.`,
      );
    }
  });

  return matchById;
};

const updatePair = async (row: CsvRow, transaction: Transaction) => {
  const pplGroupId = randomUUID();

  await PPLGroup.create(
    {
      id: pplGroupId,
      title: row.groupTitle || null,
    },
    { transaction },
  );

  await Match.update(
    {
      pplGroupId,
      pplTeamSide: 'teamA',
      ...(row.titleA ? { title: row.titleA } : {}),
    },
    {
      where: { id: row.matchIdA },
      transaction,
    },
  );

  await Match.update(
    {
      pplGroupId,
      pplTeamSide: 'teamB',
      ...(row.titleB ? { title: row.titleB } : {}),
    },
    {
      where: { id: row.matchIdB },
      transaction,
    },
  );

  return pplGroupId;
};

const run = async () => {
  const commandArguments = parseArguments();

  if (!commandArguments.file) {
    throw new Error('CSV file path is required. Use --file=path/to/file.csv');
  }

  if (!fs.existsSync(commandArguments.file)) {
    throw new Error(`CSV file not found: ${commandArguments.file}`);
  }

  const fileContent = fs.readFileSync(commandArguments.file, 'utf8');
  const rows = normalizeCsvRows(fileContent);
  await validateRows(rows);

  if (commandArguments.dryRun) {
    console.log(
      'Validation passed. Dry run mode enabled, no records were updated.',
    );
    rows.forEach((row) => {
      console.log(
        `Would group ${row.matchIdA} <-> ${row.matchIdB}${
          row.groupTitle || row.titleA || row.titleB
            ? ` with group title [${row.groupTitle || '-'}] and team titles [${
                row.titleA || '-'
              }] / [${row.titleB || '-'}]`
            : ''
        }`,
      );
    });
    return;
  }

  await sequelizeConnection.transaction(async (transaction) => {
    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      const pplGroupId = await updatePair(row, transaction);
      console.log(
        `Grouped ${row.matchIdA} <-> ${row.matchIdB} under ${pplGroupId}`,
      );
    }
  });

  console.log('PPL grouping import completed successfully.');
};

run()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelizeConnection.close();
  });
