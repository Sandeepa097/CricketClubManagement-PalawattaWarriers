import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import SectionTitle from '../components/base/SectionTitle';
import TextInput from '../components/base/TextInput';
import Button from '../components/base/Button';
import DatePicker from '../components/DatePicker';
import OppositeTeamPicker from '../components/OppositeTeamPicker';
import PlayersPicker from '../components/PlayersPicker';
import ConfirmBox from '../components/base/ConfirmBox';
import { Colors } from '../constants/Colors';
import { NavigationRoutes } from '../constants/NavigationRoutes';
import { AppDispatch, RootState } from '../redux/store';
import { retrieveTeams } from '../redux/slices/teamSlice';
import { retrievePlayers } from '../redux/slices/playerSlice';
import { clearLiveDraft, loadLiveDraft, saveLiveDraft } from '../scoring/draftStorage';
import {
  LiveDraft,
  SideRole,
  TeamSide,
  battingSideFor,
  isPplDraft,
  reduceLiveScore,
  sideTitle,
} from '../scoring/liveScore';

const LiveScoreSetup = ({ navigation }) => {
  const focused = useIsFocused();
  const dispatch = useDispatch<AppDispatch>();
  const teams = useSelector((state: RootState) => state.team.teams);
  const players = useSelector((state: RootState) => state.player.players);
  const [draft, setDraft] = useState<LiveDraft | null>(null);
  const [matchKind, setMatchKind] = useState<'outdoor' | 'ppl'>('outdoor');
  const [title, setTitle] = useState('');
  const [oppositeTeamId, setOppositeTeamId] = useState<number | null>(null);
  const [pplGroupTitle, setPplGroupTitle] = useState('');
  const [teamATitle, setTeamATitle] = useState('');
  const [teamBTitle, setTeamBTitle] = useState('');
  const [teamAPlayerIds, setTeamAPlayerIds] = useState<Array<number | string>>([]);
  const [teamBPlayerIds, setTeamBPlayerIds] = useState<Array<number | string>>([]);
  const [battingFirst, setBattingFirst] = useState<TeamSide | null>(null);
  const [date, setDate] = useState(new Date().toDateString());
  const [location, setLocation] = useState('');
  const [ballsPerOver, setBallsPerOver] = useState('6');
  const [firstRole, setFirstRole] = useState<SideRole | null>(null);
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
    if (!date) nextErrors.date = 'Date is required.';
    if (!location.trim()) nextErrors.location = 'Location is required.';
    if (!Number.isInteger(deliveries) || deliveries < 1 || deliveries > 10) {
      nextErrors.ballsPerOver = 'Balls in an over should be from 1 to 10.';
    }
    if (matchKind === 'outdoor') {
      if (!title.trim()) nextErrors.title = 'Title is required.';
      if (!oppositeTeamId) nextErrors.oppositeTeamId = 'Opposite team is required.';
      if (!firstRole) nextErrors.firstRole = 'Choose bat or field.';
    } else {
      if (!teamATitle.trim()) nextErrors.teamATitle = 'Team A name is required.';
      if (!teamBTitle.trim()) nextErrors.teamBTitle = 'Team B name is required.';
      if (teamAPlayerIds.length < 2) {
        nextErrors.teamAPlayerIds = 'Team A needs at least two players.';
      }
      if (teamBPlayerIds.length < 2) {
        nextErrors.teamBPlayerIds = 'Team B needs at least two players.';
      }
      if (!battingFirst) nextErrors.battingFirst = 'Choose which team bats first.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const team = teams.find((item) => Number(item.id) === oppositeTeamId);
    const nextDraft: LiveDraft =
      matchKind === 'ppl'
        ? {
            version: 1,
            kind: 'ppl',
            pplGroupTitle: pplGroupTitle.trim(),
            teamATitle: teamATitle.trim(),
            teamBTitle: teamBTitle.trim(),
            teamAPlayerIds,
            teamBPlayerIds,
            battingFirst: battingFirst as TeamSide,
            date,
            location: location.trim(),
            numberOfDeliveriesPerOver: deliveries,
            events: [],
          }
        : {
            version: 1,
            kind: 'outdoor',
            title: title.trim(),
            oppositeTeamId: oppositeTeamId as number,
            oppositeTeamName: team?.name || 'Opponent',
            date,
            location: location.trim(),
            numberOfDeliveriesPerOver: deliveries,
            firstRole: firstRole as SideRole,
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
    const ppl = isPplDraft(draft);
    const resumeTitle = ppl
      ? `${draft.teamATitle} vs ${draft.teamBTitle}`
      : draft.title;
    const resumeDetail = ppl
      ? draft.pplGroupTitle || 'PPL'
      : `Vs ${draft.oppositeTeamName}`;
    const resumeScore = !innings
      ? ''
      : ppl
        ? `${sideTitle(draft, battingSideFor(draft, score.currentInningsIndex))} batting ${innings.runs}-${innings.wickets} (${innings.oversLabel})`
        : `${innings.role === 'bat' ? 'We are batting' : 'We are bowling'} ${innings.runs}-${innings.wickets} (${innings.oversLabel})`;
    return (
      <View style={styles.container}>
        <SectionTitle title="Live draft" />
        <View style={styles.resumeCard}>
          <Text style={styles.resumeTitle}>{resumeTitle}</Text>
          <Text style={styles.resumeDetail}>{resumeDetail}</Text>
          <Text style={styles.resumeDetail}>
            {draft.date} · {draft.location}
          </Text>
          {innings && <Text style={styles.resumeScore}>{resumeScore}</Text>}
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
      <View style={styles.roleRow}>
        <RoleChoice
          label="Outdoor"
          selected={matchKind === 'outdoor'}
          onPress={() => setMatchKind('outdoor')}
        />
        <RoleChoice
          label="PPL"
          selected={matchKind === 'ppl'}
          onPress={() => setMatchKind('ppl')}
        />
      </View>
      {matchKind === 'outdoor' ? (
        <>
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
        </>
      ) : (
        <>
          <TextInput
            length="long"
            placeholder="PPL title"
            value={pplGroupTitle}
            onChangeText={setPplGroupTitle}
          />
          <TextInput
            length="long"
            placeholder="Team A name"
            value={teamATitle}
            error={errors.teamATitle}
            onChangeText={setTeamATitle}
          />
          <TextInput
            length="long"
            placeholder="Team B name"
            value={teamBTitle}
            error={errors.teamBTitle}
            onChangeText={setTeamBTitle}
          />
          <PlayersPicker
            placeholder={`Players of ${teamATitle.trim() || 'Team A'}`}
            players={players}
            emptyMessage="No players found."
            selected={teamAPlayerIds}
            error={errors.teamAPlayerIds}
            onChangeSelection={(ids) => {
              const next = ids as Array<number | string>;
              setTeamAPlayerIds(next);
              setTeamBPlayerIds((current) =>
                current.filter(
                  (id) => !next.some((picked) => Number(picked) === Number(id)),
                ),
              );
            }}
          />
          <PlayersPicker
            placeholder={`Players of ${teamBTitle.trim() || 'Team B'}`}
            players={players.filter(
              (player) =>
                !teamAPlayerIds.some((id) => Number(id) === Number(player.id)),
            )}
            emptyMessage="No available players found."
            selected={teamBPlayerIds}
            error={errors.teamBPlayerIds}
            onChangeSelection={(ids) =>
              setTeamBPlayerIds(ids as Array<number | string>)
            }
          />
        </>
      )}
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
      {matchKind === 'outdoor' ? (
        <>
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
          {!!errors.firstRole && (
            <Text style={styles.error}>{errors.firstRole}</Text>
          )}
        </>
      ) : (
        <>
          <SectionTitle title="Bats first" />
          <View style={styles.roleRow}>
            <RoleChoice
              label={teamATitle.trim() || 'Team A'}
              selected={battingFirst === 'teamA'}
              onPress={() => setBattingFirst('teamA')}
            />
            <RoleChoice
              label={teamBTitle.trim() || 'Team B'}
              selected={battingFirst === 'teamB'}
              onPress={() => setBattingFirst('teamB')}
            />
          </View>
          {!!errors.battingFirst && (
            <Text style={styles.error}>{errors.battingFirst}</Text>
          )}
        </>
      )}
      <View style={{ marginTop: 40 }}>
        <Button
          length="long"
          text="Start scoring"
          style="filled"
          color={Colors.DEEP_TEAL}
          onPress={startScoring}
        />
        <Button
          length="long"
          style="outlined"
          color={Colors.DEEP_TEAL}
          text="Cancel"
          onPress={() => {
            navigation.goBack();
          }}
        />
      </View>
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
