import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import SectionTitle from '../components/base/SectionTitle';
import TextInput from '../components/base/TextInput';
import PlayersPicker from '../components/PlayersPicker';
import ChildInputWithPlayers from '../components/ChildInputWithPlayers';
import Button from '../components/base/Button';
import { Colors } from '../constants/Colors';
import SwitchInput from '../components/base/SwitchInput';
import ResultsPicker from '../components/ResultsPicker';
import DatePicker from '../components/DatePicker';
import OppositeTeamPicker from '../components/OppositeTeamPicker';

const samplePlayersList: PlayerType[] = [
  {
    id: 1,
    name: 'Adonis Ross',
    mainRoll: 'batsman',
    isWicketKeeper: true,
    isCaptain: true,
  },
  {
    id: 2,
    name: 'Robert Robinson',
    mainRoll: 'bowler',
    isWicketKeeper: true,
    isCaptain: false,
  },
  {
    id: 3,
    name: 'Adonis Ross',
    mainRoll: 'allRounder',
    isWicketKeeper: false,
    isCaptain: true,
  },
  {
    id: 4,
    name: 'Adonis Ross',
    mainRoll: 'batsman',
    isWicketKeeper: false,
    isCaptain: false,
  },
  {
    id: 5,
    name: 'Adonis Ross',
    mainRoll: 'batsman',
    isWicketKeeper: true,
    isCaptain: true,
  },
  {
    id: 6,
    name: 'Adonis Ross',
    mainRoll: 'batsman',
    isWicketKeeper: true,
    isCaptain: true,
  },
  {
    id: 7,
    name: 'Adonis Ross',
    mainRoll: 'batsman',
    isWicketKeeper: true,
    isCaptain: true,
  },
  {
    id: 8,
    name: 'Adonis Ross',
    mainRoll: 'batsman',
    isWicketKeeper: true,
    isCaptain: true,
  },
  {
    id: 9,
    name: 'Adonis Ross',
    mainRoll: 'batsman',
    isWicketKeeper: true,
    isCaptain: true,
  },
  {
    id: 10,
    name: 'Adonis Ross',
    mainRoll: 'batsman',
    isWicketKeeper: true,
    isCaptain: true,
  },
];

const CreateMatch = ({ navigation }) => {
  const emptyPlayersMessage = 'No players found in the team';

  const [isPPL, setIsPPL] = useState(false);
  const [oppositeTeam, setOppositeTeam] = useState(null);
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [result, setResult] = useState(null);
  const [officialPlayers, setOfficialPlayers] = useState([]);
  const [battingDetails, setBattingDetails] = useState([]);
  const [bowlingDetails, setBowlingDetails] = useState([]);
  const [fieldingDetails, setFieldingDetails] = useState([]);

  const onChangeOfficialPlayers = (values: (string | number)[]) => {
    setBattingDetails(
      battingDetails.filter((batsman) => values.includes(batsman.id))
    );
    setBowlingDetails(
      bowlingDetails.filter((bowler) => values.includes(bowler.id))
    );
    setFieldingDetails(
      fieldingDetails.filter((fielder) => values.includes(fielder.id))
    );
    setOfficialPlayers(values);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ display: 'flex', alignItems: 'center' }}>
        <SectionTitle title="Match Details" marginTop={10} />
        <SwitchInput
          placeholder="Mark as PPL"
          value={isPPL}
          onChangeValue={() => setIsPPL(!isPPL)}
        />
        {!isPPL && (
          <OppositeTeamPicker
            placeholder="Opposite Team"
            value={oppositeTeam}
            onChange={setOppositeTeam}
          />
        )}
        <DatePicker placeholder="Date" value={date} onChange={setDate} />
        <TextInput
          value={location}
          onChangeText={setLocation}
          length="long"
          placeholder="Location"
        />
        {!isPPL && (
          <ResultsPicker
            title="Select result"
            placeholder="Results"
            value={result}
            onChangeValue={setResult}
          />
        )}
        <PlayersPicker
          placeholder="Players of Your Team"
          players={samplePlayersList}
          selected={officialPlayers}
          onChangeSelection={onChangeOfficialPlayers}
        />
        <SectionTitle title="Batting Details" />
        <ChildInputWithPlayers
          placeholder="Select Batsmen"
          emptyMessage={emptyPlayersMessage}
          players={samplePlayersList.filter((player) =>
            officialPlayers.includes(player.id)
          )}
          values={battingDetails}
          onChangeValues={setBattingDetails}
          itemProperties={[
            { type: 'text', name: 'score', placeholder: 'Score' },
            { type: 'text', name: 'balls', placeholder: 'Balls' },
            { type: 'text', name: '6s', placeholder: '6s' },
            { type: 'text', name: '4s', placeholder: '4s' },
            {
              type: 'switch',
              name: 'out',
              text: 'Out',
            },
          ]}
        />
        <SectionTitle title="Bowling Details" />
        <ChildInputWithPlayers
          placeholder="Select Bowlers"
          emptyMessage={emptyPlayersMessage}
          players={samplePlayersList.filter((player) =>
            officialPlayers.includes(player.id)
          )}
          values={bowlingDetails}
          onChangeValues={setBowlingDetails}
          itemProperties={[
            { type: 'text', name: 'wickets', placeholder: 'Wickets' },
            { type: 'text', name: 'overs', placeholder: 'Overs' },
            { type: 'text', name: 'conceded', placeholder: 'Conceded' },
            { type: 'text', name: 'maidens', placeholder: 'Maidens' },
          ]}
        />
        <SectionTitle title="Fielding Details" />
        <ChildInputWithPlayers
          placeholder="Select Fielders"
          emptyMessage={emptyPlayersMessage}
          players={samplePlayersList.filter((player) =>
            officialPlayers.includes(player.id)
          )}
          values={fieldingDetails}
          onChangeValues={setFieldingDetails}
          itemProperties={[
            { type: 'text', name: 'catches', placeholder: 'Catches' },
            { type: 'text', name: 'stumps', placeholder: 'Stumps' },
            { type: 'text', name: 'directHits', placeholder: 'Direct Hits' },
            {
              type: 'text',
              name: 'indirectHits',
              placeholder: 'Indirect Hits',
            },
          ]}
        />
        <View style={{ marginTop: 40 }}>
          <Button
            length="long"
            style="filled"
            color={Colors.DEEP_TEAL}
            text="Create"
            onPress={() => console.log('create')}
          />
          <Button
            length="long"
            style="outlined"
            color={Colors.DEEP_TEAL}
            text="Cancel"
            onPress={() => navigation.goBack()}
          />
        </View>
      </ScrollView>
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

export default CreateMatch;
