import { useMemo } from 'react';
import { Text, type TextProps, StyleSheet, Platform, View } from 'react-native';
import  Svg, { Circle, G, Path } from 'react-native-svg';
import { ShapeColor, ShapeType } from './enums';

export type ShapeProps = {
  state: "default" | "selected" | "paired";
  type: ShapeType;
  color: ShapeColor;
  size?: number;
};

export function Shape(props: ShapeProps) {
  const BASE_SIZE = 80;
  const size = props.size || BASE_SIZE;
  const scale = size / BASE_SIZE;

  const SELECTED_COLOR = "#FFFBDB";
  const SHAPE_COLORS = {
    [ShapeColor.Red]: "#D40004",
    [ShapeColor.Green]: "#00D400",
    [ShapeColor.Blue]: "#006AD4",
    [ShapeColor.Yellow]: "#D4AA00",
  };

  const fill = useMemo(() => {
    return SHAPE_COLORS[props.color];
  }, [props.color]);

  const fillOpacity = useMemo(() => {
    switch (props.state) {
      case "default": return 1;
      case "selected": return 1;
      case "paired": return 0.5;
    }
  }, [props.state]);

  const stroke = useMemo(() => {
      if (props.state === "selected") {
        return SELECTED_COLOR;
      }

      return SHAPE_COLORS[props.color];
    }, [props.state, props.color]);

    const strokeOpacity = useMemo(() => {
      switch (props.state) {
        case "default": return 0.15;
        case "selected": return 1;
        case "paired": return 1;
      }
    }, [props.state]);

  return (
    <Svg width={size} height={size}>
      <G transform={`scale(${scale})`}>
        {props.type === ShapeType.Square && (
          <Path
            d="M20.8 8H59.2C62.5948 8 65.8505 9.34857 68.251 11.749C70.6514 14.1495 72 17.4052 72 20.8V59.2C72 62.5948 70.6514 65.8505 68.251 68.251C65.8505 70.6514 62.5948 72 59.2 72H20.8C17.4052 72 14.1495 70.6514 11.749 68.251C9.34857 65.8505 8 62.5948 8 59.2V20.8C8 17.4052 9.34857 14.1495 11.749 11.749C14.1495 9.34857 17.4052 8 20.8 8Z"
            fill={fill} fillOpacity={fillOpacity}
            stroke={stroke} strokeOpacity={strokeOpacity} strokeWidth="8"
          />
        )}
        {props.type === ShapeType.Cross && (
          <Path
            d="M54.4977 39.987L68.9992 25.5003C73.0003 21.5075 73.0003 15.0066 68.9992 11.0138C64.9931 6.9954 58.5013 6.9954 54.4977 11.0138L39.9988 25.5003L25.4998 11.0138C21.4987 6.9954 15.0069 6.9954 11.0008 11.0138C6.99974 15.0066 6.99974 21.5075 11.0008 25.5003L25.4998 39.987L11.0008 54.4994C6.99974 58.4922 6.99974 64.9934 11.0008 68.9862C15.0069 73.0046 21.4987 73.0046 25.4998 68.9862L39.9988 54.4994L54.4977 68.9862C58.5013 73.0046 64.9931 73.0046 68.9992 68.9862C73.0003 64.9934 73.0003 58.4922 68.9992 54.4994L54.4977 39.987Z"
            fill={fill} fillOpacity={fillOpacity}
            stroke={stroke} strokeOpacity={strokeOpacity} strokeWidth="8"
          />
        )}
        {props.type === ShapeType.Triangle && (
          <Path
            d="M29.11 10.8252L28.9884 11.0511L28.9791 11.0752L5.6539 55.31L5.65042 55.3166L5.64696 55.3232L5.62219 55.3706L5.61276 55.3887L5.60352 55.4068C4.81462 56.9547 4.31078 58.6443 4.10546 60.3784C3.90013 62.1126 3.99491 63.8773 4.38745 65.5769C4.77998 67.2765 5.46712 68.8966 6.42927 70.3392L9.75698 68.1197L6.42927 70.3392C7.3901 71.7797 8.61401 73.0256 10.0526 73.9793C11.9666 75.2577 14.184 75.9706 16.4869 75.9997L16.5122 76H16.5374H63.4662H63.494L63.5218 75.9996C65.8278 75.9676 68.0472 75.2476 69.9593 73.9666C71.8656 72.6895 73.3882 70.9101 74.4298 68.8526L74.4358 68.8407C75.4763 66.7682 76.0058 64.4518 75.9999 62.1206C75.9941 59.7894 75.4529 57.4759 74.4013 55.4092L74.3882 55.3833L74.3746 55.3576L50.9226 10.8753L50.8354 10.7099L50.8099 10.6709C49.7437 8.73458 48.238 7.07229 46.3835 5.88413C44.4709 4.6588 42.2676 3.99185 39.9914 4.00008C37.7239 4.00369 35.5309 4.67346 33.6252 5.89441L35.723 9.16884L33.6251 5.89441C31.7235 7.11277 30.186 8.82737 29.11 10.8252Z"
            fill={fill} fillOpacity={fillOpacity}
            stroke={stroke} strokeOpacity={strokeOpacity} strokeWidth="8"
          />
        )}
        {props.type === ShapeType.Circle && (
          <Circle
            cx="40" cy="40" r="32"
            fill={fill} fillOpacity={fillOpacity}
            stroke={stroke} strokeOpacity={strokeOpacity} strokeWidth="8"
          />
        )}
      </G>
    </Svg>
    );
}

const styles = StyleSheet.create({});
