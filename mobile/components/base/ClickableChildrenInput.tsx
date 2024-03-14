import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TextInput,
  Switch,
} from 'react-native';
import ClickableInput from './ClickableInput';
import { Colors } from '../../constants/Colors';

const width: number = Dimensions.get('window').width;

interface ChildItem {
  id: string | number;
  text: string;
}

interface ClickableChildrenInputProps {
  placeholder: string;
  value: string;
  icon?: React.FC;
  items: ChildItem[];
  itemProperties: (ChildPropertyText | ChildPropertySwitch)[];
  itemValues: ChildItemValues[];
  onPress: () => void;
  onChange: (values: ChildItemValues[]) => void;
}

interface TextItemInputProps extends InputText {
  width: number;
  value: string;
  onChange: (text: string | number) => void;
}

interface SwitchInputProps extends InputSwitch {
  width: number;
  value: boolean;
  onChange: (value: boolean) => void;
}

const ItemInputText = (props: TextItemInputProps) => {
  return (
    <View style={[styles.textInputContainer, { width: props.width }]}>
      <TextInput
        style={styles.textInput}
        editable
        onChangeText={(text) => props.onChange(text)}
        value={props.value}
        placeholder={props.placeholder}
      />
    </View>
  );
};

const ItemInputSwitch = (props: SwitchInputProps) => {
  return (
    <View style={[styles.switchInputContainer, { width: props.width }]}>
      <Text>{props.value ? props.textOn : props.textOff}</Text>
      <Switch
        value={props.value}
        onChange={() => props.onChange(!props.value)}
      />
    </View>
  );
};

const ClickableChildrenInput = (props: ClickableChildrenInputProps) => {
  const inputPropertyWidth = props.itemProperties.length
    ? (width - 20 - 30 - 10 * (props.itemProperties.length - 1)) /
      props.itemProperties.length
    : 0;

  const updateValues = (
    id: string | number,
    name: string,
    value: string | number | boolean
  ) => {
    if (!props.itemValues.find((item) => item.id === id)) {
      props.onChange([
        ...props.itemValues,
        { id: id, values: { [name]: value } },
      ]);
    } else {
      const updatedValues = props.itemValues.map((itemValue) => {
        if (itemValue.id === id) {
          return {
            ...itemValue,
            values: { ...itemValue.values, [name]: value },
          };
        }

        return itemValue;
      });

      props.onChange(updatedValues);
    }
  };

  return (
    <View>
      <ClickableInput
        containerStyle={
          props.items && props.items.length
            ? {
                marginBottom: 0,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              }
            : {}
        }
        placeholder={props.placeholder}
        value={props.value}
        onPress={props.onPress}
        icon={props.icon}
      />
      {props.items && !!props.items.length && (
        <View style={styles.childrenContainer}>
          {props.items.map((item, index) => (
            <View key={item.id}>
              <Text style={styles.childTitle}>{item.text}</Text>
              <View
                style={[
                  styles.child,
                  { marginBottom: index === props.items.length - 1 ? 0 : 15 },
                ]}>
                {props.itemProperties &&
                  !!props.itemProperties.length &&
                  props.itemProperties.map((itemProperty) =>
                    itemProperty.type === 'text' ? (
                      <ItemInputText
                        width={inputPropertyWidth}
                        placeholder={itemProperty.placeholder}
                        value={
                          props.itemValues.find(
                            (itemValue) => itemValue.id === item.id
                          )?.values[itemProperty.name]
                        }
                        onChange={(text) =>
                          updateValues(item.id, itemProperty.name, text)
                        }
                      />
                    ) : (
                      <ItemInputSwitch
                        width={inputPropertyWidth}
                        textOn={itemProperty.textOn}
                        textOff={itemProperty.textOff}
                        value={
                          props.itemValues.find(
                            (itemValue) => itemValue.id === item.id
                          )?.values[itemProperty.name]
                        }
                        onChange={(value) =>
                          updateValues(item.id, itemProperty.name, value)
                        }
                      />
                    )
                  )}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  childrenContainer: {
    width: width - 20,
    padding: 15,
    backgroundColor: Colors.MEDIUM_TEAL,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.DEEP_TEAL,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  child: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 5,
  },
  childTitle: {
    fontFamily: 'Anybody-Regular',
    fontSize: 15,
    color: Colors.OFF_WHITE,
    textAlignVertical: 'center',
  },
  textInputContainer: {
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 15,
    backgroundColor: Colors.OFF_WHITE,
    padding: 15,
    height: '100%',
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontFamily: 'Anybody-Regular',
    fontSize: 15,
    color: Colors.DEEP_TEAL,
    textAlignVertical: 'center',
  },
  switchInputContainer: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 15,
    backgroundColor: Colors.OFF_WHITE,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default ClickableChildrenInput;
