import { Dimensions } from "react-native";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export const ResponsiveSize = (size) => {
  console.log(size);
  if (deviceHeight > 568 && deviceHeight < 666) {
    return size * 2;
  } else if (deviceHeight > 667 && deviceHeight < 737) {
    return size * 1.17;
  } else if (deviceHeight > 738 && deviceHeight < 1023) {
    return size * 1.29;
  } else if (deviceHeight > 1024) {
    return size * 10.8;
  }
};
