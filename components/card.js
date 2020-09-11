import React from "react";
import { SafeAreaView } from "react-native";
import styled from "styled-components/native";

export default function Card(props) {
  return (
    <View>
      <SafeAreaView style={{ flex: 1 }}>{props.children}</SafeAreaView>
    </View>
  );
}

const View = styled.View`
  z-index: 1;
  padding: 5%;
  position: absolute;
  left: 0;
  bottom: 0;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  background: white;
  width: 100%;

  box-shadow: 0px 10px 10px black;
`;
