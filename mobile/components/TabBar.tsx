import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../constants/Colors';

interface SingleItemProperties {
  id: string | number;
  name: string;
}

interface TabBarProps {
  selected: string | number;
  items: SingleItemProperties[];
  onPressItem: (id: string | number) => void;
}

const width: number = Dimensions.get('window').width;

const TabBar = (props: TabBarProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.itemsContainer}>
        {props.items.map((item) => (
          <TouchableOpacity
            style={{
              width: (width - 20) / props.items.length,
              height: '100%',
              backgroundColor:
                props.selected === item.id ? Colors.LIGHT_TEAL : 'transparent',
              borderRadius: 15,
            }}
            onPress={() => props.onPressItem(item.id)}>
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    width: width,
    height: 42,
    marginVertical: 10,
  },
  itemsContainer: {
    width: width - 20,
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    textAlign: 'center',
    height: '100%',
    textAlignVertical: 'center',
    color: Colors.BLACK,
    fontSize: 15,
    fontFamily: 'Anybody-Regular',
  },
});

export default TabBar;
