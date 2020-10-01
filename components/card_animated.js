import React, { Component } from "react";
import { Animated, Text, View, StyleSheet, Button, Dimensions, Easing } from "react-native";

export default class Card extends Component {
  state = {
    slideAnim: new Animated.Value(0),
    opacityAnim: new Animated.Value(0),
    initialPosition: null,

    slideInDuration: 800,
    slideOutDuration: 700,
  };

  slideIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    // if (this.state.slideAnim != 0) {
    Animated.timing(this.state.opacityAnim, {
      delay: 0,
      toValue: 1, // same size as border bottom width
      duration: 200,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
    Animated.timing(this.state.slideAnim, {
      delay: 100,
      toValue: 150, // same size as border bottom width
      duration: this.state.slideInDuration,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) this.slideIn();
    });
  };

  slideOut = () => {
    Animated.timing(this.state.slideAnim, {
      delay: 0,
      toValue: this.state.initialPosition + 100, // same size as border bottom width
      duration: this.state.slideOutDuration,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) this.slideOut();
    });
  };

  handleInitialPosition = (layout) => {
    this.setState(
      (state) => ({ slideAnim: new Animated.Value(layout.height), initialPosition: layout.height }),
      () => {
        this.slideIn();
      }
    );
  };

  slideOutTrigger = () => {
    this.slideOut();
  };

  render() {
    return (
      <Animated.View
        onLayout={({ nativeEvent }) => this.handleInitialPosition(nativeEvent.layout)}
        style={{ ...styles.card, opacity: this.state.opacityAnim, transform: [{ translateY: this.state.slideAnim }] }}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    zIndex: 1,
    position: "absolute",
    left: 0,
    bottom: 0,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomColor: "white",
    borderBottomWidth: 150,
    backgroundColor: "white",
    width: Dimensions.get("screen").width,
    paddingBottom: Platform.OS == "ios" ? 40 : 0,
    // transform: Tran,
    // opacity: 0,
    // shadowRadius: 10,
    // shadowColor: "red",
    // shadowOffset: { x: 10, y: 10 },
  },
});
