import { KeyboardType } from 'react-native';

export interface PlayerType {
  id: string | number;
  name: string;
  mainRoll: 'batsman' | 'bowler' | 'allRounder';
  isWicketKeeper: boolean;
  isCaptain: boolean;
}

export interface InputText {
  placeholder: string;
}

export interface InputSwitch {
  text: string;
}

export interface ChildPropertyText extends InputText {
  type: 'text';
  name: string;
  keyboardType?: KeyboardType;
}

export interface ChildPropertySwitch extends InputSwitch {
  type: 'switch';
  name: string;
}

export interface ChildItemValues {
  id: string | number;
  values: object;
}
