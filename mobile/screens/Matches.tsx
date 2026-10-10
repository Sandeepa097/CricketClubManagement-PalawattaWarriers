import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import Button from '../components/base/Button';
import { Colors } from '../constants/Colors';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
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
import { loadLiveDraft } from '../scoring/draftStorage';
import { LiveDraft } from '../scoring/liveScore';

const Matches = ({ navigation }) => {
  const focused = useIsFocused();
  const dispatch = useDispatch<AppDispatch>();
  const userType = useSelector((state: RootState) => state.auth.userType);
  const outdoors = useSelector((state: RootState) => state.match.outdoors);
  const ppls = useSelector((state: RootState) => state.match.ppls);
  const totalOutdoors = useSelector(
    (state: RootState) => state.match.outdoorsTotal
  );
  const totalPPLs = useSelector((state: RootState) => state.match.pplsTotal);
  const [searchText, setSearchText] = useState('');
  const [selectedTabItem, setSelectedTabItem] = useState('outdoor');
  const [liveDraft, setLiveDraft] = useState<LiveDraft | null>(null);

  useEffect(() => {
    if (focused) {
      loadLiveDraft().then(setLiveDraft);
      dispatch(retrieveTeams())
        .unwrap()
        .then(() => {
          dispatch(retrievePlayers())
            .unwrap()
            .then(() => {
              if (selectedTabItem === 'outdoor')
                dispatch(retrieveOutdoorMatches(0));
              else dispatch(retrievePPLMatches(0));
            });
        });
    }
  }, [focused, selectedTabItem]);

  const fetchMoreMatches = () => {
    if (selectedTabItem === 'outdoor') {
      if (outdoors.length < totalOutdoors) {
        dispatch(retrieveOutdoorMatches(outdoors.length));
      }
    } else {
      if (ppls.length < totalPPLs) {
        dispatch(retrievePPLMatches(ppls.length));
      }
    }
  };

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
      {userType === UserTypes.ADMIN && liveDraft && (
        <TouchableOpacity
          style={styles.resumeBanner}
          onPress={() => navigation.navigate(NavigationRoutes.LIVE_SCORE)}>
          <Text style={styles.resumeText}>
            Resume live match vs {liveDraft.oppositeTeamName}
          </Text>
        </TouchableOpacity>
      )}
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
        onEndReachedThreshold={0.5}
        onEndReached={fetchMoreMatches}
      />
      {userType === UserTypes.ADMIN && (
        <Draggable>
          <View style={styles.actions}>
            <Button
              shape="square"
              size={52}
              color={Colors.DEEP_ORANGE}
              style="filled"
              icon={() => (
                <MaterialCommunityIcons
                  name="cricket"
                  size={26}
                  color={Colors.OFF_WHITE}
                />
              )}
              onPress={() =>
                navigation.navigate(NavigationRoutes.LIVE_SCORE_SETUP)
              }
            />
            <Button
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
          </View>
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
  actions: {
    alignItems: 'flex-end',
    padding: 10,
    gap: 12,
  },
  resumeBanner: {
    width: '94%',
    backgroundColor: Colors.DEEP_TEAL,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  resumeText: {
    fontFamily: 'Anybody-Regular',
    fontSize: 15,
    color: Colors.OFF_WHITE,
  },
});

export default Matches;
