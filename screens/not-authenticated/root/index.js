import React, { useContext } from "react";
import { Image, Alert } from "react-native";
import styled from "styled-components/native";

// Store
import { AuthContext } from "../../../components/context";

export function RootScreen({ navigation }) {
  const authContext = useContext(AuthContext);

  return (
    <Container>
      <ContainerLogo>
        <Image source={require("../../../assets/rootWallpaper.jpg")} />
      </ContainerLogo>
      <ContainerLogin>
        <ContainerLoginLeft>
          <Button onPress={() => navigation.navigate("SignIn")}>
            <Text style={{ color: "white" }}>Sign In</Text>
          </Button>
        </ContainerLoginLeft>
        <ContainerLoginRight>
          <Text small>
            New user?{"  "}
            <TextStyled onPress={() => {}}>Register</TextStyled>
          </Text>
        </ContainerLoginRight>
      </ContainerLogin>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
`;

const Text = styled.Text`
  /* font-size: ${() => (Platform.OS == "ios" ? "23px" : "17px")}; */
  ${({ small }) => {
    // iPhone 5, 6 SE
    // Small Android phones

    switch (true) {
      case small:
        return `font-size: ${Platform.OS == "ios" ? 20 : 14}px`;

      default:
        return `font-size: ${Platform.OS == "ios" ? 23 : 17}px`;
    }
  }}
`;

const Button = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  padding: 10px 0;
  background-color: #548ff7;
`;

const ContainerLogo = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  /* background-color: red; */
`;

const ContainerLogin = styled.View`
  flex: 0.2;
  align-items: center;
  justify-content: center;
  background-color: white;
  flex-direction: row;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
`;

const ContainerLoginLeft = styled.View`
  flex: 1;
  padding: 0 20px;
`;

const ContainerLoginRight = styled.View`
  padding: 0 30px 0 0;
`;

const TextStyled = styled.Text`
  font-weight: bold;
  color: #2680eb;
`;