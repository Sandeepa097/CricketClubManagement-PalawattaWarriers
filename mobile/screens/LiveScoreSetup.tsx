import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import SectionTitle from '../components/base/SectionTitle';
import TextInput from '../components/base/TextInput';
import Button from '../components/base/Button';
import DatePicker from '../components/DatePicker';
import OppositeTeamPicker from '../components/OppositeTeamPicker';
import ConfirmBox from '../components/base/ConfirmBox';
import { Colors } from '../constants/Colors';
import { NavigationRoutes } from '../constants/NavigationRoutes';
import { AppDispatch, RootState } from '../redux/store';
import { retrieveTeams } from '../redux/slices/teamSlice';
import { retrievePlayers } from '../redux/slices/playerSlice';
import { clearLiveDraft, loadLiveDraft, saveLiveDraft } from '../scoring/draftStorage';
import { LiveDraft, OurRole, reduceLiveScore } from '../scoring/liveScore';

const LiveScoreSetup = ({ navigation }) => {
  const focused = useIsFocused();
  const dispatch = useDispatch<AppDispatch>();
  const teams = useSelector((state: RootState) => state.team.teams);
  const [draft, setDraft] = useState<LiveDraft | null>(null);
  const [title, setTitle] = useState('');
  const [oppositeTeamId, setOppositeTeamId] = useState<number | null>(null);
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [ballsPerOver, setBallsPerOver] = useState('6');
  const [firstRole, setFirstRole] = useState<OurRole | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  useEffect(() => {
    if (!focused) return;
    dispatch(retrieveTeams());
    dispatch(retrievePlayers());
    loadLiveDraft().then(setDraft);
  }, [focused]);

  const startScoring = async () => {
    const deliveries = Number(ballsPerOver);
    const nextErrors: Record<string, string> = {};
    if (!title.trim()) nextErrors.title = 'Title is required.';
    if (!oppositeTeamId) nextErrors.oppositeTeamId = 'Opposite team is required.';
    if (!date) nextErrors.date = 'Date is required.';
    if (!location.trim()) nextErrors.location = 'Location is required.';
    if (!Number.isInteger(deliveries) || deliveries < 1 || deliveries > 10) {
      nextErrors.ballsPerOver = 'Balls in an over should be from 1 to 10.';
    }
    if (!firstRole) nextErrors.firstRole = 'Choose bat or field.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length || !firstRole || !oppositeTeamId) return;

    const team = teams.find((item) => Number(item.id) === oppositeTeamId);
    const nextDraft: LiveDraft = {
      version: 1,
      title: title.trim(),
      oppositeTeamId,
      oppositeTeamName: team?.name || 'Opponent',
      date,
      location: location.trim(),
      numberOfDeliveriesPerOver: deliveries,
      firstRole,
      events: [],
    };
    await saveLiveDraft(nextDraft);
    navigation.navigate(NavigationRoutes.LIVE_SCORE);
  };

  const discardDraft = async () => {
    await clearLiveDraft();
    setDraft(null);
    setConfirmDiscard(false);
  };

  if (draft) {
    const score = reduceLiveScore(draft);
    const innings = score.matchEnded ? null : score.current;
    return (
      <View style={styles.container}>
        <SectionTitle title="Live draft" />
        <View style={styles.resumeCard}>
          <Text style={styles.resumeTitle}>{draft.title}</Text>
          <Text style={styles.resumeDetail}>Vs {draft.oppositeTeamName}</Text>
          <Text style={styles.resumeDetail}>
            {draft.date} · {draft.location}
          </Text>
          {innings && (
            <Text style={styles.resumeScore}>
              {innings.role === 'bat' ? 'We are batting' : 'We are bowling'}{' '}
              {innings.runs}-{innings.wickets} ({innings.oversLabel})
            </Text>
          )}
          {score.matchEnded && (
            <Text style={styles.resumeScore}>Ready to save the result</Text>
          )}
        </View>
        <Button
          length="long"
          text="Resume scoring"
          style="filled"
          color={Colors.DEEP_TEAL}
          onPress={() => navigation.navigate(NavigationRoutes.LIVE_SCORE)}
        />
        <Button
          length="long"
          text="Discard draft"
          style="outlined"
          color={Colors.DEEP_ORANGE}
          onPress={() => setConfirmDiscard(true)}
        />
        <ConfirmBox
          visible={confirmDiscard}
          title="Discard this live match? The ball-by-ball draft will be removed from this phone."
          ok={{ text: 'Discard', onPress: discardDraft }}
          cancel={{ text: 'Keep', onPress: () => setConfirmDiscard(false) }}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <SectionTitle title="Match" marginTop={10} />
      <TextInput
        length="long"
        placeholder="Title"
        value={title}
        error={errors.title}
        onChangeText={setTitle}
      />
      <OppositeTeamPicker
        placeholder="Opposite team"
        value={oppositeTeamId}
        error={errors.oppositeTeamId}
        onChange={(value) => setOppositeTeamId(Number(value))}
      />
      <DatePicker
        placeholder="Date"
        value={date}
        error={errors.date}
        onChange={setDate}
      />
      <TextInput
        length="long"
        placeholder="Location"
        value={location}
        error={errors.location}
        onChangeText={setLocation}
      />
      <TextInput
        length="long"
        placeholder="Balls in an over"
        value={ballsPerOver}
        keyboardType="number-pad"
        error={errors.ballsPerOver}
        onChangeText={setBallsPerOver}
      />
      <SectionTitle title="We start by" />
      <View style={styles.roleRow}>
        <RoleChoice
          label="Batting"
          selected={firstRole === 'bat'}
          onPress={() => setFirstRole('bat')}
        />
        <RoleChoice
          label="Fielding"
          selected={firstRole === 'field'}
          onPress={() => setFirstRole('field')}
        />
      </View>
      {!!errors.firstRole && <Text style={styles.error}>{errors.firstRole}</Text>}
      <Text style={styles.note}>
        The other team's total stays on this phone. Saving the match keeps our
        batters, bowlers, and fielders.
      </Text>
      <Button
        length="long"
        text="Start scoring"
        style="filled"
        color={Colors.DEEP_TEAL}
        onPress={startScoring}
      />
    </ScrollView>
  );
};

const RoleChoice = ({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[styles.roleChoice, selected && styles.roleChoiceSelected]}
    onPress={onPress}
    activeOpacity={0.7}>
    <Text style={[styles.roleText, selected && styles.roleTextSelected]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  resumeCard: {
    width: '94%',
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.DEEP_TEAL,
    padding: 16,
    marginBottom: 16,
  },
  resumeTitle: {
    fontFamily: 'Anybody-Regular',
    fontSize: 22,
    color: Colors.DEEP_TEAL,
    fontWeight: 'bold',
  },
  resumeDetail: {
    fontFamily: 'Anybody-Regular',
    fontSize: 16,
    color: Colors.DEEP_TEAL,
    marginTop: 4,
  },
  resumeScore: {
    fontFamily: 'Anybody-Regular',
    fontSize: 18,
    color: Colors.DARK_TEAL,
    marginTop: 10,
    fontWeight: 'bold',
  },
  roleRow: {
    width: '94%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  roleChoice: {
    width: '48%',
    height: 52,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.DEEP_TEAL,
    backgroundColor: Colors.OFF_WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleChoiceSelected: {
    backgroundColor: Colors.DEEP_TEAL,
  },
  roleText: {
    fontFamily: 'Anybody-Regular',
    fontSize: 18,
    color: Colors.DEEP_TEAL,
  },
  roleTextSelected: {
    color: Colors.OFF_WHITE,
  },
  note: {
    width: '94%',
    fontFamily: 'Anybody-Regular',
    fontSize: 14,
    color: Colors.DARK_TEAL,
    marginBottom: 16,
  },
  error: {
    width: '94%',
    fontFamily: 'Anybody-Regular',
    fontSize: 15,
    color: Colors.DEEP_ORANGE,
    marginBottom: 8,
  },
});

export default LiveScoreSetup;
