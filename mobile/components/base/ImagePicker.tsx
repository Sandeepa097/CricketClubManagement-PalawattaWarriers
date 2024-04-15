import React, { useEffect, useState } from 'react';
import * as ExpoImagePicker from 'expo-image-picker';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import Logo from '../../assets/Logo';
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import Modal from 'react-native-modal';

interface ImagePickerProps {
  value: string;
  onChange: (value: string) => void;
}

const ImagePicker = (props: ImagePickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const pickImageAsync = async () => {
    setModalVisible(false);
    const image = await ExpoImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.5,
      allowsEditing: true,
      aspect: [10, 10],
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
    });

    if (!image.canceled)
      props.onChange('data:image/jpeg;base64,' + image.assets[0].base64);
  };

  const takePhotoAsync = async () => {
    setModalVisible(false);
    const image = await ExpoImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.5,
      allowsEditing: true,
      aspect: [10, 10],
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
    });

    if (!image.canceled) props.onChange(image.assets[0].base64);
  };

  const removeImage = () => {
    setModalVisible(false);
    props.onChange('');
  };

  return (
    <View
      style={{
        marginVertical: 20,
      }}>
      <View style={styles.container}>
        {!props.value ? (
          <Logo height={100} />
        ) : (
          <Image source={{ uri: props.value }} style={styles.container} />
        )}
      </View>
      <TouchableOpacity
        style={styles.imagePicker}
        activeOpacity={0.5}
        onPress={() => setModalVisible(true)}>
        <Feather name="camera" size={24} color={Colors.DEEP_TEAL} />
      </TouchableOpacity>
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalOption}
            activeOpacity={0.5}
            onPress={takePhotoAsync}>
            <Feather name="camera" size={30} color={Colors.DEEP_TEAL} />
            <Text style={styles.optionText}>Take photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalOption}
            activeOpacity={0.5}
            onPress={pickImageAsync}>
            <MaterialIcons
              name="photo-camera-back"
              size={32}
              color={Colors.DEEP_TEAL}
            />
            <Text style={styles.optionText}>Upload photo</Text>
          </TouchableOpacity>
          {props.value ? (
            <TouchableOpacity
              style={styles.modalOption}
              activeOpacity={0.5}
              onPress={removeImage}>
              <MaterialCommunityIcons
                name="file-image-remove-outline"
                size={30}
                color={Colors.DEEP_ORANGE}
              />
              <Text style={[styles.optionText, { color: Colors.DEEP_ORANGE }]}>
                Remove photo
              </Text>
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    backgroundColor: Colors.OFF_WHITE,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePicker: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: 42,
    width: 42,
    borderRadius: 21,
    backgroundColor: Colors.OFF_WHITE,
    elevation: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: Colors.OFF_WHITE,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    borderRadius: 15,
  },
  modalOption: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    height: 42,
  },
  optionText: {
    color: Colors.DEEP_TEAL,
    fontSize: 20,
    fontFamily: 'Anybody-Regular',
    marginLeft: 15,
  },
});

export default ImagePicker;
