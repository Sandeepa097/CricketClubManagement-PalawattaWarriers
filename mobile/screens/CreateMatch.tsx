import React, { useState } from 'react';
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
import { createMatch } from '../redux/slices/matchSlice';
import { setEditing } from '../redux/slices/statusSlice';

const CreateMatch = ({ route, navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const emptyPlayersMessage = 'No players found in the team';
  const players = useSelector((state: RootState) => state.player.players);
  const editMatch = route.params;

  const yupPositiveIntegerSchema = (filedName: string) => {
    const message = `${filedName} should be a positive integer.`;
    return Yup.number().typeError(message).min(0, message).integer(message);
  };

  const matchValidationSchema = Yup.object().shape({
    isPPL: Yup.boolean(),
    oppositeTeamId: Yup.number().when('isPPL', (isPPL, schema) => {
      if (!isPPL[0]) return schema.required('Opposite Team is required.');
      return schema.notRequired();
    }),
    date: Yup.string().required('Date is required.'),
    location: Yup.string().required('Location is required.'),
    result: Yup.string().when('isPPL', (isPPL, schema) => {
      if (!isPPL[0]) return schema.required('Result is required.');
      return schema.notRequired();
    }),
    numberOfDeliveriesPerOver: Yup.number()
      .integer('Number of deliveries per over should be an integer.')
      .min(
        1,
        'Number of deliveries per over must be greater than or equal to 1.'
      )
      .max(
        10,
        'Number of deliveries per over must be less than or equal to 10.'
      )
      .required('Number of deliveries per over is required.'),
    officialPlayers: Yup.array()
      .of(Yup.number())
      .min(1, 'Team should have at least one player.'),
    battingStats: Yup.array().of(
      Yup.object().shape({
        values: Yup.object().shape({
          balls: yupPositiveIntegerSchema('Number of balls').required(
            'Number of balls is required.'
          ),
          score: yupPositiveIntegerSchema('Score'),
          fours: yupPositiveIntegerSchema('Number of fours'),
          sixes: yupPositiveIntegerSchema('Number of sixes'),
          isOut: Yup.boolean(),
        }),
      })
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
            })
            .required('Number of overs are required.'),
          conceded: yupPositiveIntegerSchema('Number of runs conceded'),
          maidens: yupPositiveIntegerSchema('Number of maidens'),
        }),
      })
    ),
    fieldingStats: Yup.array().of(
      Yup.object().shape({
        values: Yup.object().shape({
          catches: yupPositiveIntegerSchema('Number of catches'),
          stumps: yupPositiveIntegerSchema('Number of stumps'),
          directHits: yupPositiveIntegerSchema('Number of direct hits'),
          indirectHits: yupPositiveIntegerSchema('Number of indirect hits'),
        }),
      })
    ),
  });

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ display: 'flex', alignItems: 'center' }}>
        <Formik
          initialValues={{
            isPPL: editMatch ? !editMatch.oppositeTeamId : false,
            oppositeTeamId: editMatch?.oppositeTeamId || null,
            date: editMatch?.date || '',
            location: editMatch?.location || '',
            result: editMatch?.result || null,
            numberOfDeliveriesPerOver:
              editMatch?.numberOfDeliveriesPerOver || 6,
            officialPlayers:
              editMatch?.officialPlayers.map((player: any) => player.id) || [],
            battingStats:
              editMatch?.battingStats.map((stat: any) => ({
                id: stat.playerId,
                values: {
                  score: stat.score,
                  balls: stat.balls,
                  sixes: stat.sixes,
                  fours: stat.fours,
                  isOut: stat.isOut,
                },
              })) || [],
            bowlingStats:
              editMatch?.bowlingStats.map((stat: any) => ({
                id: stat.playerId,
                values: {
                  wickets: stat.wickets,
                  overs: stat.overs,
                  conceded: stat.conceded,
                  maidens: stat.maidens,
                },
              })) || [],
            fieldingStats:
              editMatch?.fieldingStats.map((stat: any) => ({
                id: stat.playerId,
                values: {
                  catches: stat.catches,
                  stumps: stat.stumps,
                  directHits: stat.directHits,
                  indirectHits: stat.indirectHits,
                },
              })) || [],
          }}
          validationSchema={matchValidationSchema}
          onSubmit={(values) =>
            dispatch(createMatch(values))
              .unwrap()
              .then(() => {
                ToastAndroid.showWithGravity(
                  'Match created successfully.',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM
                );
                navigation.goBack();
              })
              .catch((error) => {
                ToastAndroid.showWithGravity(
                  error,
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM
                );
              })
          }>
          {({ handleSubmit, setFieldValue, values, errors }) => (
            <>
              <SectionTitle title="Match Details" marginTop={10} />
              <SwitchInput
                placeholder="Mark as PPL"
                value={values.isPPL}
                onChangeValue={() => setFieldValue('isPPL', !values.isPPL)}
              />
              {!values.isPPL && (
                <OppositeTeamPicker
                  placeholder="Opposite Team"
                  value={values.oppositeTeamId}
                  onChange={(value) => setFieldValue('oppositeTeamId', value)}
                  error={errors.oppositeTeamId as string}
                />
              )}
              <DatePicker
                placeholder="Date"
                value={values.date}
                onChange={(value) => setFieldValue('date', value)}
                error={errors.date as string}
              />
              <TextInput
                value={values.location}
                onChangeText={(value) => setFieldValue('location', value)}
                length="long"
                placeholder="Location"
                error={errors.location as string}
              />
              {!values.isPPL && (
                <ResultsPicker
                  title="Select result"
                  placeholder="Results"
                  value={values.result}
                  onChangeValue={(value) => setFieldValue('result', value)}
                  error={errors.result as string}
                />
              )}
              <TextInput
                value={values.numberOfDeliveriesPerOver.toString()}
                onChangeText={(value) =>
                  setFieldValue('numberOfDeliveriesPerOver', value)
                }
                length="long"
                placeholder="Number of deliveries per over"
                error={errors.numberOfDeliveriesPerOver as string}
              />
              <PlayersPicker
                placeholder="Players of Your Team"
                players={players}
                emptyMessage="No players found."
                selected={values.officialPlayers}
                error={errors.officialPlayers as string}
                onChangeSelection={(officialPlayers) => {
                  setFieldValue(
                    'battingStats',
                    values.battingStats.filter((batsman) =>
                      officialPlayers.includes(batsman.id)
                    )
                  );
                  setFieldValue(
                    'bowlingStats',
                    values.bowlingStats.filter((bowler) =>
                      officialPlayers.includes(bowler.id)
                    )
                  );
                  setFieldValue(
                    'fieldingStats',
                    values.fieldingStats.filter((fielder) =>
                      officialPlayers.includes(fielder.id)
                    )
                  );
                  setFieldValue('officialPlayers', officialPlayers);
                }}
              />
              <SectionTitle title="Batting Details" />
              <ChildInputWithPlayers
                placeholder="Select Batsmen"
                emptyMessage={emptyPlayersMessage}
                players={players.filter((player) =>
                  values.officialPlayers.includes(player.id)
                )}
                values={values.battingStats}
                errors={errors.battingStats as { values: object }[]}
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
                  { type: 'text', name: 'balls', placeholder: 'Balls' },
                  { type: 'text', name: 'fours', placeholder: '4s' },
                  { type: 'text', name: 'sixes', placeholder: '6s' },
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
                  values.officialPlayers.includes(player.id)
                )}
                values={values.bowlingStats}
                errors={errors.bowlingStats as { values: object }[]}
                onChangeValues={(bowlingStats) =>
                  setFieldValue('bowlingStats', bowlingStats)
                }
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
                players={players.filter((player) =>
                  values.officialPlayers.includes(player.id)
                )}
                values={values.fieldingStats}
                errors={errors.fieldingStats as { values: object }[]}
                onChangeValues={(fieldingStats) =>
                  setFieldValue('fieldingStats', fieldingStats)
                }
                itemProperties={[
                  { type: 'text', name: 'catches', placeholder: 'Catches' },
                  { type: 'text', name: 'stumps', placeholder: 'Stumps' },
                  {
                    type: 'text',
                    name: 'directHits',
                    placeholder: 'Direct Hits',
                  },
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
