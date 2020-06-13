// IMPORT
import React, { useState, useEffect, useContext } from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";

import { AuthContext } from "../../components/context";

export default function HomeScreen() {
  return (
    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      <Text>Home Screen</Text>
    </View>
  );
}
