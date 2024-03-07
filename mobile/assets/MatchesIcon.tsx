import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { Colors } from '../constants/Colors';

interface MatchesIconProps {
  size: number;
  fill: Colors;
  shadow: boolean;
}

const defaultProps = {
  size: 24,
  fill: Colors.BLACK,
  shadow: false,
};

const MatchesIcon = (props: MatchesIconProps = defaultProps) => (
  <Svg
    style={props.shadow ? { marginTop: 8 } : {}}
    width={props.size}
    height={props.size}
    viewBox={props.shadow ? '0 0 24 24' : '0 0 18 18'}
    fill="none"
    preserveAspectRatio="xMidYMid meet">
    <Path
      d="M16 2H14V0H4V2H2C0.9 2 0 2.9 0 4V5C0 7.55 1.92 9.63 4.39 9.94C5.02 11.44 6.37 12.57 8 12.9V16H4V18H14V16H10V12.9C11.63 12.57 12.98 11.44 13.61 9.94C16.08 9.63 18 7.55 18 5V4C18 2.9 17.1 2 16 2ZM2 5V4H4V7.82C2.84 7.4 2 6.3 2 5ZM16 5C16 6.3 15.16 7.4 14 7.82V4H16V5Z"
      fill={props.fill}
    />
    {props.shadow && (
      <>
        <Path
          d="M16 2H14V0H4V2H2C0.9 2 0 2.9 0 4V5C0 7.55 1.92 9.63 4.39 9.94C5.02 11.44 6.37 12.57 8 12.9V16H4V18H14V16H10V12.9C11.63 12.57 12.98 11.44 13.61 9.94C16.08 9.63 18 7.55 18 5V4C18 2.9 17.1 2 16 2ZM2 5V4H4V7.82C2.84 7.4 2 6.3 2 5ZM16 5C16 6.3 15.16 7.4 14 7.82V4H16V5Z"
          fill="#0000001a"
          transform="translate(-4, 4)"
        />
      </>
    )}
  </Svg>
);

export default MatchesIcon;
