import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ClickableInput from './base/ClickableInput';
import Modal from 'react-native-modal';
import { Colors } from '../constants/Colors';
import { Entypo } from '@expo/vector-icons';
import TextInput from './base/TextInput';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createTeam } from '../redux/slices/teamSlice';

interface OppositeTeamPickerProps {
  placeholder: string;
  emptyMessage?: string;
  error?: string;
  value: string | number | null;
  onBlur?: () => void;
  onChange: (value: string | number) => void;
}

interface BasicTeamItemProps {
  selected: boolean;
  text: string;
}

interface TeamItemProps extends BasicTeamItemProps {
  onPress: () => void;
}

const width: number = Dimensions.get('window').width;
const height: number = Dimensions.get('window').height;

const BasicTeamItem = (props: BasicTeamItemProps) => {
  return (
    <View
      style={[
        styles.itemContainer,
        props.selected
          ? { backgroundColor: Colors.MEDIUM_TEAL, marginBottom: 10 }
          : { backgroundColor: Colors.OFF_WHITE },
      ]}>
      <Text
        style={[
          styles.itemText,
          { color: props.selected ? Colors.OFF_WHITE : Colors.DEEP_TEAL },
        ]}>
        {props.text}
      </Text>
    </View>
  );
};

const TeamItem = (props: TeamItemProps) => {
  if (props.selected) return <BasicTeamItem {...props} />;
  else
    return (
      <Pressable style={styles.itemShadowContainer} onPress={props.onPress}>
        <BasicTeamItem {...props} />
      </Pressable>
    );
};

const OppositeTeamPicker = (props: OppositeTeamPickerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const teams = useSelector((state: RootState) => state.team.teams);
  const [selectionModalVisible, setSelectionModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const openNewModal = () => {
    setSelectionModalVisible(false);
    setCreateModalVisible(true);
  };

  return (
    <View>
      <View style={{ marginBottom: 10 }}>
        <ClickableInput
          containerStyle={{ marginBottom: 0 }}
          placeholder={props.placeholder}
          value={
            props.value
              ? teams.find((team) => team.id === props.value).name
              : ''
          }
          icon={() => (
            <Entypo name="chevron-right" size={24} color={Colors.DEEP_TEAL} />
          )}
          onPress={() => setSelectionModalVisible(true)}
        />
        {props.error && true && <Text style={styles.error}>{props.error}</Text>}
      </View>
      <Modal
        isVisible={selectionModalVisible}
        style={styles.selectionModal}
        onBackdropPress={() => {
          props.onBlur && props.onBlur();
          setSelectionModalVisible(false);
        }}>
        <View style={styles.selectionContainer}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.5}
            onPress={openNewModal}>
            <Text style={styles.buttonText}>Create new team</Text>
          </TouchableOpacity>
          <View style={{ width: width - 50, marginTop: 30 }}>
            <FlatList
              data={teams}
              renderItem={({ item }) => (
                <TeamItem
                  key={item.id}
                  text={item.name}
                  selected={item.id === props.value}
                  onPress={() => {
                    setSelectionModalVisible(false);
                    props.onChange(item.id);
                  }}
                />
              )}
              ListEmptyComponent={() => (
                <View style={styles.emptyMessageContainer}>
                  <Text style={styles.emptyText}>
                    {props.emptyMessage || 'No teams found'}
                  </Text>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={createModalVisible}
        style={styles.creationModal}
        onBackdropPress={() => {
          props.onBlur && props.onBlur();
          setCreateModalVisible(false);
        }}>
        <View style={styles.creationContainer}>
          <Text style={styles.title}>Create new team</Text>
          <Formik
            initialValues={{
              name: '',
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string()
                .test('is-unique', 'Name is already taken.', (val: any) => {
                  if (val)
                    return !teams.find(
                      (team) => team.name.toLowerCase() === val.toLowerCase()
                    );
                  return true;
                })
                .required('Name is required.'),
            })}
            onSubmit={(values) => {
              dispatch(createTeam({ name: values.name }))
                .unwrap()
                .then((team) => {
                  setCreateModalVisible(false);
                  props.onChange(team.id);
                });
            }}>
            {({ handleSubmit, handleBlur, handleChange, values, errors }) => (
              <>
                <TextInput
                  name="name"
                  length={width - 60}
                  placeholder="Name"
                  value={values.name}
                  error={errors.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                />
                <TouchableOpacity
                  style={[styles.button, { marginTop: 30 }]}
                  activeOpacity={0.5}
                  onPress={() => handleSubmit()}>
                  <Text style={styles.buttonText}>Save & select</Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selectionModal: {
    position: 'absolute',
    bottom: 0,
    width: width - 30,
    marginHorizontal: 15,
    marginBottom: 0,
  },
  creationModal: {
    width: width - 30,
    marginHorizontal: 15,
  },
  selectionContainer: {
    backgroundColor: Colors.WHITE,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: (height * 3) / 4,
    paddingVertical: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  creationContainer: {
    backgroundColor: Colors.WHITE,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 15,
  },
  emptyMessageContainer: {
    display: 'flex',
    width: width - 30,
    height: (height * 3) / 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: Colors.DEEP_TEAL,
    fontSize: 20,
    fontFamily: 'Anybody-Regular',
  },
  button: {
    display: 'flex',
    width: width - 50,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.DEEP_TEAL,
  },
  buttonText: {
    color: Colors.OFF_WHITE,
    fontSize: 20,
    fontFamily: 'Anybody-Regular',
  },
  title: {
    width: '100%',
    color: Colors.DEEP_TEAL,
    fontSize: 24,
    fontFamily: 'Anybody-Regular',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  itemShadowContainer: {
    paddingLeft: 4,
    paddingBottom: 4,
    borderRadius: 15,
    marginBottom: 10,
    backgroundColor: Colors.LIGHT_SHADOW,
  },
  itemContainer: {
    padding: 10,
    borderRadius: 15,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemText: {
    fontSize: 20,
    fontFamily: 'Anybody-Regular',
  },
  error: {
    fontFamily: 'Anybody-Regular',
    fontSize: 15,
    color: Colors.DEEP_ORANGE,
  },
});

export default OppositeTeamPicker;
