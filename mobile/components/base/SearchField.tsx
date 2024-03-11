import React from 'react';
import { Dimensions, StyleSheet, TextInput, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';

interface SearchFieldProps {
  value: string | null;
  placeholder?: string;
  onChangeText: (text) => void;
}

const width: number = Dimensions.get('window').width;

const SearchField = (props: SearchFieldProps) => {
  return (
    <View style={styles.container}>
      <FontAwesome name="search" size={20} color={Colors.DEEP_TEAL} />
      <TextInput
        style={styles.input}
        editable
        onChangeText={(text) => props.onChangeText(text)}
        value={props.value}
        placeholder={props.placeholder || 'Search'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: width - 20,
    height: 42,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.DEEP_TEAL,
    backgroundColor: Colors.OFF_WHITE,
    marginVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  input: {
    height: '100%',
    flex: 1,
    marginLeft: 10,
    fontFamily: 'Anybody-Regular',
    fontSize: 20,
    color: Colors.DEEP_TEAL,
  },
});

export default SearchField;
