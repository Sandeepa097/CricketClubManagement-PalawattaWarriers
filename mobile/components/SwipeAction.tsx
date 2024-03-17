import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import { Colors } from '../constants/Colors';

interface SwipeActionProps {
  onRequestEdit: () => void;
  onRequestDelete: () => void;
  children: React.ReactNode;
}

const SwipeAction = (props: SwipeActionProps) => {
  const swipeActionRef = React.createRef<Swipeable>();
  const onSwipe = (direction: 'left' | 'right') => {
    swipeActionRef.current.reset();
    if (direction === 'left') props.onRequestDelete();
    else props.onRequestEdit();
  };

  const renderActions = (progress, dragX, side: 'left' | 'right') => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });

    return (
      <RectButton>
        <Animated.View
          style={[
            styles.animatedItem,
            {
              transform: [{ translateX: trans }],
            },
          ]}>
          {side === 'left' && (
            <MaterialIcons
              name="delete-outline"
              size={40}
              color={Colors.DEEP_ORANGE}
            />
          )}
          {side === 'right' && (
            <FontAwesome name="edit" size={40} color={Colors.DEEP_TEAL} />
          )}
        </Animated.View>
      </RectButton>
    );
  };

  return (
    <Swipeable
      ref={swipeActionRef}
      renderLeftActions={(progress, dragX) =>
        renderActions(progress, dragX, 'left')
      }
      renderRightActions={(progress, dragX) =>
        renderActions(progress, dragX, 'right')
      }
      onSwipeableOpen={onSwipe}>
      {props.children}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  animatedItem: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: '100%',
    paddingBottom: 10,
  },
});

export default SwipeAction;
