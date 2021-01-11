import React, { Component } from "react";
import { Text, View, Dimensions } from "react-native";

import styled from "styled-components/native";

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

export default function Prompts() {
  return <Container></Container>;
}

const Container = styled.View`
  position: absolute;
  background-color: red;
  top: 0;
  left: 0;
  height: ${height}px;
  width: ${width}px;
  opacity: 0.6;
`;
