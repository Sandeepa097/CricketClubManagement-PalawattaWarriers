import React, { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';
import SwipeAction from './SwipeAction';

const width: number = Dimensions.get('window').width;

interface OppositeMatchItemProps {
  date: string;
  location: string;
  result: 'won' | 'lost' | 'draw';
  onPress: () => void;
  onRequestEdit?: () => void;
  onRequestDelete?: () => void;
}

const OppositeMatchItem = (props: OppositeMatchItemProps) => {
  if (props.onRequestDelete !== undefined && props.onRequestEdit !== undefined)
    return (
      <SwipeAction
        onRequestDelete={props.onRequestDelete}
        onRequestEdit={props.onRequestEdit}>
        <PressableOppositeMatchItem {...props} />
      </SwipeAction>
    );

  return <PressableOppositeMatchItem {...props} />;
};

const PressableOppositeMatchItem = (props: OppositeMatchItemProps) => {
  const [inPress, setInPress] = useState(false);
  const icons = {
    won: {
      name: 'smile-wink',
      color: Colors.DEEP_ORANGE,
    },
    lost: {
      name: 'sad-cry',
      color: Colors.MEDIUM_TEAL,
    },
    draw: {
      name: 'meh',
      color: Colors.LIGHT_SHADOW,
    },
  };

  return (
    <Pressable
      style={[
        styles.shadowContainer,
        inPress ? { backgroundColor: 'transparent', opacity: 0.5 } : {},
      ]}
      onPressIn={() => setInPress(true)}
      onPressOut={() => setInPress(false)}
      onPress={() => props.onPress()}>
      <View style={styles.container}>
        <View>
          <Text style={styles.date}>{props.date}</Text>
          <Text style={styles.location}>{props.location}</Text>
        </View>
        <FontAwesome5
          name={icons[props.result].name}
          size={35}
          color={icons[props.result].color}
        />
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
    padding: 15,
    borderRadius: 15,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    color: Colors.DEEP_TEAL,
    fontSize: 20,
    fontFamily: 'Anybody-Regular',
    fontWeight: 'bold',
  },
  location: {
    color: Colors.BLACK,
    fontSize: 15,
    fontFamily: 'Anybody-Regular',
    opacity: 0.5,
    marginTop: 10,
  },
});

export default OppositeMatchItem;
