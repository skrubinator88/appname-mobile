import React, { useState, useEffect } from "react";
import { Image, Dimensions, SafeAreaView, View } from "react-native";
import env from "../../../env";
import theme from "../../../theme.json";

// Expo API
import * as WebBrowser from "expo-web-browser";

// Styling
import styled from "styled-components/native";

// Miscellaneous
const width = Dimensions.get("screen").width;

// Components
import Text from "../../../components/text";
import Container from "../../../components/headerAndContainer";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default function BackgroundCheckPricing({ navigation, route }) {
  const [packages_info, setPackagesInfo] = useState([]);

  // Fetch packages prices and info
  useEffect(() => {
    (async () => {
      const response = await fetch(`${env.API_URL}/background_check/packages`);
      const { data } = await response.json();
      setPackagesInfo(data);
    })();
  }, []);

  return (
    <Container navigation={navigation} headerBackground={theme.contractor.primary} backColor="white">
      {packages_info.map((checkr_package) => {
        let dollars = String(Math.ceil(checkr_package.price * 1.15)).slice(0, -2);
        let cents = String(Math.ceil(checkr_package.price * 1.15)).slice(-2);

        return (
          <TouchableWithoutFeedback onPress={() => openLink(checkr_package.apply_url)} key={checkr_package.name}>
            <Card>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text title bold>
                  {checkr_package.name}
                </Text>
                <Text title>
                  ${dollars}.{cents}
                </Text>
              </View>
              <View medium style={{ padding: 10 }}>
                {checkr_package.screenings.map(({ type }, index) => {
                  const bullet_point = (type.charAt(0).toUpperCase() + type.slice(1)).replace(/_/g, " ");
                  const extraInfoForProPackages = type.includes("county") && checkr_package.name.includes("Pro") && "(All Counties)";

                  return (
                    <Text small key={index}>
                      - {bullet_point}
                      <Text bold> {extraInfoForProPackages}</Text>
                    </Text>
                  );
                })}
              </View>
            </Card>
          </TouchableWithoutFeedback>
        );
      })}
    </Container>
  );
}

const ButtonStyled = styled.TouchableOpacity`
  padding: 15px;
  width: 80%;
  border-radius: 6px;
  border: 1px solid;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
`;

const Card = styled.View`
  box-shadow: 0px 0px 4px #ddd;
  background: white;
  padding: 10px;
  margin: 10px;
  border-radius: 10px;
  elevation: 10;
`;
