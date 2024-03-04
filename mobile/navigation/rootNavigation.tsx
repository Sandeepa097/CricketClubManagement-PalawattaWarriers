import React from 'react';
import {
  NavigationContainerRef,
  ParamListBase,
} from '@react-navigation/native';

import { NavigationRoutes } from '../constants/NavigationRoutes';

export const navigationRef =
  React.createRef<NavigationContainerRef<ParamListBase>>();

const navigate = (name: NavigationRoutes, params: any) =>
  navigationRef.current?.navigate(name, params);

export default {
  navigate,
};
