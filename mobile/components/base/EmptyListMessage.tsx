import { Fontisto } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';

interface EmptyListMessageProps {
  visible: boolean;
  message: string;
}

const EmptyListMessage = (props: EmptyListMessageProps) => {
  if (!props.visible) return <></>;

  return (
    <View style={styles.container}>
      <Fontisto name="dropbox" size={80} color={Colors.LIGHT_TEAL} />
      <Text style={styles.text}>{props.message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 20,
    fontFamily: 'Anybody-Regular',
    fontSize: 20,
    color: Colors.LIGHT_TEAL,
  },
});

export default EmptyListMessage;
