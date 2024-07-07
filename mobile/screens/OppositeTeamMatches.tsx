import React, { useState } from 'react';
import { FlatList, StyleSheet, ToastAndroid, View } from 'react-native';
import SectionTitle from '../components/base/SectionTitle';
import TabBar from '../components/base/TabBar';
import OppositeMatchItem from '../components/OppositeMatchItem';
import { NavigationRoutes } from '../constants/NavigationRoutes';
import ConfirmBox from '../components/base/ConfirmBox';
import { CompactSingleMatch } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { setEditing } from '../redux/slices/statusSlice';
import { deleteMatch } from '../redux/slices/matchSlice';
import { UserTypes } from '../constants/UserTypes';

const OppositeTeamMatches = ({ route, navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const userType = useSelector((state: RootState) => state.auth.userType);

  const [matchesDetails, setMatchesDetails] = useState(route.params);
  const [selectedTabItem, setSelectedTabItem] = useState('all');
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [deleteRequestedMatch, setDeleteRequestedMatch] = useState(null);

  const getTabName = (id: 'all' | 'won' | 'lost' | 'draw', name: string) => {
    const count = matchesDetails.counts[id] || 0;
    return `${name} (${count})`;
  };

  return (
    <View style={styles.container}>
      <SectionTitle title={matchesDetails.title} marginTop={10} />
      {matchesDetails.counts ? (
        <TabBar
          selected={selectedTabItem}
          items={[
            { id: 'all', name: getTabName('all', 'All') },
            { id: 'won', name: getTabName('won', 'Won') },
            { id: 'lost', name: getTabName('lost', 'Lost') },
            { id: 'draw', name: getTabName('draw', 'Draw') },
          ]}
          onPressItem={(id) => setSelectedTabItem(id.toString())}
        />
      ) : (
        <></>
      )}
      <View style={{ flex: 1 }}>
        <FlatList
          data={
            selectedTabItem === 'all'
              ? matchesDetails.matches
              : matchesDetails.matches.filter(
                  (match: CompactSingleMatch) =>
                    match.result === selectedTabItem
                )
          }
          renderItem={({ item }) => (
            <OppositeMatchItem
              key={item.id}
              {...item}
              onPress={() =>
                navigation.navigate(NavigationRoutes.SCORECARD, item)
              }
              {...(userType === UserTypes.ADMIN
                ? {
                    onRequestDelete: () => {
                      setDeleteRequestedMatch({
                        id: item.id,
                        oppositeTeamId: item.oppositeTeamId,
                        result: item.result,
                      });
                      setDeleteConfirmationVisible(true);
                    },
                    onRequestEdit: () => {
                      dispatch(setEditing(true));
                      navigation.navigate(NavigationRoutes.CREATE_MATCH, item);
                    },
                  }
                : {})}
            />
          )}
        />
      </View>
      <ConfirmBox
        visible={deleteConfirmationVisible}
        title="Are you sure you want to delete this match?"
        ok={{
          text: 'Delete',
          onPress: () => {
            setDeleteRequestedMatch(null);
            setDeleteConfirmationVisible(false);
            dispatch(deleteMatch(deleteRequestedMatch))
              .unwrap()
              .then(() => {
                setMatchesDetails({
                  ...matchesDetails,
                  matches: matchesDetails.matches.filter(
                    (match: any) => match.id !== deleteRequestedMatch.id
                  ),
                  counts: deleteRequestedMatch.oppositeTeamId
                    ? {
                        ...matchesDetails.counts,
                        all: matchesDetails.counts.all - 1,
                        [deleteRequestedMatch.result]:
                          matchesDetails.counts[deleteRequestedMatch.result] -
                          1,
                      }
                    : undefined,
                });
                ToastAndroid.showWithGravity(
                  'Match deleted successfully.',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM
                );
              })
              .catch((error) => {
                setDeleteRequestedMatch(null);
                setDeleteConfirmationVisible(false);
                ToastAndroid.showWithGravity(
                  error,
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM
                );
              });
          },
        }}
        cancel={{
          text: 'Cancel',
          onPress: () => {
            setDeleteRequestedMatch(null);
            setDeleteConfirmationVisible(false);
          },
        }}
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

export default OppositeTeamMatches;
