import React from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationRoutes } from '../constants/NavigationRoutes';

const Payments = ({ navigation }) => {
  return (
    <View>
      <Text>Payments Screen</Text>
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
