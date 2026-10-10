import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput as NativeTextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/base/Button';
import ConfirmBox from '../components/base/ConfirmBox';
import PlayersSelectionModal from '../components/PlayersSelectionModal';
import { Colors } from '../constants/Colors';
import { NavigationRoutes } from '../constants/NavigationRoutes';
import { AppDispatch, RootState } from '../redux/store';
import { retrievePlayers } from '../redux/slices/playerSlice';
import { loadLiveDraft, saveLiveDraft } from '../scoring/draftStorage';
import {
  BallEvent,
  BatterFigure,
  InningsState,
  ExtraKind,
  LiveDraft,
  MatchResult,
  ScoringEvent,
  WicketKind,
  canScoreBall,
  formatOversLabel,
  reduceLiveScore,
  suggestResult,
  toMatchPayload,
  wicketKindLabel,
  wicketKindsFor,
} from '../scoring/liveScore';

type PickerMode =
  | 'striker'
  | 'nonStriker'
  | 'next'
  | 'retireNext'
  | 'bowler'
  | 'fielder';

const extraOptions: { id: ExtraKind; label: string }[] = [
  { id: 'wide', label: 'Wide' },
  { id: 'noBall', label: 'No ball' },
  { id: 'bye', label: 'Byes' },
  { id: 'legBye', label: 'Leg byes' },
];

const LiveScore = ({ navigation }) => {
  const focused = useIsFocused();
  const dispatch = useDispatch<AppDispatch>();
  const players = useSelector((state: RootState) => state.player.players);
  const [draft, setDraft] = useState<LiveDraft | null>(null);
  const [extra, setExtra] = useState<ExtraKind | null>(null);
  const [wicket, setWicket] = useState(false);
  const [picker, setPicker] = useState<PickerMode | null>(null);
  const [pendingStriker, setPendingStriker] = useState<number | null>(null);
  const [pendingBall, setPendingBall] = useState<BallEvent | null>(null);
  const [pendingKind, setPendingKind] = useState<WicketKind | null>(null);
  const [wicketOpen, setWicketOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [customRuns, setCustomRuns] = useState('');
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [result, setResult] = useState<MatchResult>('draw');
  const draftRef = useRef<LiveDraft | null>(null);
  const chain = useRef(Promise.resolve());
  const promptedKey = useRef('');

  useEffect(() => {
    if (!focused) return;
    dispatch(retrievePlayers());
    loadLiveDraft().then((loaded) => {
      if (!loaded) {
        navigation.goBack();
        return;
      }
      draftRef.current = loaded;
      setDraft(loaded);
      if (reduceLiveScore(loaded).matchEnded) setResult(suggestResult(loaded));
    });
  }, [focused]);

  const view = draft ? reduceLiveScore(draft) : null;

  useEffect(() => {
    if (!draft || !view || view.matchEnded || picker || wicketOpen || customOpen) {
      return;
    }
    const key = [
      view.currentInningsIndex,
      view.current.role,
      view.current.strikerId ?? '',
      view.current.nonStrikerId ?? '',
      view.current.bowlerId ?? '',
      draft.events.length,
    ].join(':');
    if (promptedKey.current === key) return;
    promptedKey.current = key;
    if (view.current.role === 'bat' && view.current.strikerId == null) {
      setPicker('striker');
    } else if (view.current.role === 'field' && view.current.bowlerId == null) {
      setPicker('bowler');
    }
  }, [draft, view, picker, wicketOpen, customOpen]);

  const playerName = (id: number | null) => {
    if (id == null) return '';
    return players.find((player) => Number(player.id) === id)?.name || 'Player';
  };

  const commit = (event: ScoringEvent) => {
    chain.current = chain.current.then(async () => {
      const current = draftRef.current;
      if (!current) return;
      const next = { ...current, events: [...current.events, event] };
      draftRef.current = next;
      setDraft(next);
      const endedInnings = next.events.filter(
        (item) => item.type === 'endInnings',
      ).length;
      if (event.type === 'endInnings' && endedInnings === 2) {
        setResult(suggestResult(next));
      }
      await saveLiveDraft(next);
    });
  };

  const undo = () => {
    chain.current = chain.current.then(async () => {
      const current = draftRef.current;
      if (!current || current.events.length === 0) return;
      const next = { ...current, events: current.events.slice(0, -1) };
      draftRef.current = next;
      setDraft(next);
      setExtra(null);
      setWicket(false);
      setPendingBall(null);
      setPendingKind(null);
      await saveLiveDraft(next);
    });
  };

  const clearEntry = () => {
    setExtra(null);
    setWicket(false);
    setPendingBall(null);
    setPendingKind(null);
  };

  const scoreRuns = (runs: number) => {
    if (!view || !canScoreBall(view.current)) return;
    const entry: BallEvent = { type: 'ball', runs, extra, wicket };
    if (!wicket) {
      commit(entry);
      setExtra(null);
      return;
    }
    setPendingBall(entry);
    if (view.current.role === 'bat') setPicker('next');
    else setWicketOpen(true);
  };

  const chooseWicketKind = (kind: WicketKind) => {
    setWicketOpen(false);
    if (!pendingBall) return;
    if (kind === 'bowled') {
      commit({ ...pendingBall, wicketKind: kind });
      clearEntry();
      return;
    }
    setPendingKind(kind);
    setPicker('fielder');
  };

  const onPickPlayer = (id: string | number) => {
    const playerId = Number(id);
    if (!view) return;
    if (picker === 'striker') {
      setPendingStriker(playerId);
      setPicker('nonStriker');
      return;
    }
    if (picker === 'nonStriker' && pendingStriker != null) {
      setPicker(null);
      commit({
        type: 'openers',
        strikerId: pendingStriker,
        nonStrikerId: playerId,
      });
      setPendingStriker(null);
      return;
    }
    if (picker === 'bowler') {
      setPicker(null);
      commit({ type: 'bowler', bowlerId: playerId });
      return;
    }
    if (picker === 'next' && pendingBall) {
      setPicker(null);
      commit({ ...pendingBall, nextBatsmanId: playerId });
      clearEntry();
      return;
    }
    if (picker === 'retireNext' && view.current.strikerId != null) {
      setPicker(null);
      commit({
        type: 'retire',
        batsmanId: view.current.strikerId,
        nextBatsmanId: playerId,
      });
      return;
    }
    if (picker === 'fielder' && pendingBall && pendingKind) {
      setPicker(null);
      commit({
        ...pendingBall,
        wicketKind: pendingKind,
        fielderId: playerId,
      });
      clearEntry();
    }
  };

  const reviewMatch = () => {
    if (!draft) return;
    const payload = toMatchPayload(draft, result);
    const storedId = (id: number) =>
      players.find((player) => Number(player.id) === id)?.id ?? id;
    navigation.navigate(NavigationRoutes.CREATE_MATCH, {
      fromLiveScore: true,
      prefill: {
        ...payload,
        officialPlayers: payload.officialPlayers.map(storedId),
        battingStats: payload.battingStats.map((stat) => ({
          ...stat,
          id: storedId(stat.id),
        })),
        bowlingStats: payload.bowlingStats.map((stat) => ({
          ...stat,
          id: storedId(stat.id),
        })),
        fieldingStats: payload.fieldingStats.map((stat) => ({
          ...stat,
          id: storedId(stat.id),
        })),
      },
    });
  };

  if (!draft || !view) return <View style={styles.container} />;

  const innings = view.current;
  const battingInnings = view.innings.find((item) => item.role === 'bat');
  const bowlingInnings = view.innings.find((item) => item.role === 'field');
  const ready = canScoreBall(innings);
  const busyIds = new Set<number>();
  if (picker === 'nonStriker' && pendingStriker != null) {
    busyIds.add(pendingStriker);
  }
  if (picker === 'next' || picker === 'retireNext') {
    if (innings.strikerId != null) busyIds.add(innings.strikerId);
    if (innings.nonStrikerId != null) busyIds.add(innings.nonStrikerId);
    innings.batsmen.forEach((batter) => {
      if (batter.isOut || batter.retired) busyIds.add(batter.id);
    });
  }
  const selectablePlayers = players.filter(
    (player) => !busyIds.has(Number(player.id)),
  );
  const pickerTitle =
    picker === 'striker'
      ? 'Select the striker'
      : picker === 'nonStriker'
        ? 'Select the other batter'
        : picker === 'next'
          ? 'Select the next batter'
          : picker === 'retireNext'
            ? 'Select the batter who comes in'
            : picker === 'bowler'
              ? 'Select the bowler'
              : picker === 'fielder'
                ? 'Select the fielder'
                : '';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scoreboard}>
        <Text style={styles.opponent}>Vs {draft.oppositeTeamName}</Text>
        {view.matchEnded ? (
          <View>
            <Text style={styles.inningsLabel}>Match complete</Text>
            <ScoreLine
              label="Our score"
              value={`${battingInnings?.runs || 0}-${battingInnings?.wickets || 0} (${battingInnings?.oversLabel})`}
            />
            <ScoreLine
              label="Their score"
              value={`${bowlingInnings?.runs || 0}-${bowlingInnings?.wickets || 0} (${bowlingInnings?.oversLabel})`}
            />
            <Text style={styles.hint}>
              Review the figures on the match form before saving. Team totals
              stay on this screen.
            </Text>
            <View style={styles.resultRow}>
              {(['won', 'lost', 'draw'] as MatchResult[]).map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.resultButton,
                    result === item && styles.resultButtonOn,
                  ]}
                  onPress={() => setResult(item)}>
                  <Text
                    style={[
                      styles.resultText,
                      result === item && styles.resultTextOn,
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View>
            <Text style={styles.inningsLabel}>
              {view.currentInningsIndex === 0 ? '1st innings' : '2nd innings'}
              {' · '}
              {innings.role === 'bat' ? 'We are batting' : 'We are bowling'}
            </Text>
            {view.currentInningsIndex === 1 && (
              <Text style={styles.previous}>
                1st innings {view.innings[0].runs}-{view.innings[0].wickets} (
                {view.innings[0].oversLabel})
              </Text>
            )}
            <Text style={styles.score}>
              {innings.runs}-{innings.wickets}
              <Text style={styles.overs}> ({innings.oversLabel})</Text>
            </Text>
            <View style={styles.overRow}>
              {innings.thisOver.length === 0 ? (
                <Text style={styles.overEmpty}>This over</Text>
              ) : (
                innings.thisOver.map((token, index) => (
                  <View key={`${token}-${index}`} style={styles.chip}>
                    <Text style={styles.chipText}>{token}</Text>
                  </View>
                ))
              )}
            </View>
            {innings.role === 'bat' ? (
              <BattingScore innings={innings} playerName={playerName} />
            ) : (
              <View>
                {innings.bowlers.map((bowler) => (
                  <StatRow
                    key={bowler.id}
                    name={playerName(bowler.id)}
                    active={bowler.id === innings.bowlerId}
                    detail={`${bowler.wickets}-${bowler.conceded} (${formatOversLabel(
                      bowler.legalBalls,
                      draft.numberOfDeliveriesPerOver,
                    )})${bowler.maidens > 0 ? `  M ${bowler.maidens}` : ''}`}
                  />
                ))}
                <View style={styles.partnershipSection}>
                  <Text style={styles.sectionTitle}>Extras</Text>
                  <Text style={styles.extrasDetail}>
                    {innings.extras.total} · wd {innings.extras.wides} · nb{' '}
                    {innings.extras.noBalls} · b {innings.extras.byes} · lb{' '}
                    {innings.extras.legByes}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {view.matchEnded ? (
        <View style={styles.pad}>
          <Button
            length="long"
            text="Review match"
            style="filled"
            color={Colors.DEEP_TEAL}
            onPress={reviewMatch}
          />
          <PadButton
            label="Undo"
            onPress={undo}
            disabled={draft.events.length === 0}
          />
        </View>
      ) : (
        <View style={styles.pad}>
          {!ready && (
            <TouchableOpacity
              style={styles.prompt}
              onPress={() =>
                setPicker(
                  innings.role === 'bat'
                    ? pendingStriker == null
                      ? 'striker'
                      : 'nonStriker'
                    : 'bowler',
                )
              }>
              <Text style={styles.promptText}>
                {innings.role === 'bat'
                  ? 'Select the two batters'
                  : 'Select the bowler'}
              </Text>
            </TouchableOpacity>
          )}
          <View style={styles.row}>
            {extraOptions.map((option) => (
              <Toggle
                key={option.id}
                label={option.label}
                selected={extra === option.id}
                onPress={() =>
                  setExtra((current) =>
                    current === option.id ? null : option.id,
                  )
                }
              />
            ))}
            <Toggle
              label="Wicket"
              selected={wicket}
              onPress={() => setWicket((current) => !current)}
            />
          </View>
          <View style={styles.row}>
            <PadButton
              label="Undo"
              onPress={undo}
              disabled={draft.events.length === 0}
            />
            {innings.role === 'bat' ? (
              <PadButton
                label="Swap"
                onPress={() => commit({ type: 'swap' })}
                disabled={!ready}
              />
            ) : (
              <PadButton
                label="Bowler"
                onPress={() => setPicker('bowler')}
                disabled={false}
              />
            )}
            {innings.role === 'bat' && (
              <PadButton
                label="Retire"
                onPress={() => setPicker('retireNext')}
                disabled={!ready}
              />
            )}
          </View>
          <View style={styles.row}>
            {[0, 1, 2, 3].map((runs) => (
              <RunButton
                key={runs}
                runs={runs}
                disabled={!ready}
                onPress={scoreRuns}
              />
            ))}
          </View>
          <View style={styles.row}>
            {[4, 5, 6].map((runs) => (
              <RunButton
                key={runs}
                runs={runs}
                disabled={!ready}
                onPress={scoreRuns}
              />
            ))}
            <PadButton
              label="More"
              onPress={() => {
                setCustomRuns('');
                setCustomOpen(true);
              }}
              disabled={!ready}
            />
          </View>
          <TouchableOpacity
            style={styles.endInnings}
            onPress={() => setConfirmEnd(true)}
            activeOpacity={0.7}>
            <Text style={styles.endInningsText}>End innings</Text>
          </TouchableOpacity>
        </View>
      )}

      <PlayersSelectionModal
        isVisible={picker != null}
        players={selectablePlayers}
        selected={[]}
        title={pickerTitle}
        emptyMessage="No players found"
        onPressItem={onPickPlayer}
        onRequestClose={() => {
          setPicker(null);
          setPendingBall(null);
          setPendingKind(null);
        }}
      />
      <Modal
        isVisible={wicketOpen}
        onBackdropPress={() => setWicketOpen(false)}>
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>How was the batter out?</Text>
          {wicketKindsFor(pendingBall?.extra || null).map((kind) => (
            <TouchableOpacity
              key={kind}
              style={styles.sheetOption}
              onPress={() => chooseWicketKind(kind)}>
              <Text style={styles.sheetOptionText}>{wicketKindLabel[kind]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
      <Modal isVisible={customOpen} onBackdropPress={() => setCustomOpen(false)}>
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>Runs</Text>
          <NativeTextInput
            style={styles.customInput}
            keyboardType="number-pad"
            value={customRuns}
            onChangeText={setCustomRuns}
            placeholder="0"
            placeholderTextColor={Colors.MEDIUM_TEAL}
          />
          <TouchableOpacity
            style={styles.sheetOption}
            onPress={() => {
              const runs = Number(customRuns);
              if (customRuns.trim() === '' || !Number.isInteger(runs) || runs < 0) {
                return;
              }
              setCustomOpen(false);
              scoreRuns(runs);
            }}>
            <Text style={styles.sheetOptionText}>Add ball</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <ConfirmBox
        visible={confirmEnd}
        title={
          view.currentInningsIndex === 0
            ? 'End this innings?'
            : 'End the match and choose the result?'
        }
        ok={{
          text: 'End',
          onPress: () => {
            setConfirmEnd(false);
            commit({ type: 'endInnings' });
          },
        }}
        cancel={{ text: 'Keep scoring', onPress: () => setConfirmEnd(false) }}
      />
    </View>
  );
};

const batterStatus = (batter: BatterFigure) => {
  if (batter.isOut) return 'out';
  if (batter.retired) return 'retired';
  return '';
};

const StatRow = ({
  name,
  detail,
  active,
  meta,
}: {
  name: string;
  detail: string;
  active?: boolean;
  meta?: string;
}) => (
  <View style={styles.statRow}>
    <View style={[styles.statMark, active && styles.statMarkActive]} />
    <Text
      style={[styles.statName, active && styles.statNameActive]}
      numberOfLines={1}>
      {name}
      {active ? '*' : ''}
    </Text>
    {!!meta && <Text style={styles.statMeta}>{meta}</Text>}
    <Text style={[styles.statDetail, active && styles.statDetailActive]}>
      {detail}
    </Text>
  </View>
);

const BattingScore = ({
  innings,
  playerName,
}: {
  innings: InningsState;
  playerName: (id: number | null) => string;
}) => {
  const creaseIds = new Set(
    [innings.strikerId, innings.nonStrikerId].filter(
      (id): id is number => id != null,
    ),
  );
  const ordered = innings.creaseOrder.filter((id) => creaseIds.has(id));
  const atCrease = ordered.length
    ? ordered
    : [...creaseIds];
  const creaseBatters = atCrease
    .map((id) => innings.batsmen.find((batter) => batter.id === id))
    .filter((batter): batter is BatterFigure => !!batter);
  const earlierBatters = innings.batsmen.filter(
    (batter) => !atCrease.includes(batter.id),
  );
  const currentPartnership =
    innings.partnerships[innings.partnerships.length - 1];
  const earlierPartnerships = innings.partnerships.slice(0, -1);

  return (
    <View>
      {creaseBatters.map((batter) => (
        <StatRow
          key={batter.id}
          name={playerName(batter.id)}
          active={batter.id === innings.strikerId}
          detail={`${batter.runs} (${batter.balls})`}
        />
      ))}
      {currentPartnership && (
        <Text style={styles.noteLine}>
          Partnership {currentPartnership.runs} ({currentPartnership.balls})
        </Text>
      )}
      {(earlierBatters.length > 0 || earlierPartnerships.length > 0) && (
        <View style={styles.hairline} />
      )}
      {earlierBatters.map((batter) => (
        <StatRow
          key={batter.id}
          name={playerName(batter.id)}
          meta={batterStatus(batter)}
          detail={`${batter.runs} (${batter.balls})`}
        />
      ))}
      {earlierPartnerships.length > 0 && (
        <View style={styles.partnershipSection}>
          <Text style={styles.sectionTitle}>Partnerships</Text>
          {earlierPartnerships.map((partnership, index) => (
            <StatRow
              key={`${partnership.idA}-${partnership.idB}-${index}`}
              name={`${playerName(partnership.idA)} & ${playerName(partnership.idB)}`}
              detail={`${partnership.runs} (${partnership.balls})`}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const ScoreLine = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.scoreLine}>
    <Text style={styles.scoreLineLabel}>{label}</Text>
    <Text style={styles.scoreLineValue}>{value}</Text>
  </View>
);

const Toggle = ({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[styles.toggle, selected && styles.toggleOn]}
    onPress={onPress}
    activeOpacity={0.7}>
    <Text style={[styles.toggleText, selected && styles.toggleTextOn]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const PadButton = ({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled: boolean;
}) => (
  <TouchableOpacity
    style={[styles.padButton, disabled && styles.disabled]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.7}>
    <Text style={styles.padText}>{label}</Text>
  </TouchableOpacity>
);

const RunButton = ({
  runs,
  disabled,
  onPress,
}: {
  runs: number;
  disabled: boolean;
  onPress: (runs: number) => void;
}) => (
  <TouchableOpacity
    style={[styles.runButton, disabled && styles.disabled]}
    onPress={() => onPress(runs)}
    disabled={disabled}
    activeOpacity={0.7}>
    <Text style={styles.runText}>{runs}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.OFF_WHITE,
  },
  scoreboard: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  opponent: {
    fontFamily: 'Anybody-Regular',
    fontSize: 16,
    color: Colors.DARK_TEAL,
  },
  inningsLabel: {
    fontFamily: 'Anybody-Regular',
    fontSize: 18,
    color: Colors.DEEP_TEAL,
    marginTop: 4,
  },
  previous: {
    fontFamily: 'Anybody-Regular',
    fontSize: 14,
    color: Colors.MEDIUM_TEAL,
    marginTop: 4,
  },
  score: {
    fontFamily: 'Anybody-Regular',
    fontSize: 44,
    fontWeight: 'bold',
    color: Colors.DEEP_TEAL,
    marginTop: 2,
    marginBottom: 2,
  },
  overs: {
    fontSize: 22,
    fontWeight: 'normal',
    color: Colors.DARK_TEAL,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 28,
  },
  statMark: {
    width: 3,
    height: 16,
    borderRadius: 2,
    marginRight: 8,
    backgroundColor: 'transparent',
  },
  statMarkActive: {
    backgroundColor: Colors.DEEP_ORANGE,
  },
  statName: {
    flex: 1,
    fontFamily: 'Anybody-Regular',
    fontSize: 16,
    color: Colors.DEEP_TEAL,
  },
  statNameActive: {
    fontWeight: 'bold',
  },
  statMeta: {
    fontFamily: 'Anybody-Regular',
    fontSize: 12,
    color: Colors.MEDIUM_TEAL,
    marginRight: 8,
  },
  statDetail: {
    fontFamily: 'Anybody-Regular',
    fontSize: 16,
    color: Colors.DEEP_TEAL,
  },
  statDetailActive: {
    fontWeight: 'bold',
  },
  noteLine: {
    fontFamily: 'Anybody-Regular',
    fontSize: 13,
    color: Colors.MEDIUM_TEAL,
    marginLeft: 11,
    marginTop: 2,
    marginBottom: 4,
  },
  hairline: {
    height: 1,
    backgroundColor: Colors.LIGHT_SHADOW,
    marginVertical: 8,
  },
  partnershipSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontFamily: 'Anybody-Regular',
    fontSize: 13,
    color: Colors.MEDIUM_TEAL,
    marginBottom: 4,
  },
  extrasDetail: {
    fontFamily: 'Anybody-Regular',
    fontSize: 16,
    color: Colors.DEEP_TEAL,
  },
  endInnings: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.DEEP_ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginBottom: 4,
    backgroundColor: Colors.OFF_WHITE,
  },
  endInningsText: {
    fontFamily: 'Anybody-Regular',
    fontSize: 16,
    color: Colors.DEEP_ORANGE,
  },
  overRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 8,
    minHeight: 28,
  },
  overEmpty: {
    fontFamily: 'Anybody-Regular',
    fontSize: 14,
    color: Colors.MEDIUM_TEAL,
  },
  chip: {
    backgroundColor: Colors.WHITE,
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 4,
  },
  chipText: {
    fontFamily: 'Anybody-Regular',
    fontSize: 13,
    color: Colors.DEEP_TEAL,
  },
  hint: {
    fontFamily: 'Anybody-Regular',
    fontSize: 14,
    color: Colors.DARK_TEAL,
    marginVertical: 10,
  },
  scoreLine: {
    marginTop: 12,
  },
  scoreLineLabel: {
    fontFamily: 'Anybody-Regular',
    fontSize: 14,
    color: Colors.MEDIUM_TEAL,
  },
  scoreLineValue: {
    fontFamily: 'Anybody-Regular',
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.DEEP_TEAL,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  resultButton: {
    width: '31%',
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.DEEP_TEAL,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.WHITE,
  },
  resultButtonOn: {
    backgroundColor: Colors.DEEP_TEAL,
  },
  resultText: {
    fontFamily: 'Anybody-Regular',
    fontSize: 16,
    color: Colors.DEEP_TEAL,
    textTransform: 'capitalize',
  },
  resultTextOn: {
    color: Colors.OFF_WHITE,
  },
  pad: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: Colors.WHITE,
    borderTopWidth: 1,
    borderTopColor: Colors.LIGHT_SHADOW,
  },
  prompt: {
    backgroundColor: Colors.DEEP_TEAL,
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 8,
    alignItems: 'center',
  },
  promptText: {
    fontFamily: 'Anybody-Regular',
    color: Colors.OFF_WHITE,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  toggle: {
    flex: 1,
    minHeight: 36,
    marginHorizontal: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.DEEP_TEAL,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    backgroundColor: Colors.OFF_WHITE,
  },
  toggleOn: {
    backgroundColor: Colors.DEEP_ORANGE,
    borderColor: Colors.DEEP_ORANGE,
  },
  toggleText: {
    fontFamily: 'Anybody-Regular',
    fontSize: 11,
    color: Colors.DEEP_TEAL,
    textAlign: 'center',
  },
  toggleTextOn: {
    color: Colors.OFF_WHITE,
  },
  padButton: {
    flex: 1,
    height: 44,
    marginHorizontal: 2,
    borderRadius: 12,
    backgroundColor: Colors.DARK_TEAL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  padSpacer: {
    flex: 1,
    marginHorizontal: 2,
  },
  padText: {
    fontFamily: 'Anybody-Regular',
    fontSize: 14,
    color: Colors.OFF_WHITE,
  },
  runButton: {
    flex: 1,
    height: 52,
    marginHorizontal: 2,
    borderRadius: 26,
    backgroundColor: Colors.DEEP_TEAL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  runText: {
    fontFamily: 'Anybody-Regular',
    fontSize: 22,
    color: Colors.OFF_WHITE,
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.35,
  },
  sheet: {
    backgroundColor: Colors.OFF_WHITE,
    borderRadius: 15,
    padding: 16,
  },
  sheetTitle: {
    fontFamily: 'Anybody-Regular',
    fontSize: 18,
    color: Colors.DEEP_TEAL,
    marginBottom: 10,
  },
  sheetOption: {
    backgroundColor: Colors.DEEP_TEAL,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 8,
  },
  sheetOptionText: {
    fontFamily: 'Anybody-Regular',
    fontSize: 16,
    color: Colors.OFF_WHITE,
    textAlign: 'center',
  },
  customInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.DEEP_TEAL,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 14,
    fontFamily: 'Anybody-Regular',
    fontSize: 20,
    color: Colors.DEEP_TEAL,
  },
});

export default LiveScore;
