import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
} from 'react-native';
import Logo from '../assets/Logo';
import { Colors } from '../constants/Colors';
import StrokedText from './base/StrokedText';
import EmptyListMessage from './base/EmptyListMessage';

interface RankingProps {
  id: string | number;
  name: string;
  avatar?: string;
  points: number;
}

interface PlayerProps extends RankingProps {
  placement: number;
}

interface TopPlayerProps extends RankingProps {
  placement: 1 | 2 | 3;
  color: Colors;
}

const width: number = Dimensions.get('window').width;
const topPlayerContainerWidth = (width - 70) / 3;

const TopPlayerItem = (props: TopPlayerProps) => {
  return (
    <View style={styles.singleTopPlayerContainer}>
      <View style={styles.singleTopPlayerDetailsContainer}>
        <View
          style={[
            styles.topPlayerShadowContainer,
            {
              backgroundColor: props.color + '33',
            },
          ]}>
          <View
            style={[
              styles.topPlayerAvatarContainer,
              {
                borderColor: props.color,
              },
            ]}>
            {!props.avatar ? (
              <Logo height={topPlayerContainerWidth - 30} fill={props.color} />
            ) : (
              <Image
                source={{ uri: props.avatar }}
                style={{
                  height: topPlayerContainerWidth - 6,
                  width: topPlayerContainerWidth - 6,
                  borderRadius: (topPlayerContainerWidth - 6) / 2,
                }}
              />
            )}
          </View>
        </View>
        <View
          style={[
            styles.topPlayerPlacementShadowContainer,
            {
              backgroundColor: props.color + '33',
            },
          ]}>
          <View
            style={[
              styles.topPlayerPlacementContainer,
              { borderColor: props.color },
            ]}>
            <Text
              style={[styles.topPlayerPlacementText, { color: props.color }]}>
              {props.placement}
            </Text>
          </View>
        </View>
      </View>
      <View style={[styles.singleTopPlayerDetailsContainer, { marginTop: 8 }]}>
        <Text
          style={[styles.topPlayerName, { color: props.color }]}
          numberOfLines={1}
          ellipsizeMode="tail">
          {props.name}
        </Text>
        <StrokedText
          text={props.points}
          color={Colors.DEEP_ORANGE}
          strokedColor={Colors.WHITE}
          strokedSize={1}
          fontSize={20}
        />
      </View>
    </View>
  );
};

const PlayerItem = (props: PlayerProps) => {
  return (
    <View style={styles.playerContainer}>
      <View style={styles.playerDetailsContainer}>
        <Text style={styles.playerText}>{props.placement}</Text>
        <View style={styles.playerAvatarContainer}>
          {!props.avatar ? (
            <Logo height={30} fill={Colors.DEEP_TEAL} />
          ) : (
            <Image
              source={{ uri: props.avatar }}
              style={{ height: 40, width: 40, borderRadius: 20 }}
            />
          )}
        </View>
        <Text style={styles.playerText}>{props.name}</Text>
      </View>
      <Text style={styles.playerText}>{props.points}</Text>
    </View>
  );
};

const PlayerRanking = ({ items }: { items: RankingProps[] }) => {
  return (
    <View style={styles.container}>
      {items.length >= 3 && (
        <View style={styles.topPlayersContainer}>
          <View>
            <TopPlayerItem
              {...items[1]}
              placement={2}
              color={Colors.DEEP_ORANGE}
            />
          </View>
          <View style={{ marginBottom: 80 }}>
            <TopPlayerItem {...items[0]} placement={1} color={Colors.PURPLE} />
          </View>
          <View>
            <TopPlayerItem
              {...items[2]}
              placement={3}
              color={Colors.DARK_TEAL}
            />
          </View>
        </View>
      )}
      {items.length > 3 && (
        <FlatList
          data={items.slice(3, items.length)}
          renderItem={({ item, index }) => (
            <PlayerItem key={item.id} {...item} placement={index + 4} />
          )}
        />
      )}
      <EmptyListMessage
        visible={items.length < 3}
        message="No enough players to do ranking."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 20,
    flex: 1,
  },
  topPlayersContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topPlayerShadowContainer: {
    width: topPlayerContainerWidth,
    height: topPlayerContainerWidth + 6,
    borderRadius: (topPlayerContainerWidth + 6) / 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  singleTopPlayerContainer: {
    width: topPlayerContainerWidth,
  },
  singleTopPlayerDetailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  topPlayerAvatarContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: topPlayerContainerWidth,
    height: topPlayerContainerWidth,
    borderRadius: topPlayerContainerWidth / 2,
    borderWidth: 3,
    backgroundColor: Colors.OFF_WHITE,
    marginBottom: 6,
  },
  topPlayerPlacementShadowContainer: {
    position: 'absolute',
    bottom: -8,
    width: 24,
    height: 24,
    borderRadius: (topPlayerContainerWidth + 4) / 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topPlayerPlacementContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: Colors.OFF_WHITE,
    marginBottom: 4,
  },
  topPlayerPlacementText: {
    fontFamily: 'Anybody-Regular',
    fontSize: 15,
  },
  topPlayerName: {
    width: '100%',
    fontFamily: 'Anybody-Regular',
    fontSize: 15,
    textAlign: 'center',
  },
  topPlayerPointsContainer: {
    borderBottomWidth: 4,
    borderRadius: 15,
  },
  playerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width - 20,
    borderRadius: 15,
    backgroundColor: Colors.MEDIUM_TEAL,
    height: 50,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  playerDetailsContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  playerAvatarContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.OFF_WHITE,
    marginHorizontal: 10,
  },
  playerText: {
    fontFamily: 'Anybody-Regular',
    fontSize: 15,
    color: Colors.OFF_WHITE,
  },
});

export default PlayerRanking;
