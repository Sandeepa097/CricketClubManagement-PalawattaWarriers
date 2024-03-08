import React, { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';
import Logo from '../assets/Logo';

interface PlayerItemProps {
  id: string | number;
  name: string;
  avatar?: string;
  mainRoll: 'batsman' | 'bowler' | 'allRounder';
  isWicketKeeper: boolean;
  isCaptain: boolean;
  onPress: (id: string | number) => void;
}

const width: number = Dimensions.get('window').width;

const SpecialRollItem = ({ text }: { text: 'C' | 'W' }) => (
  <View style={styles.singleSpecialRollContainer}>
    <Text style={styles.specialRollText}>{text}</Text>
  </View>
);

const PlayerItem = (props: PlayerItemProps) => {
  const [inPress, setInPress] = useState(false);

  return (
    <Pressable
      style={[
        styles.shadowContainer,
        inPress ? { backgroundColor: 'transparent', opacity: 0.5 } : {},
      ]}
      onPressIn={() => setInPress(true)}
      onPressOut={() => setInPress(false)}
      onPress={() => props.onPress(props.id)}>
      <View style={styles.container}>
        <View style={styles.leftSideContainer}>
          <View style={styles.avatarContainer}>
            <Logo height={40} />
          </View>
          <View>
            <Text style={styles.name}>{props.name}</Text>
            <Text style={styles.roll}>
              {props.mainRoll.charAt(0).toUpperCase() +
                props.mainRoll.replace(/([A-Z])/g, ' $1').slice(1)}
            </Text>
          </View>
        </View>
        <View style={styles.specialRollsContainer}>
          {props.isWicketKeeper && <SpecialRollItem text="W" />}
          {props.isCaptain && <SpecialRollItem text="C" />}
        </View>
      </View>
    </Pressable>
  );
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
    width: width - 20,
    backgroundColor: Colors.OFF_WHITE,
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
    width: 40,
    height: 40,
    borderRadius: width / 2,
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
    borderWidth: 1,
    borderColor: Colors.DEEP_TEAL,
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
    color: Colors.BLACK,
    fontSize: 20,
    fontFamily: 'Anybody-Regular',
  },
  roll: {
    color: Colors.BLACK,
    fontSize: 15,
    fontFamily: 'Anybody-Regular',
  },
});

export default PlayerItem;
