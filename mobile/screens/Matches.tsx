import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import Button from '../components/base/Button';
import { Colors } from '../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import SearchField from '../components/base/SearchField';
import TabBar from '../components/base/TabBar';
import CompactMatchItem from '../components/CompactMatchItem';
import { NavigationRoutes } from '../constants/NavigationRoutes';
import ConfirmBox from '../components/base/ConfirmBox';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { OutdoorMatch, PPLMatch } from '../types';
import EmptyListMessage from '../components/base/EmptyListMessage';

const Matches = ({ navigation }) => {
  const outdoors = useSelector((state: RootState) => state.match.outdoors);
  const ppls = useSelector((state: RootState) => state.match.ppls);
  const [searchText, setSearchText] = useState('');
  const [selectedTabItem, setSelectedTabItem] = useState('outdoor');
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);

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
        data={(selectedTabItem === 'outdoor' ? outdoors : ppls) as PPLMatch[]}
        renderItem={({ item }) => (
          <CompactMatchItem
            key={item.id}
            {...item}
            onPress={() =>
              navigation.navigate(
                selectedTabItem === 'outdoor'
                  ? NavigationRoutes.OPPOSITE_TEAM_MATCHES
                  : NavigationRoutes.SCORECARD,
                item
              )
            }
            {...(selectedTabItem === 'ppl'
              ? {
                  onRequestDelete: () => setDeleteConfirmationVisible(true),
                  onRequestEdit: () =>
                    navigation.navigate(NavigationRoutes.CREATE_MATCH),
                }
              : {})}
          />
        )}
      />
      <ConfirmBox
        visible={deleteConfirmationVisible}
        title="Are you sure you want to delete this match?"
        ok={{ text: 'Delete', onPress: () => console.log('delete') }}
        cancel={{
          text: 'Cancel',
          onPress: () => setDeleteConfirmationVisible(false),
        }}
      />
      <Button
        sticky={true}
        position={{ bottom: 10, right: 10 }}
        shape="square"
        size={52}
        color={Colors.DEEP_TEAL}
        style="filled"
        icon={() => (
          <MaterialIcons name="post-add" size={24} color={Colors.OFF_WHITE} />
        )}
        onPress={() => navigation.navigate(NavigationRoutes.CREATE_MATCH)}
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

export default Matches;
