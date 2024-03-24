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

export interface BestPlayer {
  id: number | string;
  name: string;
  score: string;
}

export interface SingleMatch {
  id: string | number;
  date: string;
  location: string;
  result: string;
}

export interface CompactMatch {
  id: number | string;
  title: string;
  bestBatsman: BestPlayer | null;
  bestBowler: BestPlayer | null;
}

export interface OutdoorMatch extends CompactMatch {
  oppositeTeam: {
    id: number | string;
    name: string;
  };
  counts: {
    all: number;
    won: number;
    lost: number;
    draw: number;
  };
  winningPercentage: number;
  matches: SingleMatch[];
}

export interface PPLMatch extends CompactMatch {
  date: string;
}
