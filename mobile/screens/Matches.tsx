import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import Button from '../components/base/Button';
import { Colors } from '../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import SearchField from '../components/base/SearchField';
import TabBar from '../components/base/TabBar';
import CompactMatchItem from '../components/CompactMatchItem';
import { NavigationRoutes } from '../constants/NavigationRoutes';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { PPLMatch } from '../types';
import EmptyListMessage from '../components/base/EmptyListMessage';
import { UserTypes } from '../constants/UserTypes';
import { useIsFocused } from '@react-navigation/native';
import {
  retrieveOutdoorMatches,
  retrievePPLMatches,
} from '../redux/slices/matchSlice';
import { retrieveTeams } from '../redux/slices/teamSlice';
import { retrievePlayers } from '../redux/slices/playerSlice';
import Draggable from '../components/base/Draggable';

const Matches = ({ navigation }) => {
  const focused = useIsFocused();
  const dispatch = useDispatch<AppDispatch>();
  const userType = useSelector((state: RootState) => state.auth.userType);
  const outdoors = useSelector((state: RootState) => state.match.outdoors);
  const ppls = useSelector((state: RootState) => state.match.ppls);
  const [searchText, setSearchText] = useState('');
  const [selectedTabItem, setSelectedTabItem] = useState('outdoor');

  useEffect(() => {
    if (focused) {
      if (selectedTabItem === 'outdoor') dispatch(retrieveOutdoorMatches());
      else dispatch(retrievePPLMatches());
    }
  }, [focused, selectedTabItem]);

  return (
    <View style={styles.container}>
      <SearchField
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
      <TabBar
        selected={selectedTabItem}
        items={[
          { id: 'outdoor', name: 'Outdoor' },
          { id: 'ppl', name: 'PPL' },
        ]}
        onPressItem={(id) => setSelectedTabItem(id.toString())}
      />
      <EmptyListMessage
        visible={
          selectedTabItem === 'outdoor'
            ? outdoors.length === 0
            : ppls.length === 0
        }
        message="No matches found."
      />
      <FlatList
        data={
          (selectedTabItem === 'outdoor'
            ? outdoors.filter(
                (outdoor) =>
                  outdoor.title
                    .toLowerCase()
                    .indexOf(searchText.toLocaleLowerCase()) > -1
              )
            : ppls.filter(
                (ppl) =>
                  ppl.title
                    .toLowerCase()
                    .indexOf(searchText.toLocaleLowerCase()) > -1
              )) as PPLMatch[]
        }
        renderItem={({ item }) => (
          <CompactMatchItem
            key={item.id}
            {...item}
            onPress={() =>
              navigation.navigate(NavigationRoutes.OPPOSITE_TEAM_MATCHES, item)
            }
          />
        )}
        ListEmptyComponent={
          <EmptyListMessage visible={true} message="No matches found." />
        }
      />
      {userType === UserTypes.ADMIN && (
        <Draggable>
          <Button
            sticky={true}
            position={{ bottom: 10, right: 10 }}
            shape="square"
            size={52}
            color={Colors.DEEP_TEAL}
            style="filled"
            icon={() => (
              <MaterialIcons
                name="post-add"
                size={24}
                color={Colors.OFF_WHITE}
              />
            )}
            onPress={() => navigation.navigate(NavigationRoutes.CREATE_MATCH)}
          />
        </Draggable>
      )}
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

export default Matches;
