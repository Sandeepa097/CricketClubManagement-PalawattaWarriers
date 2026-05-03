import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, ToastAndroid } from 'react-native';
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
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import {
  createMatch,
  deleteMatch,
  updateMatch,
} from '../redux/slices/matchSlice';
import { setEditing } from '../redux/slices/statusSlice';
import { NavigationRoutes } from '../constants/NavigationRoutes';
import { useIsFocused } from '@react-navigation/native';
import { retrieveTeams } from '../redux/slices/teamSlice';
import { retrievePlayers } from '../redux/slices/playerSlice';

const splitStatsByPlayerIds = (stats: any[] = [], playerIds: number[]) =>
  stats
    .filter((stat: any) => playerIds.includes(stat.playerId))
    .map((stat: any) => ({
      id: stat.playerId,
      values: {
        score: stat.score,
        balls: stat.balls,
        sixes: stat.sixes,
        fours: stat.fours,
        isOut: stat.isOut,
        wickets: stat.wickets,
        overs: stat.overs,
        conceded: stat.conceded,
        maidens: stat.maidens,
        catches: stat.catches,
        stumps: stat.stumps,
        directHits: stat.directHits,
        indirectHits: stat.indirectHits,
      },
    }));

const mapBattingStats = (stats: any[] = []) =>
  stats.map((stat: any) => ({
    id: stat.playerId,
    values: {
      score: stat.score,
      balls: stat.balls,
      sixes: stat.sixes,
      fours: stat.fours,
      isOut: stat.isOut,
    },
  }));

const mapBowlingStats = (stats: any[] = []) =>
  stats.map((stat: any) => ({
    id: stat.playerId,
    values: {
      wickets: stat.wickets,
      overs: stat.overs,
      conceded: stat.conceded,
      maidens: stat.maidens,
    },
  }));

const mapFieldingStats = (stats: any[] = []) =>
  stats.map((stat: any) => ({
    id: stat.playerId,
    values: {
      catches: stat.catches,
      stumps: stat.stumps,
      directHits: stat.directHits,
      indirectHits: stat.indirectHits,
    },
  }));

const CreateMatch = ({ route, navigation }) => {
  const focused = useIsFocused();
  const dispatch = useDispatch<AppDispatch>();
  const emptyPlayersMessage = 'No players found in the team';
  const players = useSelector((state: RootState) => state.player.players);
  const editMatch = route.params;

  const isEditingPPLPair =
    !!editMatch?.isPPLPair &&
    !!editMatch?.teamAMatch &&
    !!editMatch?.teamBMatch;
  const teamAEditMatch = isEditingPPLPair ? editMatch.teamAMatch : editMatch;
  const teamBEditMatch = isEditingPPLPair ? editMatch.teamBMatch : null;

  const defaultTeamAPlayers =
    teamAEditMatch?.officialPlayers?.map((player: any) => player.id) || [];
  const defaultTeamBPlayers: number[] =
    teamBEditMatch?.officialPlayers?.map((player: any) => player.id) || [];

  useEffect(() => {
    if (focused) {
      dispatch(retrieveTeams());
      dispatch(retrievePlayers());
    }
  }, [focused]);

  const yupPositiveIntegerSchema = (filedName: string) => {
    const message = `${filedName} should be a positive integer.`;
    return Yup.number().typeError(message).min(0, message).integer(message);
  };

  const matchValidationSchema = Yup.object().shape({
    isPPL: Yup.boolean(),
    title: Yup.string()
      .max(255, 'Title is too long.')
      .when('isPPL', (isPPL, schema) => {
        if (isPPL[0]) return schema.notRequired();
        return schema.required('Title is required.');
      }),
    oppositeTeamId: Yup.number().when('isPPL', (isPPL, schema) => {
      if (!isPPL[0]) return schema.required('Opposite Team is required.');
      return schema.notRequired();
    }),
    teamATitle: Yup.string().when('isPPL', (isPPL, schema) => {
      if (!isPPL[0]) return schema.notRequired();
      return schema
        .max(255, 'Team A title is too long.')
        .required('Team A title is required.');
    }),
    teamBTitle: Yup.string().when('isPPL', (isPPL, schema) => {
      if (!isPPL[0]) return schema.notRequired();
      return schema
        .max(255, 'Team B title is too long.')
        .required('Team B title is required.');
    }),
    pplGroupTitle: Yup.string().nullable().max(255, 'PPL title is too long.'),
    date: Yup.string().required('Date is required.'),
    location: Yup.string()
      .max(255, 'Location is too long.')
      .required('Location is required.'),
    result: Yup.string().when('isPPL', (isPPL, schema) => {
      if (!isPPL[0]) return schema.required('Result is required.');
      return schema.notRequired();
    }),
    numberOfDeliveriesPerOver: Yup.number()
      .integer('Number of deliveries per over should be an integer.')
      .min(
        1,
        'Number of deliveries per over must be greater than or equal to 1.',
      )
      .max(
        10,
        'Number of deliveries per over must be less than or equal to 10.',
      )
      .required('Number of deliveries per over is required.'),
    officialPlayers: Yup.array()
      .of(Yup.number())
      .when('isPPL', (isPPL, schema) => {
        if (isPPL[0]) return schema.notRequired();
        return schema.min(1, 'Team should have at least one player.');
      }),
    teamAPlayers: Yup.array()
      .of(Yup.number())
      .when('isPPL', (isPPL, schema) => {
        if (!isPPL[0]) return schema.notRequired();
        return schema.min(1, 'Team A should have at least one player.');
      }),
    teamBPlayers: Yup.array()
      .of(Yup.number())
      .when('isPPL', (isPPL, schema) => {
        if (!isPPL[0]) return schema.notRequired();
        return schema
          .min(1, 'Team B should have at least one player.')
          .test(
            'no-duplicates-between-teams',
            'A player cannot be selected in both teams.',
            function (teamBPlayers) {
              const teamAPlayers = this.parent.teamAPlayers || [];
              return !(teamBPlayers || []).some((id: number) =>
                teamAPlayers.includes(id),
              );
            },
          );
      }),
    battingStats: Yup.array().of(
      Yup.object().shape({
        values: Yup.object().shape({
          balls: yupPositiveIntegerSchema('Number of balls'),
          score: yupPositiveIntegerSchema('Score'),
          fours: yupPositiveIntegerSchema('Number of fours'),
          sixes: yupPositiveIntegerSchema('Number of sixes'),
          isOut: Yup.boolean(),
        }),
      }),
    ),
    bowlingStats: Yup.array().of(
      Yup.object().shape({
        values: Yup.object().shape({
          wickets: yupPositiveIntegerSchema('Number of wickets'),
          overs: Yup.number()
            .typeError('Number of overs should be a positive number.')
            .positive('Number of overs should be a positive number.')
            .test('is-decimal', 'Number of overs is invalid.', (val: any) => {
              if (val) return /^(0|[1-9]\d*)(\.[012345])?$/.test(val);
              return true;
            }),
          conceded: yupPositiveIntegerSchema('Number of runs conceded'),
          maidens: yupPositiveIntegerSchema('Number of maidens'),
        }),
      }),
    ),
    fieldingStats: Yup.array().of(
      Yup.object().shape({
        values: Yup.object().shape({
          catches: yupPositiveIntegerSchema('Number of catches'),
          stumps: yupPositiveIntegerSchema('Number of stumps'),
          directHits: yupPositiveIntegerSchema('Number of direct hits'),
          indirectHits: yupPositiveIntegerSchema('Number of indirect hits'),
        }),
      }),
    ),
    teamABattingStats: Yup.array().of(
      Yup.object().shape({
        values: Yup.object().shape({
          balls: yupPositiveIntegerSchema('Number of balls'),
          score: yupPositiveIntegerSchema('Score'),
          fours: yupPositiveIntegerSchema('Number of fours'),
          sixes: yupPositiveIntegerSchema('Number of sixes'),
          isOut: Yup.boolean(),
        }),
      }),
    ),
    teamBBattingStats: Yup.array().of(
      Yup.object().shape({
        values: Yup.object().shape({
          balls: yupPositiveIntegerSchema('Number of balls'),
          score: yupPositiveIntegerSchema('Score'),
          fours: yupPositiveIntegerSchema('Number of fours'),
          sixes: yupPositiveIntegerSchema('Number of sixes'),
          isOut: Yup.boolean(),
        }),
      }),
    ),
    teamABowlingStats: Yup.array().of(
      Yup.object().shape({
        values: Yup.object().shape({
          wickets: yupPositiveIntegerSchema('Number of wickets'),
          overs: Yup.number()
            .typeError('Number of overs should be a positive number.')
            .positive('Number of overs should be a positive number.')
            .test('is-decimal', 'Number of overs is invalid.', (val: any) => {
              if (val) return /^(0|[1-9]\d*)(\.[012345])?$/.test(val);
              return true;
            }),
          conceded: yupPositiveIntegerSchema('Number of runs conceded'),
          maidens: yupPositiveIntegerSchema('Number of maidens'),
        }),
      }),
    ),
    teamBBowlingStats: Yup.array().of(
      Yup.object().shape({
        values: Yup.object().shape({
          wickets: yupPositiveIntegerSchema('Number of wickets'),
          overs: Yup.number()
            .typeError('Number of overs should be a positive number.')
            .positive('Number of overs should be a positive number.')
            .test('is-decimal', 'Number of overs is invalid.', (val: any) => {
              if (val) return /^(0|[1-9]\d*)(\.[012345])?$/.test(val);
              return true;
            }),
          conceded: yupPositiveIntegerSchema('Number of runs conceded'),
          maidens: yupPositiveIntegerSchema('Number of maidens'),
        }),
      }),
    ),
    teamAFieldingStats: Yup.array().of(
      Yup.object().shape({
        values: Yup.object().shape({
          catches: yupPositiveIntegerSchema('Number of catches'),
          stumps: yupPositiveIntegerSchema('Number of stumps'),
          directHits: yupPositiveIntegerSchema('Number of direct hits'),
          indirectHits: yupPositiveIntegerSchema('Number of indirect hits'),
        }),
      }),
    ),
    teamBFieldingStats: Yup.array().of(
      Yup.object().shape({
        values: Yup.object().shape({
          catches: yupPositiveIntegerSchema('Number of catches'),
          stumps: yupPositiveIntegerSchema('Number of stumps'),
          directHits: yupPositiveIntegerSchema('Number of direct hits'),
          indirectHits: yupPositiveIntegerSchema('Number of indirect hits'),
        }),
      }),
    ),
  });

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ display: 'flex', alignItems: 'center' }}>
        <Formik
          initialValues={{
            isPPL: teamAEditMatch ? !teamAEditMatch.oppositeTeamId : false,
            title: teamAEditMatch ? teamAEditMatch?.title : '',
            oppositeTeamId: teamAEditMatch?.oppositeTeamId || null,
            pplGroupTitle:
              teamAEditMatch?.pplGroup?.title ||
              teamBEditMatch?.pplGroup?.title ||
              '',
            teamATitle: teamAEditMatch?.title || '',
            teamBTitle: teamBEditMatch?.title || '',
            date: teamAEditMatch?.date || '',
            location: teamAEditMatch?.location || '',
            result: teamAEditMatch?.result || null,
            numberOfDeliveriesPerOver:
              teamAEditMatch?.numberOfDeliveriesPerOver || 6,
            officialPlayers:
              teamAEditMatch?.officialPlayers.map((player: any) => player.id) ||
              [],
            teamAPlayers: defaultTeamAPlayers,
            teamBPlayers: defaultTeamBPlayers,
            battingStats: mapBattingStats(teamAEditMatch?.battingStats),
            teamABattingStats: mapBattingStats(teamAEditMatch?.battingStats),
            teamBBattingStats: mapBattingStats(teamBEditMatch?.battingStats),
            bowlingStats: mapBowlingStats(teamAEditMatch?.bowlingStats),
            teamABowlingStats: mapBowlingStats(teamAEditMatch?.bowlingStats),
            teamBBowlingStats: mapBowlingStats(teamBEditMatch?.bowlingStats),
            fieldingStats: mapFieldingStats(teamAEditMatch?.fieldingStats),
            teamAFieldingStats: mapFieldingStats(teamAEditMatch?.fieldingStats),
            teamBFieldingStats: mapFieldingStats(teamBEditMatch?.fieldingStats),
          }}
          validationSchema={matchValidationSchema}
          validateOnBlur={false}
          onSubmit={async (values: any) => {
            try {
              if (editMatch) {
                if (isEditingPPLPair) {
                  const teamAMatchId = teamAEditMatch?.id;
                  const teamBMatchId = teamBEditMatch?.id;
                  const pplGroupId =
                    teamAEditMatch?.pplGroupId || teamBEditMatch?.pplGroupId;

                  if (values.isPPL) {
                    await dispatch(
                      updateMatch({
                        ...values,
                        id: teamAMatchId,
                        isPPL: true,
                        title: values.teamATitle,
                        oppositeTeamId: null,
                        result: null,
                        pplGroupId,
                        pplTeamSide: 'teamA',
                        pplGroupTitle: values.pplGroupTitle || null,
                        officialPlayers: values.teamAPlayers,
                        battingStats: values.teamABattingStats,
                        bowlingStats: values.teamABowlingStats,
                        fieldingStats: values.teamAFieldingStats,
                        teamATitle: null,
                        teamBTitle: null,
                      }),
                    ).unwrap();

                    await dispatch(
                      updateMatch({
                        ...values,
                        id: teamBMatchId,
                        isPPL: true,
                        title: values.teamBTitle,
                        oppositeTeamId: null,
                        result: null,
                        pplGroupId,
                        pplTeamSide: 'teamB',
                        pplGroupTitle: values.pplGroupTitle || null,
                        officialPlayers: values.teamBPlayers,
                        battingStats: values.teamBBattingStats,
                        bowlingStats: values.teamBBowlingStats,
                        fieldingStats: values.teamBFieldingStats,
                        teamATitle: null,
                        teamBTitle: null,
                      }),
                    ).unwrap();
                  } else {
                    await dispatch(
                      updateMatch({
                        ...values,
                        id: teamAMatchId,
                        isPPL: false,
                        title: values.title,
                        pplGroupId: null,
                        pplTeamSide: null,
                        pplGroupTitle: null,
                        teamATitle: null,
                        teamBTitle: null,
                        teamAPlayers: [],
                        teamBPlayers: [],
                        teamABattingStats: [],
                        teamBBattingStats: [],
                        teamABowlingStats: [],
                        teamBBowlingStats: [],
                        teamAFieldingStats: [],
                        teamBFieldingStats: [],
                      }),
                    ).unwrap();

                    if (teamBMatchId) {
                      await dispatch(
                        deleteMatch({ id: teamBMatchId }),
                      ).unwrap();
                    }
                  }
                } else {
                  await dispatch(
                    updateMatch({
                      ...(values.isPPL
                        ? {
                            ...values,
                            pplGroupTitle: values.pplGroupTitle || null,
                            title:
                              values.title ||
                              `${values.teamATitle} vs ${values.teamBTitle}`,
                            oppositeTeamId: null,
                            result: null,
                            officialPlayers: [
                              ...values.teamAPlayers,
                              ...values.teamBPlayers,
                            ],
                            teamAPlayers: values.teamAPlayers,
                            teamBPlayers: values.teamBPlayers,
                            battingStats: [
                              ...values.teamABattingStats,
                              ...values.teamBBattingStats,
                            ],
                            bowlingStats: [
                              ...values.teamABowlingStats,
                              ...values.teamBBowlingStats,
                            ],
                            fieldingStats: [
                              ...values.teamAFieldingStats,
                              ...values.teamBFieldingStats,
                            ],
                          }
                        : {
                            ...values,
                            teamATitle: null,
                            teamBTitle: null,
                          }),
                      id: editMatch.id,
                    }),
                  ).unwrap();
                }
              } else {
                await dispatch(
                  createMatch(
                    values.isPPL
                      ? {
                          ...values,
                          pplGroupTitle: values.pplGroupTitle || null,
                          title:
                            values.title ||
                            `${values.teamATitle} vs ${values.teamBTitle}`,
                          oppositeTeamId: null,
                          result: null,
                          officialPlayers: [
                            ...values.teamAPlayers,
                            ...values.teamBPlayers,
                          ],
                          teamAPlayers: values.teamAPlayers,
                          teamBPlayers: values.teamBPlayers,
                          battingStats: [
                            ...values.teamABattingStats,
                            ...values.teamBBattingStats,
                          ],
                          bowlingStats: [
                            ...values.teamABowlingStats,
                            ...values.teamBBowlingStats,
                          ],
                          fieldingStats: [
                            ...values.teamAFieldingStats,
                            ...values.teamBFieldingStats,
                          ],
                        }
                      : {
                          ...values,
                          teamATitle: null,
                          teamBTitle: null,
                        },
                  ),
                ).unwrap();
              }

              ToastAndroid.showWithGravity(
                `Match ${editMatch ? 'updated' : 'created'} successfully.`,
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
              dispatch(setEditing(false));
              navigation.navigate(NavigationRoutes.MATCHES);
            } catch (error) {
              ToastAndroid.showWithGravity(
                error,
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
            }
          }}>
          {({
            handleSubmit,
            setFieldValue,
            setFieldTouched,
            values,
            errors,
            touched,
          }) => (
            <>
              <SectionTitle title="Match Details" marginTop={10} />
              <SwitchInput
                placeholder="Mark as PPL"
                value={values.isPPL}
                onChangeValue={() => {
                  if (!values.isPPL) {
                    setFieldValue('oppositeTeamId', null);
                    setFieldValue('result', null);
                  } else if (isEditingPPLPair) {
                    setFieldValue('officialPlayers', values.teamAPlayers);
                    setFieldValue('battingStats', values.teamABattingStats);
                    setFieldValue('bowlingStats', values.teamABowlingStats);
                    setFieldValue('fieldingStats', values.teamAFieldingStats);
                    setFieldValue('title', values.teamATitle || '');
                  }
                  setFieldValue('isPPL', !values.isPPL);
                }}
              />
              {!values.isPPL && (
                <TextInput
                  value={values.title}
                  onChangeText={(value) => setFieldValue('title', value)}
                  length="long"
                  placeholder="Title"
                  onBlur={(event) => setFieldTouched('title', true, true)}
                  error={touched.title && (errors.title as string)}
                />
              )}
              {values.isPPL && (
                <>
                  <TextInput
                    value={values.pplGroupTitle}
                    onChangeText={(value) =>
                      setFieldValue('pplGroupTitle', value)
                    }
                    length="long"
                    placeholder="Match Title (optional)"
                    onBlur={() => setFieldTouched('pplGroupTitle', true, true)}
                    error={
                      touched.pplGroupTitle && (errors.pplGroupTitle as string)
                    }
                  />
                  <TextInput
                    value={values.teamATitle}
                    onChangeText={(value) => setFieldValue('teamATitle', value)}
                    length="long"
                    placeholder="Team A Name"
                    onBlur={() => setFieldTouched('teamATitle', true, true)}
                    error={touched.teamATitle && (errors.teamATitle as string)}
                  />
                  <TextInput
                    value={values.teamBTitle}
                    onChangeText={(value) => setFieldValue('teamBTitle', value)}
                    length="long"
                    placeholder="Team B Name"
                    onBlur={() => setFieldTouched('teamBTitle', true, true)}
                    error={touched.teamBTitle && (errors.teamBTitle as string)}
                  />
                </>
              )}
              {!values.isPPL && (
                <OppositeTeamPicker
                  placeholder="Opposite Team"
                  value={values.oppositeTeamId}
                  onBlur={() => setFieldTouched('oppositeTeamId', true, true)}
                  onChange={(value) => setFieldValue('oppositeTeamId', value)}
                  error={
                    touched.oppositeTeamId && (errors.oppositeTeamId as string)
                  }
                />
              )}
              <DatePicker
                placeholder="Date"
                value={values.date}
                onChange={(value) => setFieldValue('date', value)}
                onBlur={() => setFieldTouched('date', true, true)}
                error={touched.date && (errors.date as string)}
              />
              <TextInput
                value={values.location}
                onChangeText={(value) => setFieldValue('location', value)}
                length="long"
                placeholder="Location"
                onBlur={(event) => setFieldTouched('location', true, true)}
                error={touched.location && (errors.location as string)}
              />
              {!values.isPPL && (
                <ResultsPicker
                  title="Select result"
                  placeholder="Results"
                  value={values.result}
                  onBlur={() => setFieldTouched('result', true, true)}
                  onChangeValue={(value) => setFieldValue('result', value)}
                  error={touched.result && (errors.result as string)}
                />
              )}
              <TextInput
                value={values.numberOfDeliveriesPerOver?.toString()}
                onChangeText={(value) =>
                  setFieldValue('numberOfDeliveriesPerOver', value)
                }
                length="long"
                placeholder="Number of deliveries per over"
                onBlur={(event) =>
                  setFieldTouched('numberOfDeliveriesPerOver', true, true)
                }
                keyboardType="number-pad"
                error={
                  touched.numberOfDeliveriesPerOver &&
                  (errors.numberOfDeliveriesPerOver as string)
                }
              />
              {!values.isPPL && (
                <>
                  <PlayersPicker
                    placeholder="Players of Your Team"
                    players={players}
                    emptyMessage="No players found."
                    selected={values.officialPlayers}
                    error={
                      touched.officialPlayers &&
                      (errors.officialPlayers as string)
                    }
                    onBlur={() =>
                      setFieldTouched('officialPlayers', true, true)
                    }
                    onChangeSelection={(officialPlayers) => {
                      setFieldValue(
                        'battingStats',
                        values.battingStats.filter((batsman) =>
                          (officialPlayers as any[]).includes(batsman.id),
                        ),
                      );
                      setFieldValue(
                        'bowlingStats',
                        values.bowlingStats.filter((bowler) =>
                          (officialPlayers as any[]).includes(bowler.id),
                        ),
                      );
                      setFieldValue(
                        'fieldingStats',
                        values.fieldingStats.filter((fielder) =>
                          (officialPlayers as any[]).includes(fielder.id),
                        ),
                      );
                      setFieldValue('officialPlayers', officialPlayers);
                    }}
                  />
                  <SectionTitle title="Batting Details" />
                  <ChildInputWithPlayers
                    placeholder="Select Batsmen"
                    emptyMessage={emptyPlayersMessage}
                    players={players.filter((player) =>
                      values.officialPlayers.includes(player.id),
                    )}
                    values={values.battingStats}
                    errors={
                      touched.battingStats &&
                      (errors.battingStats as { values: object }[])
                    }
                    onBlur={() => setFieldTouched('battingStats', true, true)}
                    onChangeValues={(battingStats) =>
                      setFieldValue('battingStats', battingStats)
                    }
                    itemProperties={[
                      {
                        type: 'text',
                        name: 'score',
                        placeholder: 'Score',
                        keyboardType: 'number-pad',
                      },
                      {
                        type: 'text',
                        name: 'balls',
                        placeholder: 'Balls',
                        keyboardType: 'number-pad',
                      },
                      {
                        type: 'text',
                        name: 'fours',
                        placeholder: '4s',
                        keyboardType: 'number-pad',
                      },
                      {
                        type: 'text',
                        name: 'sixes',
                        placeholder: '6s',
                        keyboardType: 'number-pad',
                      },
                      {
                        type: 'switch',
                        name: 'isOut',
                        text: 'Out',
                      },
                    ]}
                  />
                  <SectionTitle title="Bowling Details" />
                  <ChildInputWithPlayers
                    placeholder="Select Bowlers"
                    emptyMessage={emptyPlayersMessage}
                    players={players.filter((player) =>
                      values.officialPlayers.includes(player.id),
                    )}
                    values={values.bowlingStats}
                    errors={
                      touched.battingStats &&
                      (errors.bowlingStats as { values: object }[])
                    }
                    onBlur={() => setFieldTouched('bowlingStats', true, true)}
                    onChangeValues={(bowlingStats) =>
                      setFieldValue('bowlingStats', bowlingStats)
                    }
                    itemProperties={[
                      {
                        type: 'text',
                        name: 'wickets',
                        placeholder: 'Wickets',
                        keyboardType: 'number-pad',
                      },
                      {
                        type: 'text',
                        name: 'overs',
                        placeholder: 'Overs',
                        keyboardType: 'decimal-pad',
                      },
                      {
                        type: 'text',
                        name: 'conceded',
                        placeholder: 'Conceded',
                        keyboardType: 'number-pad',
                      },
                      {
                        type: 'text',
                        name: 'maidens',
                        placeholder: 'Maidens',
                        keyboardType: 'number-pad',
                      },
                    ]}
                  />
                  <SectionTitle title="Fielding Details" />
                  <ChildInputWithPlayers
                    placeholder="Select Fielders"
                    emptyMessage={emptyPlayersMessage}
                    players={players.filter((player) =>
                      values.officialPlayers.includes(player.id),
                    )}
                    values={values.fieldingStats}
                    errors={
                      touched.fieldingStats &&
                      (errors.fieldingStats as { values: object }[])
                    }
                    onBlur={() => setFieldTouched('fieldingStats', true, true)}
                    onChangeValues={(fieldingStats) =>
                      setFieldValue('fieldingStats', fieldingStats)
                    }
                    itemProperties={[
                      {
                        type: 'text',
                        name: 'catches',
                        placeholder: 'Catches',
                        keyboardType: 'number-pad',
                      },
                      {
                        type: 'text',
                        name: 'stumps',
                        placeholder: 'Stumps',
                        keyboardType: 'number-pad',
                      },
                      {
                        type: 'text',
                        name: 'directHits',
                        placeholder: 'Direct Hits',
                        keyboardType: 'number-pad',
                      },
                      {
                        type: 'text',
                        name: 'indirectHits',
                        placeholder: 'Indirect Hits',
                        keyboardType: 'number-pad',
                      },
                    ]}
                  />
                </>
              )}
              {values.isPPL && (
                <>
                  <PlayersPicker
                    placeholder={`Players of ${values.teamATitle || 'Team A'}`}
                    players={players}
                    emptyMessage="No players found."
                    selected={values.teamAPlayers}
                    error={
                      touched.teamAPlayers && (errors.teamAPlayers as string)
                    }
                    onBlur={() => setFieldTouched('teamAPlayers', true, true)}
                    onChangeSelection={(teamAPlayers) => {
                      setFieldValue(
                        'teamABattingStats',
                        values.teamABattingStats.filter((stat: any) =>
                          (teamAPlayers as any[]).includes(stat.id),
                        ),
                      );
                      setFieldValue(
                        'teamABowlingStats',
                        values.teamABowlingStats.filter((stat: any) =>
                          (teamAPlayers as any[]).includes(stat.id),
                        ),
                      );
                      setFieldValue(
                        'teamAFieldingStats',
                        values.teamAFieldingStats.filter((stat: any) =>
                          (teamAPlayers as any[]).includes(stat.id),
                        ),
                      );
                      setFieldValue('teamAPlayers', teamAPlayers);
                    }}
                  />
                  <PlayersPicker
                    placeholder={`Players of ${values.teamBTitle || 'Team B'}`}
                    players={players.filter(
                      (player) => !values.teamAPlayers.includes(player.id),
                    )}
                    emptyMessage="No available players found."
                    selected={values.teamBPlayers}
                    error={
                      touched.teamBPlayers && (errors.teamBPlayers as string)
                    }
                    onBlur={() => setFieldTouched('teamBPlayers', true, true)}
                    onChangeSelection={(teamBPlayers) => {
                      setFieldValue(
                        'teamBBattingStats',
                        values.teamBBattingStats.filter((stat: any) =>
                          (teamBPlayers as any[]).includes(stat.id),
                        ),
                      );
                      setFieldValue(
                        'teamBBowlingStats',
                        values.teamBBowlingStats.filter((stat: any) =>
                          (teamBPlayers as any[]).includes(stat.id),
                        ),
                      );
                      setFieldValue(
                        'teamBFieldingStats',
                        values.teamBFieldingStats.filter((stat: any) =>
                          (teamBPlayers as any[]).includes(stat.id),
                        ),
                      );
                      setFieldValue('teamBPlayers', teamBPlayers);
                    }}
                  />

                  <SectionTitle
                    title={`Batting Details - ${values.teamATitle || 'Team A'}`}
                  />
                  <ChildInputWithPlayers
                    placeholder={`Select ${values.teamATitle || 'Team A'} Batsmen`}
                    emptyMessage={emptyPlayersMessage}
                    players={players.filter((player) =>
                      values.teamAPlayers.includes(player.id),
                    )}
                    values={values.teamABattingStats}
                    errors={
                      touched.teamABattingStats &&
                      (errors.teamABattingStats as { values: object }[])
                    }
                    onBlur={() =>
                      setFieldTouched('teamABattingStats', true, true)
                    }
                    onChangeValues={(teamABattingStats) =>
                      setFieldValue('teamABattingStats', teamABattingStats)
                    }
                    itemProperties={[
                      {
                        type: 'text',
                        name: 'score',
                        placeholder: 'Score',
                        keyboardType: 'number-pad',
                      },
                      {
                        type: 'text',
                        name: 'balls',
                        placeholder: 'Balls',
                        keyboardType: 'number-pad',
                      },
                      {
                        type: 'text',
                        name: 'fours',
                        placeholder: '4s',
                        keyboardType: 'number-pad',
                      },
                      {
                        type: 'text',
                        name: 'sixes',
                        placeholder: '6s',
                        keyboardType: 'number-pad',
                      },
                      {
                        type: 'switch',
                        name: 'isOut',
                        text: 'Out',
                      },
                    ]}
                  />
                  <SectionTitle
                    title={`Batting Details - ${values.teamBTitle || 'Team B'}`}
                  />
                  <ChildInputWithPlayers
                    placeholder={`Select ${values.teamBTitle || 'Team B'} Batsmen`}
                    emptyMessage={emptyPlayersMessage}
                    players={players.filter((player) =>
                      values.teamBPlayers.includes(player.id),
                    )}
                    values={values.teamBBattingStats}
                    errors={
                      touched.teamBBattingStats &&
                      (errors.teamBBattingStats as { values: object }[])
                    }
                    onBlur={() =>
                      setFieldTouched('teamBBattingStats', true, true)
                    }
                    onChangeValues={(teamBBattingStats) =>
                      setFieldValue('teamBBattingStats', teamBBattingStats)
                    }
                    itemProperties={[
                      {
                        type: 'text',
                        name: 'score',
                        placeholder: 'Score',
                        keyboardType: 'number-pad',
                      },
                      {
                        type: 'text',
                        name: 'balls',
                        placeholder: 'Balls',
                        keyboardType: 'number-pad',
                      },
                      {
                        type: 'text',
                        name: 'fours',
                        placeholder: '4s',
                        keyboardType: 'number-pad',
                      },
                      {
                        type: 'text',
                        name: 'sixes',
                        placeholder: '6s',
                        keyboardType: 'number-pad',
                      },
                      {
                        type: 'switch',
                        name: 'isOut',
                        text: 'Out',
                      },
                    ]}
                  />

                  <SectionTitle
                    title={`Bowling Details - ${values.teamATitle || 'Team A'}`}
                  />
                  <ChildInputWithPlayers
                    placeholder={`Select ${values.teamATitle || 'Team A'} Bowlers`}
                    emptyMessage={emptyPlayersMessage}
                    players={players.filter((player) =>
                      values.teamAPlayers.includes(player.id),
                    )}
                    values={values.teamABowlingStats}
                    errors={
                      touched.teamABowlingStats &&
                      (errors.teamABowlingStats as { values: object }[])
                    }
                    onBlur={() =>
                      setFieldTouched('teamABowlingStats', true, true)
                    }
                    onChangeValues={(teamABowlingStats) =>
                      setFieldValue('teamABowlingStats', teamABowlingStats)
                    }
                    itemProperties={[
                      {
                        type: 'text',
                        name: 'wickets',
                        placeholder: 'Wickets',
                        keyboardType: 'number-pad',
                      },
                      {
                        type: 'text',
                        name: 'overs',
                        placeholder: 'Overs',
                        keyboardType: 'decimal-pad',
                      },
                      {
                        type: 'text',
                        name: 'conceded',
                        placeholder: 'Conceded',
                        keyboardType: 'number-pad',
                      },
                      {
                        type: 'text',
                        name: 'maidens',
                        placeholder: 'Maidens',
                        keyboardType: 'number-pad',
                      },
                    ]}
                  />
                  <SectionTitle
                    title={`Bowling Details - ${values.teamBTitle || 'Team B'}`}
                  />
                  <ChildInputWithPlayers
                    placeholder={`Select ${values.teamBTitle || 'Team B'} Bowlers`}
                    emptyMessage={emptyPlayersMessage}
                    players={players.filter((player) =>
                      values.teamBPlayers.includes(player.id),
                    )}
                    values={values.teamBBowlingStats}
                    errors={
                      touched.teamBBowlingStats &&
                      (errors.teamBBowlingStats as { values: object }[])
                    }
                    onBlur={() =>
                      setFieldTouched('teamBBowlingStats', true, true)
                    }
                    onChangeValues={(teamBBowlingStats) =>
                      setFieldValue('teamBBowlingStats', teamBBowlingStats)
                    }
                    itemProperties={[
                      {
                        type: 'text',
                        name: 'wickets',
                        placeholder: 'Wickets',
                        keyboardType: 'number-pad',
                      },
                      {
                        type: 'text',
                        name: 'overs',
                        placeholder: 'Overs',
                        keyboardType: 'decimal-pad',
                      },
                      {
                        type: 'text',
                        name: 'conceded',
                        placeholder: 'Conceded',
                        keyboardType: 'number-pad',
                      },
                      {
                        type: 'text',
                        name: 'maidens',
                        placeholder: 'Maidens',
                        keyboardType: 'number-pad',
                      },
                    ]}
                  />

                  <SectionTitle
                    title={`Fielding Details - ${
                      values.teamATitle || 'Team A'
                    }`}
                  />
                  <ChildInputWithPlayers
                    placeholder={`Select ${values.teamATitle || 'Team A'} Fielders`}
                    emptyMessage={emptyPlayersMessage}
                    players={players.filter((player) =>
                      values.teamAPlayers.includes(player.id),
                    )}
                    values={values.teamAFieldingStats}
                    errors={
                      touched.teamAFieldingStats &&
                      (errors.teamAFieldingStats as { values: object }[])
                    }
                    onBlur={() =>
                      setFieldTouched('teamAFieldingStats', true, true)
                    }
                    onChangeValues={(teamAFieldingStats) =>
                      setFieldValue('teamAFieldingStats', teamAFieldingStats)
                    }
                    itemProperties={[
                      {
                        type: 'text',
                        name: 'catches',
                        placeholder: 'Catches',
                        keyboardType: 'number-pad',
                      },
                      {
                        type: 'text',
                        name: 'stumps',
                        placeholder: 'Stumps',
                        keyboardType: 'number-pad',
                      },
                      {
                        type: 'text',
                        name: 'directHits',
                        placeholder: 'Direct Hits',
                        keyboardType: 'number-pad',
                      },
                      {
                        type: 'text',
                        name: 'indirectHits',
                        placeholder: 'Indirect Hits',
                        keyboardType: 'number-pad',
                      },
                    ]}
                  />
                  <SectionTitle
                    title={`Fielding Details - ${
                      values.teamBTitle || 'Team B'
                    }`}
                  />
                  <ChildInputWithPlayers
                    placeholder={`Select ${values.teamBTitle || 'Team B'} Fielders`}
                    emptyMessage={emptyPlayersMessage}
                    players={players.filter((player) =>
                      values.teamBPlayers.includes(player.id),
                    )}
                    values={values.teamBFieldingStats}
                    errors={
                      touched.teamBFieldingStats &&
                      (errors.teamBFieldingStats as { values: object }[])
                    }
                    onBlur={() =>
                      setFieldTouched('teamBFieldingStats', true, true)
                    }
                    onChangeValues={(teamBFieldingStats) =>
                      setFieldValue('teamBFieldingStats', teamBFieldingStats)
                    }
                    itemProperties={[
                      {
                        type: 'text',
                        name: 'catches',
                        placeholder: 'Catches',
                        keyboardType: 'number-pad',
                      },
                      {
                        type: 'text',
                        name: 'stumps',
                        placeholder: 'Stumps',
                        keyboardType: 'number-pad',
                      },
                      {
                        type: 'text',
                        name: 'directHits',
                        placeholder: 'Direct Hits',
                        keyboardType: 'number-pad',
                      },
                      {
                        type: 'text',
                        name: 'indirectHits',
                        placeholder: 'Indirect Hits',
                        keyboardType: 'number-pad',
                      },
                    ]}
                  />
                </>
              )}
              <View style={{ marginTop: 40 }}>
                <Button
                  length="long"
                  style="filled"
                  color={Colors.DEEP_TEAL}
                  text={!editMatch ? 'Create' : 'Save'}
                  onPress={handleSubmit}
                />
                <Button
                  length="long"
                  style="outlined"
                  color={Colors.DEEP_TEAL}
                  text="Cancel"
                  onPress={() => {
                    navigation.goBack();
                    dispatch(setEditing(false));
                  }}
                />
              </View>
            </>
          )}
        </Formik>
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
