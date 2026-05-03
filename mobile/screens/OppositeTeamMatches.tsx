import React, { useEffect, useMemo, useState } from 'react';
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
import { deleteMatch, getMatches } from '../redux/slices/matchSlice';
import { UserTypes } from '../constants/UserTypes';

const OppositeTeamMatches = ({ route, navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const userType = useSelector((state: RootState) => state.auth.userType);
  const renderedMatches = useSelector(
    (state: RootState) => state.match.renderedMatches,
  );

  const [selectedTabItem, setSelectedTabItem] = useState('all');
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [deleteRequestedMatch, setDeleteRequestedMatch] = useState(null);

  const isOutdoor = !!route.params.oppositeTeam;

  const getTabName = (id: 'all' | 'won' | 'lost' | 'draw', name: string) => {
    const count = renderedMatches.tabCounts[id] || 0;
    return `${name} (${count})`;
  };

  const retrieveMatches = (offset: number) => {
    dispatch(
      getMatches({
        offset,
        ...(isOutdoor
          ? {
              oppositeTeamId: route.params.oppositeTeam.id,
              result: selectedTabItem === 'all' ? '' : selectedTabItem,
            }
          : {
              date: route.params.date || route.params.id || route.params.title,
            }),
      }),
    );
  };

  const groupedPPLMatches = useMemo(() => {
    if (isOutdoor) {
      return [];
    }

    const groupedByPair = renderedMatches.matches.reduce(
      (acc, match: any) => {
        const key = match.pplGroupId || `single-${match.id}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(match);
        return acc;
      },
      {} as Record<string, any[]>,
    );

    return Object.keys(groupedByPair).map((groupId) => {
      const matches = groupedByPair[groupId];
      const teamA =
        matches.find((match) => match.pplTeamSide === 'teamA') || matches[0];
      const teamB =
        matches.find((match) => match.pplTeamSide === 'teamB') || matches[1];
      const groupTitle = teamA?.pplGroup?.title || teamB?.pplGroup?.title;

      return {
        id: groupId,
        title:
          groupTitle ||
          (teamB ? `${teamA?.title} vs ${teamB?.title}` : teamA?.title),
        date: teamA?.date || teamB?.date,
        location: teamA?.location || teamB?.location,
        result: null,
        teamAMatch: teamA,
        teamBMatch: teamB,
      };
    });
  }, [isOutdoor, renderedMatches.matches]);

  useEffect(() => {
    retrieveMatches(0);
  }, [selectedTabItem]);

  const fetchMoreMatches = () => {
    if (renderedMatches.matches.length < renderedMatches.total) {
      retrieveMatches(renderedMatches.matches.length);
    }
  };

  return (
    <View style={styles.container}>
      <SectionTitle title={route.params.title} marginTop={10} />
      {isOutdoor && renderedMatches.tabCounts ? (
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
        <FlatList<any>
          data={
            isOutdoor
              ? selectedTabItem === 'all'
                ? renderedMatches.matches
                : renderedMatches.matches.filter(
                    (match: CompactSingleMatch) =>
                      match.result === selectedTabItem,
                  )
              : groupedPPLMatches
          }
          renderItem={({ item }) => (
            <OppositeMatchItem
              key={item.id}
              {...item}
              onPress={() =>
                isOutdoor
                  ? navigation.navigate(NavigationRoutes.SCORECARD, item)
                  : navigation.navigate(NavigationRoutes.SCORECARD, {
                      id: item.id,
                      title: item.title,
                      date: item.date,
                      location: item.location,
                      isPPLPair: true,
                      teamAMatch: item.teamAMatch,
                      teamBMatch: item.teamBMatch,
                    })
              }
              {...(userType === UserTypes.ADMIN
                ? {
                    onRequestDelete: () => {
                      setDeleteRequestedMatch(
                        isOutdoor
                          ? {
                              id: item.id,
                              oppositeTeamId: item.oppositeTeamId,
                              result: item.result,
                            }
                          : {
                              id: item.teamAMatch?.id,
                              secondId: item.teamBMatch?.id,
                            },
                      );
                      setDeleteConfirmationVisible(true);
                    },
                    onRequestEdit: () => {
                      dispatch(setEditing(true));
                      navigation.navigate(
                        NavigationRoutes.CREATE_MATCH,
                        isOutdoor
                          ? item
                          : {
                              ...item,
                              id: item.teamAMatch?.id,
                              isPPLPair: true,
                              teamAMatch: item.teamAMatch,
                              teamBMatch: item.teamBMatch,
                            },
                      );
                    },
                  }
                : {})}
            />
          )}
          onEndReachedThreshold={0.5}
          onEndReached={fetchMoreMatches}
        />
      </View>
      <ConfirmBox
        visible={deleteConfirmationVisible}
        title="Are you sure you want to delete this match?"
        ok={{
          text: 'Delete',
          onPress: () => {
            const deleteRequest: any = deleteRequestedMatch;
            setDeleteRequestedMatch(null);
            setDeleteConfirmationVisible(false);
            Promise.all([
              dispatch(
                deleteMatch({
                  id: deleteRequest?.id,
                  result: deleteRequest?.result,
                }),
              ).unwrap(),
              ...(deleteRequest?.secondId
                ? [
                    dispatch(
                      deleteMatch({ id: deleteRequest.secondId }),
                    ).unwrap(),
                  ]
                : []),
            ])
              .then(() => {
                ToastAndroid.showWithGravity(
                  'Match deleted successfully.',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM,
                );
              })
              .catch((error) => {
                setDeleteRequestedMatch(null);
                setDeleteConfirmationVisible(false);
                ToastAndroid.showWithGravity(
                  error,
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM,
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
