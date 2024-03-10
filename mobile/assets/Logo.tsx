import React from 'react';
import { View } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { Colors } from '../constants/Colors';

interface LogoProps {
  height?: number;
  fill?: Colors;
}

const defaultProps = {
  height: 102,
  fill: Colors.DEEP_TEAL,
};

const Logo = ({
  height = defaultProps.height,
  fill = defaultProps.fill,
}: LogoProps) => (
  <View style={{ height: height, width: 0.657 * height }}>
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 67 102"
      preserveAspectRatio="xMidYMid meet"
      fill="none">
      <Path
        d="M36.7786 1.42513C42.863 2.51487 52.3526 5.87492 54.2144 7.60032C54.8046 8.19062 54.714 8.37223 53.5333 9.41658C52.8069 10.0522 51.1723 11.5052 49.9007 12.6858C48.6748 13.8663 46.45 15.7734 45.0425 16.9993L42.4088 19.1788L40.7289 17.5442C39.7753 16.6361 38.6856 15.7734 38.2317 15.6372C37.2781 15.3647 37.2325 14.7291 38.0045 13.1852C38.3679 12.5496 38.8671 11.3236 39.1395 10.4609L39.6844 8.87171L38.4585 10.4155C35.1439 14.4566 35.6888 14.1842 32.8737 13.3669C31.5115 12.9582 30.1039 12.5496 29.7407 12.4134C29.2866 12.3225 29.1958 11.6868 29.3774 9.96145C29.6952 7.2371 29.105 7.37331 28.3785 10.2339C27.9698 11.9593 27.6974 12.2771 26.7893 12.2771C25.9265 12.2771 25.6087 11.9593 25.3363 10.7788L25.0185 9.32575L24.5644 10.7333C24.1557 12.0955 23.9287 12.1863 20.3416 12.9582C18.2076 13.4123 16.4367 13.6847 16.3459 13.5939C16.2551 13.5031 15.347 11.8685 14.3481 10.0068C12.214 6.14736 12.1232 6.19275 13.3491 10.915C13.8486 12.7766 14.2573 14.4566 14.2573 14.5928C14.2573 14.7745 13.2583 15.5464 12.0324 16.3182C9.85288 17.7258 6.03879 21.4945 4.72204 23.5378C4.04095 24.6275 3.99554 24.6275 2.36093 23.8102C0.817131 23.0837 0.771725 22.9475 1.3166 22.0848C1.63444 21.5399 2.04309 20.4048 2.22471 19.5421C2.72418 17.181 5.49392 11.9139 6.35665 11.7323C6.99231 11.5961 6.94692 11.4598 6.12961 10.5063C5.17609 9.41658 5.17609 8.46305 6.17501 9.46197C6.53826 9.82523 7.26475 9.41658 8.99018 7.87276C11.8961 5.23923 16.5275 2.19703 17.3903 2.37866C17.7535 2.46947 18.2984 3.24137 18.6162 4.10409L19.1611 5.69327L19.2065 3.55921C19.2519 1.51595 19.2973 1.42513 20.7503 1.24351C23.9741 0.834859 34.2358 0.971077 36.7786 1.42513ZM32.1926 17.5896C36.0522 18.8156 39.3667 21.5399 41.4099 25.0816C42.6359 27.2611 43.4079 29.9854 42.7721 29.9854C42.545 29.9854 37.4596 29.1681 31.5115 28.1692C25.5633 27.1702 20.3871 26.3529 20.0238 26.3529C19.4335 26.3529 19.3881 26.6254 19.7968 28.0329C20.5233 30.5757 19.8876 35.6156 18.3438 40.2017L16.9816 44.2429L18.7524 46.1043C19.706 47.1035 20.8411 48.5563 21.2498 49.3283C22.1125 51.0991 22.7028 54.5045 22.1579 54.5045C21.5676 54.5045 19.4789 56.5478 16.6184 59.8623C13.7578 63.1772 11.4875 64.4937 7.94583 64.8118L5.40313 65.0386L8.2637 63.1772C12.1232 60.6343 14.8929 57.7738 15.8464 55.2766C16.6184 53.1877 16.6184 53.1424 15.4378 49.5098C13.8486 44.4697 13.2129 39.9746 13.4854 35.6612C13.8486 30.5303 14.8475 27.9422 17.6627 25.127C20.7957 22.0394 23.5201 21.1767 29.6952 21.4491C33.9634 21.5853 34.0996 21.5853 32.9645 20.9042C26.7893 17.181 16.9816 18.4977 10.6248 23.9918C9.26261 25.127 8.85396 25.354 9.17179 24.6729C10.0345 23.1291 13.8032 20.0869 16.7546 18.6339C21.2951 16.3637 27.0617 16.0004 32.1926 17.5896ZM34.2358 29.9854C40.0931 31.3022 45.0425 32.5281 45.224 32.6643C45.4965 32.9368 47.4035 42.7445 48.357 48.8287C48.5842 50.3271 48.9019 52.0979 49.0381 52.779C49.2196 53.6872 49.1291 54.0506 48.6748 54.0506C47.3126 54.0506 46.8134 53.0514 45.7689 48.1023C44.9516 44.2882 44.3614 42.6536 43.5894 41.8816C42.863 41.1552 39.8206 39.9746 33.8272 38.1131C29.0596 36.66 24.8822 35.4341 24.5644 35.4341C24.2465 35.4341 25.1547 36.0243 26.5168 36.7053C28.4693 37.6589 29.2866 38.4309 30.1493 40.0655C31.9655 43.38 32.692 43.9249 37.3687 45.378C42.9536 47.1035 43.6347 47.8299 44.452 52.5066C45.5874 59.1812 46.6315 67.6723 46.3591 67.9448C46.2229 68.081 44.5882 67.6723 42.7721 66.9913C39.0942 65.5835 30.4671 61.3154 30.7396 60.9977C30.8304 60.9068 32.0564 61.2245 33.3731 61.7241C36.5061 62.9047 41.5915 64.0851 41.9548 63.722C42.091 63.5858 42.0001 63.404 41.7277 63.3134C39.9568 62.6323 33.5093 58.6364 31.6023 56.9565C29.4682 55.0947 29.2866 54.7317 28.5601 51.3715C27.5158 46.6039 25.8358 43.5162 23.9287 42.9713C22.5211 42.5174 22.4757 42.4721 22.2033 39.112C22.0671 37.2049 21.613 33.8903 21.2498 31.6654C20.4324 26.5346 20.3871 26.807 22.1125 27.2611C22.8844 27.4427 28.3785 28.714 34.2358 29.9854ZM9.03557 68.1263C22.6119 69.3975 33.5093 72.5305 45.5874 78.5697C48.0846 79.841 50.1279 80.7492 50.1279 80.6583C50.1279 80.5221 48.3117 78.8875 46.0413 76.9804C42.1363 73.6659 41.9548 73.4388 41.9548 71.7132C41.9548 69.6247 41.8186 69.6247 46.6771 71.577C49.1743 72.5762 49.4015 72.6215 49.9007 71.8951C50.4003 71.214 50.8542 71.3046 54.8502 73.121L59.2544 75.1187L61.343 78.9328C65.5657 86.6972 67.1551 94.6434 65.1118 97.9579C63.6587 100.365 62.2059 101 58.3462 101C55.1226 101 46.4047 99.3654 45.3603 98.5028C45.0878 98.3213 43.1808 97.4583 41.0466 96.5957C32.3742 93.0541 20.2962 87.333 20.7049 86.9696C20.8411 86.8334 22.1125 87.1515 23.6108 87.6507C27.652 89.0585 38.0498 91.601 42.9083 92.4183C47.222 93.0994 54.4415 93.2812 56.4392 92.6907C57.1659 92.5092 56.0305 92.2368 53.0337 91.8734C38.5494 90.1026 12.6227 78.6603 14.8929 74.9825C15.4378 74.1199 18.8887 73.9836 24.2465 74.71C27.3341 75.0734 29.9223 75.3458 30.0131 75.2549C30.1039 75.1643 29.1958 74.8009 28.0152 74.4832C26.8347 74.2108 24.6098 73.575 23.1114 73.0754C19.0703 71.8495 13.44 70.442 6.53826 69.0345C-0.181796 67.6267 0.590102 67.3543 9.03557 68.1263Z"
        fill={fill}
        stroke={fill}
        stroke-width="0.133333"
      />
    </Svg>
  </View>
);

export default Logo;
