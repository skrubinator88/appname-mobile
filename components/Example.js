import React, { Component, useState, useEffect } from "react";
import { View, TextInput, SafeAreaView } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

import styled from "styled-components/native";

import { Ionicons } from "@expo/vector-icons";

// Functional
export default function Main() {
  return (
    <Container>
      <SafeAreaView>
        {/* Nav  */}
        <Nav>
          <Ionicons name="md-chevron-back-sharp" size="30" color="#2c8ddd" />

          <Right>
            <Ionicons name="remove-outline" size="38" color="#2c8ddd" />
            <Ionicons name="remove-outline" size="38" color="#3a3856" />
            <Ionicons name="remove-outline" size="38" color="#3a3856" />
          </Right>
        </Nav>

        {/* Sub Title */}
        <SubTitle>Pay a friend</SubTitle>

        <Title>Select the Friend {"\n"}you want to send money.</Title>

        {/* Avatars */}

        {/* Search Bar */}

        {/* Scrolling List */}
      </SafeAreaView>
    </Container>
  );
}

const Container = styled.View`
  background: #2c2d47;
  flex: 1;
  padding: 0 20px;
`;

const Nav = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
const Right = styled.View`
  flex-direction: row;
`;

const SubTitle = styled.Text`
  color: #aaaaaa;
  font-size: 15;
  font-weight: 700;
`;

const Title = styled.Text`
  color: white;
  font-size: 25;
  font-weight: 700;
`;
