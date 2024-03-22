import React, { useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors } from '../constants/Colors';
import Logo from '../assets/Logo';
import SwipeAction from './SwipeAction';

interface PlayerItemProps {
  id: string | number;
  name: string;
  avatar?: string;
  mainRoll: 'batsman' | 'bowler' | 'allRounder';
  isWicketKeeper: boolean;
  isCaptain: boolean;
  flat?: boolean;
  width?: number;
  verticalSpaceBetweenText?: number;
  avatarSize?: number;
  onPress: (id: string | number) => void;
  onRequestDelete?: () => void;
  onRequestEdit?: () => void;
}

const width: number = Dimensions.get('window').width;

const SpecialRollItem = ({
  text,
  flat,
}: {
  text: 'C' | 'W';
  flat: boolean | undefined;
}) => (
  <View
    style={[styles.singleSpecialRollContainer, { borderWidth: flat ? 0 : 1 }]}>
    <Text style={styles.specialRollText}>{text}</Text>
  </View>
);

const BasicPlayerItem = (props: PlayerItemProps) => {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: props.flat ? Colors.MEDIUM_TEAL : Colors.OFF_WHITE,
          width: props.width ? props.width : width - 20,
        },
      ]}>
      <View style={styles.leftSideContainer}>
        <View
          style={[
            styles.avatarContainer,
            {
              width: props.avatarSize || 40,
              height: props.avatarSize || 40,
              borderRadius: props.avatarSize ? props.avatarSize / 2 : 20,
            },
          ]}>
          {!props.avatar ? (
            <Logo height={props.avatarSize ? props.avatarSize - 10 : 40} />
          ) : (
            <Image
              source={{ uri: props.avatar }}
              style={
                props.avatarSize
                  ? {
                      height: props.avatarSize,
                      width: props.avatarSize,
                      borderRadius: props.avatarSize / 2,
                    }
                  : { height: 40, width: 40, borderRadius: 20 }
              }
            />
          )}
        </View>
        <View>
          <Text
            style={[
              styles.name,
              { color: props.flat ? Colors.OFF_WHITE : Colors.DEEP_TEAL },
            ]}>
            {props.name}
          </Text>
          <Text
            style={[
              styles.roll,
              { color: props.flat ? Colors.OFF_WHITE : Colors.DEEP_TEAL },
              { marginTop: props.verticalSpaceBetweenText || 0 },
            ]}>
            {props.mainRoll.charAt(0).toUpperCase() +
              props.mainRoll.replace(/([A-Z])/g, ' $1').slice(1)}
          </Text>
        </View>
      </View>
      <View style={styles.specialRollsContainer}>
        {props.isWicketKeeper && <SpecialRollItem text="W" flat={props.flat} />}
        {props.isCaptain && <SpecialRollItem text="C" flat={props.flat} />}
      </View>
    </View>
  );
};

const PressableItem = (props: PlayerItemProps) => {
  const [inPress, setInPress] = useState(false);

  if (props.onPress === undefined) {
    return <BasicPlayerItem {...props} />;
  }

  return (
    <Pressable
      style={[
        props.flat ? { marginBottom: 10 } : styles.shadowContainer,
        { width: props.width ? props.width + 4 : width - 16 },
        inPress ? { backgroundColor: 'transparent', opacity: 0.5 } : {},
      ]}
      onPressIn={() => setInPress(true)}
      onPressOut={() => setInPress(false)}
      onPress={() => props.onPress(props.id)}>
      <BasicPlayerItem {...props} />
    </Pressable>
  );
};

const PlayerItem = (props: PlayerItemProps) => {
  if (props.onRequestDelete !== undefined && props.onRequestEdit !== undefined)
    return (
      <SwipeAction
        onRequestEdit={props.onRequestEdit}
        onRequestDelete={props.onRequestDelete}>
        <PressableItem {...props} />
      </SwipeAction>
    );

  return <PressableItem {...props} />;
};

const styles = StyleSheet.create({
  shadowContainer: {
    paddingLeft: 4,
    paddingBottom: 4,
    borderRadius: 15,
    marginRight: 4,
    marginBottom: 10,
    backgroundColor: Colors.LIGHT_SHADOW,
  },
  container: {
    padding: 10,
    borderRadius: 15,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSideContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    backgroundColor: Colors.OFF_WHITE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  singleSpecialRollContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: Colors.DEEP_TEAL,
    backgroundColor: Colors.OFF_WHITE,
    marginLeft: 10,
  },
  specialRollsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  specialRollText: {
    color: Colors.DEEP_TEAL,
    fontSize: 15,
    fontFamily: 'Anybody-Regular',
  },
  name: {
    fontSize: 20,
    fontFamily: 'Anybody-Regular',
  },
  roll: {
    fontSize: 15,
    fontFamily: 'Anybody-Regular',
  },
});

export default PlayerItem;
