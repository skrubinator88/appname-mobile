import React from "react";
import { Circle } from "react-native-maps";

function CustomCircle({ onLayout, ...props }) {
  const ref = React.useRef();

  function onLayoutPolygon() {
    if (ref.current) {
      ref.current.setNativeProps({ fillColor: props.fillColor, strokeColor: props.strokeColor });
    }
    // call onLayout() from the props if you need it
  }

  return <Circle ref={ref} onLayout={onLayoutPolygon} {...props} />;
}

export default Circle;
