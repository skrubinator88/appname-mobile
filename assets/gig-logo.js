import * as React from "react";
import Svg, { Defs, LinearGradient, Stop, G, Rect, Path } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: style */

/* ORIGINAL COLORS


*/

function SvgComponent(props) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78.081 34.091" {...props}>
      <Defs>
        <LinearGradient id="prefix__a" y1={0.5} x2={1} y2={0.5} gradientUnits="objectBoundingBox">
          <Stop offset={0} stopColor={props.color} />
          <Stop offset={1} stopColor={props.color} stopOpacity={0} />
        </LinearGradient>
      </Defs>

      <G transform="translate(-78.496 -320.656)">
        <Rect fill={props.color} className="prefix__a" width={24.743} height={1.944} rx={0.972} transform="translate(131.834 351.434)" />

        <Rect fill={props.color} className="prefix__a" width={23.784} height={1.766} rx={0.883} transform="translate(129.48 333.513)" />

        <G transform="translate(78.496 321.165)">
          <Path
            className="prefix__a"
            fill={props.color}
            d="M32.321 33.432h-14.19c-.519-.158-.932-.417-.932-.931a.931.931 0 01.932-.932h14.19a.932.932 0 01.932.932.932.932 0 01-.932.931z"
          />

          <Rect className="prefix__a" fill={props.color} width={55.998} height={1.863} rx={0.932} transform="translate(11.452 2.134)" />

          {/* GIG WORD */}
          <Path
            fill={props.color}
            className="prefix__b"
            d="M5.524 7.482a9.653 9.653 0 016.069 3.757 54.706 54.706 0 014.794 8.644c2.827 4.9 6.489 11.589 3.272 13.247-1.446.745-3.434-.008-5.863-.936l-1.234-2.137a12.686 12.686 0 004.839 1.25c3.144 0-.88-7.648-2.895-11.138l-.842-1.459h-.05q.014 2.552-2.918 2.552a8.361 8.361 0 01-4.863-1.777 14.954 14.954 0 01-4.209-4.773q-1.962-3.4-1.554-5.4a2.317 2.317 0 01.518-1.1 3.251 3.251 0 012.61-.9 11.74 11.74 0 012.326.17zm5.953 7.439l-1.135-1.966A8.56 8.56 0 007.093 9.83a5.254 5.254 0 00-2.2-.718q-2.24-.146-2.5 1.427-.242 1.439 1.254 4.03a11.875 11.875 0 002.556 3.14c1.573 1.341 3.635 2.02 4.932 1.642a1.573 1.573 0 001.158-1.162 4.5 4.5 0 00-.817-3.268zM12.628 4.38a2.176 2.176 0 01-1.161-.391 2.861 2.861 0 01-.958-.99 1.16 1.16 0 01-.188-1 .674.674 0 01.706-.4 2.216 2.216 0 011.184.4 2.888 2.888 0 01.968 1 1.123 1.123 0 01.171.977.687.687 0 01-.722.404zM23.28 21.1h-2.046l-7.7-13.335h2.046zM26.847 7.631a9.654 9.654 0 016.069 3.757 54.727 54.727 0 014.794 8.644c2.827 4.9 6.489 11.589 3.272 13.247-1.446.745-3.435-.008-5.863-.936l-1.234-2.137a12.686 12.686 0 004.839 1.25c3.144 0-.88-7.648-2.895-11.138l-.842-1.458h-.05q.014 2.552-2.918 2.552a8.36 8.36 0 01-4.863-1.777 14.953 14.953 0 01-4.209-4.773q-1.962-3.4-1.554-5.4a2.319 2.319 0 01.518-1.1 3.251 3.251 0 012.61-.9 11.75 11.75 0 012.326.169zM32.8 15.07l-1.135-1.966a8.561 8.561 0 00-3.249-3.125 5.255 5.255 0 00-2.2-.718q-2.24-.146-2.5 1.426-.242 1.439 1.254 4.03a11.874 11.874 0 002.557 3.14c1.573 1.342 3.635 2.02 4.932 1.642a1.574 1.574 0 001.158-1.162 4.5 4.5 0 00-.817-3.267z"
          />

          {/* RUNNING CHARACTER */}
          <Path
            d="M41.601.013c2.515-.342 5.038 6.164 1.669 6.438-2.514.342-5.037-6.164-1.669-6.438zm-1.874 11.61h-3.212c-1.257.171-2.519-3.082-.835-3.219 2.708.08 6.866-.13 9.488-.35l.005-.006a1.8 1.8 0 011.089-1.509c.958-.493 3.727-2.238 4.56-1.463l4.038 2.425c1.258.524 1.643 3.776-.329 2.861-1.215-.551-5.854-3.211-4.909-1.607 4.736 8.036 6.446 6.719 1.68 14.523.272 1.284 4.91 7.218 3.17 8.361-1.807.978-4.525-5.559-5.355-7.056a6.57 6.57 0 01-.25-5.959 2.941 2.941 0 00.279-2.179c-1.093-3.763-5.952-5.005-9.419-4.822zM55.6 19.968l.91.968c1.566.281 5.754-.98 6.11 1.609.231.889-.1 1.61-.75 1.61h-5.033a2.556 2.556 0 01-1.238-4.187z"
            fill={props.color}
            // stroke="#fff"
            // strokeMiterlimit={10}
          />
        </G>
      </G>
    </Svg>
  );
}

const MemoSvgComponent = React.memo(SvgComponent);
export default MemoSvgComponent;
