import { useNetInfo, NetInfoStateType } from '@react-native-community/netinfo';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';

const OfflineNotice = () => {
  const netinfo = useNetInfo();
  if (netinfo.type !== NetInfoStateType.unknown && !netinfo.isInternetReachable)
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No Internet Connection</Text>
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    zIndex: 10,
    padding: 10,
    backgroundColor: Colors.DEEP_ORANGE,
  },
  text: {
    color: Colors.OFF_WHITE,
    fontFamily: 'Anybody-Regular',
    fontSize: 18,
  },
});

export default OfflineNotice;
