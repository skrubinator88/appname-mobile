import React, { Component } from "react";

import {
  Text,
  Image,
  Button,
  Alert
} from "react-native";
import styled from "styled-components/native";

class contractorApp extends Component {
  SignIn = () => {
    Alert.alert("AQUI VA AXIOS");
  };

  render() {
    return (
      <Container>
        <ContainerLogo>
          <Image source={require("./assets/cheems2.jpg")} />
        </ContainerLogo>
        <ContainerLogin>
          <ContainerLoginLeft>
          <Button title={"Sign In"} onPress={this.SignIn} />
          </ContainerLoginLeft>
          <ContainerLoginRight>
          <Text>
              New user?{"  "}
              <TextSyled onPress={this.SignIn}>Register</TextSyled>
            </Text>
          </ContainerLoginRight>
        </ContainerLogin>
      </Container>
    );
  }
}

const Container = styled.View`
  flex: 1;
`;

const ContainerLogo = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: red;
`;

const ContainerLogin = styled.View`
  flex: 0.2;
  align-items: center;
  justify-content: center;
  background-color: white;
  flex-direction: row;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const ContainerLoginLeft = styled.View`
  flex: 1;
  margin-left:30px;
`;

const ContainerLoginRight = styled.View`
  flex: 1;
  margin-left:30px;
`;


const TextSyled = styled.Text`
font-weight: bold;
color: #2680eb;
`;


export default contractorApp;
