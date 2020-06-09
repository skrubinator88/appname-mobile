import { Dimensions } from "react-native";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export const ResponsiveSize = (size) => {
  if (deviceHeight >= 568 && deviceHeight < 667) {
    return size * 2;
  } else if (deviceHeight >= 667 && deviceHeight < 736) {
    return size * 1.17;
  } else if (deviceHeight > 736 && deviceHeight < 1024) {
    return size * 1.29;
  } else if (deviceHeight === 1024) {
    return size * 1.8;
  }
};