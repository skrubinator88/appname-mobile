import React, { useContext } from "react";
import { Image, Alert, Dimensions } from "react-native";
import styled from "styled-components/native";
import { useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const width = Dimensions.get("screen").width;

export function RootScreen({ navigation }) {
  const { colors } = useTheme();

  return (
    <Container>
      {/* <ContainerLogo>
        <Image source={require("../../../assets/rootWallpaper.jpg")} />
      </ContainerLogo> */}
      <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} colors={["#54bac2", "#d3f3cd", "#51a5ab"]} style={{ flex: 1 }}>
        <ContainerLogin>
          <Logo>
            <Image
              style={{
                width: width - 50,
                resizeMode: "contain",
              }}
              source={require("../../../assets/logo.png")}
            />
          </Logo>

          <UI>
            <ContainerLoginLeft>
              <Button onPress={() => navigation.navigate("SignIn")} style={{ backgroundColor: colors.primary }}>
                <Text style={{ color: "white" }}>Sign In</Text>
              </Button>
            </ContainerLoginLeft>
            <ContainerLoginRight>
              <Text small>
                New user?{"  "}
                <TextStyled
                  onPress={() => {
                    navigation.navigate("SignUpIndex");
                  }}
                  style={{ color: colors.primary }}
                >
                  Register
                </TextStyled>
              </Text>
            </ContainerLoginRight>
          </UI>
        </ContainerLogin>
      </LinearGradient>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
`;

const Text = styled.Text`
  ${({ small }) => {
    switch (true) {
      case small:
        return `font-size: 15px`;

      default:
        return `font-size: 20px`;
    }
  }}
`;

const Button = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  padding: 10px 0;
`;

const ContainerLogo = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const ContainerLogin = styled.View`
  flex: 1;
  justify-content: flex-end;
`;

const UI = styled.View`
  align-items: center;
  justify-content: flex-end;
  background-color: white;
  flex-direction: row;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  /* padding: 60px 0; */
  flex: 0.17;
`;

const Logo = styled.View`
  flex: 0.83;
  align-items: center;
  justify-content: center;
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
`;
