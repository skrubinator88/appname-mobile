import React, { useState, useEffect, useContext } from "react";
import { View, Text, Button } from "react-native";
import styled from "styled-components/native";
import { AuthContext } from "../../components/context";

export default function HomeScreen() {
  const { signIn } = useContext(AuthContext);

  return (
    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      <Button title="Sign In" onPress={() => signIn()}></Button>
    </View>
  );
}
