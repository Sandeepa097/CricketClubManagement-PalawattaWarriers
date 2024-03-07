import React from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationRoutes } from '../constants/NavigationRoutes';
import Button from '../components/Button';
import { Colors } from '../constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';

const Payments = ({ navigation }) => {
  return (
    <View style={{ height: '100%' }}>
      <Text>Payments Screen</Text>
      <Button
        sticky={true}
        position={{ bottom: 10, right: 10 }}
        shape="square"
        size={52}
        color={Colors.DEEP_TEAL}
        style="filled"
        icon={() => (
          <FontAwesome5
            name="money-check-alt"
            size={24}
            color={Colors.OFF_WHITE}
          />
        )}
        onPress={() => console.log('pressed')}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate(NavigationRoutes.WELCOME)}>
        <View>
          <Text>Go Back</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Payments;
