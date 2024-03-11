import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { Colors } from '../../constants/Colors';

interface ActionButtonProps {
  text: string;
  onPress: () => void;
}

interface ConfirmBoxProps {
  visible: boolean;
  title: string;
  ok: ActionButtonProps;
  cancel: ActionButtonProps;
}

const ConfirmBox = (props: ConfirmBoxProps) => {
  return (
    <Modal isVisible={props.visible} onBackdropPress={props.cancel.onPress}>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>{props.title}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.okButtonContainer}
            activeOpacity={0.5}
            onPress={props.ok.onPress}>
            <Text style={styles.okText}>{props.ok.text}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButtonContainer}
            activeOpacity={0.5}
            onPress={props.cancel.onPress}>
            <Text style={styles.cancelText}>{props.cancel.text}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.OFF_WHITE,
    borderRadius: 15,
    padding: 15,
  },
  title: {
    color: Colors.DEEP_ORANGE,
    fontSize: 15,
    fontFamily: 'Anybody-Regular',
  },
  buttonsContainer: {
    marginTop: 20,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  okButtonContainer: {
    backgroundColor: Colors.DEEP_ORANGE,
    borderRadius: 10,
    marginRight: 15,
    padding: 10,
  },
  cancelButtonContainer: {
    backgroundColor: Colors.OFF_WHITE,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.DEEP_ORANGE,
    padding: 10,
  },
  okText: {
    textAlign: 'center',
    color: Colors.OFF_WHITE,
    fontSize: 15,
    fontFamily: 'Anybody-Regular',
  },
  cancelText: {
    textAlign: 'center',
    color: Colors.DEEP_ORANGE,
    fontSize: 15,
    fontFamily: 'Anybody-Regular',
  },
});

export default ConfirmBox;
