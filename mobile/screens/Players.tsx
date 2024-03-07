import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Button from '../components/Button';
import { AntDesign } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import SearchField from '../components/SearchField';

const Players = () => {
  const [searchText, setSearchText] = useState('');
  return (
    <View style={styles.container}>
      <SearchField
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
      <Button
        sticky={true}
        position={{ bottom: 10, right: 10 }}
        shape="square"
        size={52}
        color={Colors.DEEP_TEAL}
        style="filled"
        icon={() => (
          <AntDesign name="adduser" size={24} color={Colors.OFF_WHITE} />
        )}
        onPress={() => console.log('pressed')}
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

export default Players;
