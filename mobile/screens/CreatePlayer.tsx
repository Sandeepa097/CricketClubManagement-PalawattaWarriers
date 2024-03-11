import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ImagePicker from '../components/base/ImagePicker';
import TextInput from '../components/base/TextInput';

const CreatePlayer = () => {
  const [image, setImage] = useState('');
  const [name, setName] = useState('');

  return (
    <View style={styles.container}>
      <ImagePicker />
      <TextInput
        length="long"
        placeholder="Name"
        onChangeText={(text) => setName(text)}
        value={name}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
});

export default CreatePlayer;
