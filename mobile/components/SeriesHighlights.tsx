import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BestPlayerCard } from '../utils/bestPlayers';
import { BestPlayerChip } from './BestPlayersRow';

interface SeriesHighlightsProps {
  bestBatters: BestPlayerCard[];
  bestBowlers: BestPlayerCard[];
  bestFielders: BestPlayerCard[];
}

const roles = [
  { key: 'bat', roll: 'batsman' },
  { key: 'bowl', roll: 'bowler' },
  { key: 'field', roll: 'fielder' },
] as const;

const asList = (players?: BestPlayerCard[] | null) =>
  Array.isArray(players) ? players.filter((player) => player?.name) : [];

const SeriesHighlights = ({
  bestBatters,
  bestBowlers,
  bestFielders,
}: SeriesHighlightsProps) => {
  const playersByRole = {
    bat: asList(bestBatters),
    bowl: asList(bestBowlers),
    field: asList(bestFielders),
  };
  const visibleRoles = roles.filter((role) => playersByRole[role.key].length);

  if (!visibleRoles.length) {
    return null;
  }

  return (
    <View>
      {visibleRoles.map((role) => (
        <View key={role.key} style={styles.row}>
          {playersByRole[role.key].slice(0, 2).map((player, playerIndex) => (
            <BestPlayerChip
              key={`${role.key}-${player.id}-${playerIndex}`}
              {...player}
              roll={role.roll}
              position={playerIndex + 1}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
});

export default SeriesHighlights;
