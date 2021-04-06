import React, { useRef, useEffect, useState } from "react";
import { Platform } from "react-native";
import { Animated, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import styled from "styled-components/native";

export default function Card(props) {
  // const opacity = useRef(new Animated.Value(0)).current;

  const slideAnim = useRef(new Animated.Value(0)).current;
  const animatedBox = useRef().current;
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (animate) {
      Animated.timing(slideAnim, { toValue: 0, duration: 300 }, { useNativeDriver: true }).start();
    }
  }, [slideAnim, animate]);

  function definePosition(layout) {
    slideAnim.setValue(layout.height);
    setAnimate(true);
  }

  return (
    <Animated.View
      onLayout={({ nativeEvent }) => definePosition(nativeEvent.layout)}
      style={{ ...styles.card, transform: [{ translateY: slideAnim }] }}
    >
      {props.children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    zIndex: 1,
    position: "absolute",
    left: 0,
    bottom: 0,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: "white",
    width: Dimensions.get("screen").width,
  },
});

const View = styled.View``;
