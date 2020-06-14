import React, { Component } from "react";

import { View, StyleSheet, Image } from "react-native";
import styled from "styled-components/native";

class contractorApp extends Component {
  render() {
    return (
      <Container>
        <Logo source={require("./assets/cheems.png")} />
      </Container>
    );
  }
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.Image`
  width: 100px;
  height: 100px;
`;

export default contractorApp;
