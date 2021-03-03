import React, { useState, useEffect } from "react";
import { Image, Dimensions, SafeAreaView, View, ActivityIndicator, Alert } from "react-native";
import env from "../../../env";
import theme from "../../../theme.json";

// Expo API
import * as WebBrowser from "expo-web-browser";

// Styling
import styled from "styled-components/native";
import { Octicons, MaterialIcons, Entypo } from "react-native-vector-icons";

// Miscellaneous
const width = Dimensions.get("screen").width;

// Components
import Text from "../../../components/text";
import Container from "../../../components/headerAndContainer";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default function BackgroundCheckPricing({ navigation, route }) {
  const [packages_info, setPackagesInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch packages prices and info
  useEffect(() => {
    (async () => {
      const response = await fetch(`${env.API_URL}/background_check/packages`);
      const { data } = await response.json();
      setPackagesInfo(data);
      setLoading(false);
    })();
  }, []);

  // Functions
  const renderIconByTier = (tier) => {
    switch (tier) {
      case "Tasker Standard":
        return <MaterialIcons name="add-task" size={width * 0.4} color={theme.contractor.primary} />;
      case "Tasker Pro":
        return <MaterialIcons name="add-task" size={width * 0.4} color={"#f7c72a"} />;
      case "Driver Standard":
        return <Entypo name="v-card" size={width * 0.4} color={theme.contractor.primary} />;
      case "Driver Pro":
        return <Entypo name="v-card" size={width * 0.4} color={"#f7c72a"} />;
    }
  };

  const openLink = async (url, tier_name) => {
    Alert.alert(
      `You choose: \n"${tier_name}"`,
      `\nThis will open the browser. \nYou will fill your application under the "${tier_name}" package`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Accept",
          onPress: async () => {
            let result = await WebBrowser.openBrowserAsync(url, { controlsColor: theme.contractor.primary });
            console.log(result);
          },
        },
      ],
      { cancelable: false }
    );
  };

  // Render screen for user feedback depending in the report status
  const conditionalRendering = () => {
    switch (status) {
      case "pending": {
      }

      case "consider": {
      }

      case "clear": {
      }

      default: {
      }
    }
  };

  return (
    <Container
      navigation={navigation}
      headerBackground={theme.contractor.primary}
      backColor="white"
      color="white"
      title="Tier List"
      loadingContent={loading}
    >
      {packages_info.map((checkr_package) => {
        let dollars = String(Math.ceil(checkr_package.price * 1.15)).slice(0, -2);
        let cents = String(Math.ceil(checkr_package.price * 1.15)).slice(-2);

        return (
          <TouchableWithoutFeedback onPress={() => openLink(checkr_package.apply_url, checkr_package.name)} key={checkr_package.name}>
            <Card>
              <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <Text title bold>
                  {checkr_package.name}
                </Text>
                <Text title>
                  ${dollars}.{cents}
                </Text>
              </View>
              <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", marginVertical: 10 }}>
                {renderIconByTier(checkr_package.name)}
              </View>

              <View medium style={{ padding: 10 }}>
                {checkr_package.screenings.map(({ type }, index) => {
                  const bullet_point = (type.charAt(0).toUpperCase() + type.slice(1)).replace(/_/g, " ");
                  const extraInfoForProPackages = type.includes("county") && checkr_package.name.includes("Pro") && "(All Counties)";

                  return (
                    <Text small key={index}>
                      <Octicons name="primitive-dot" size={10} /> {bullet_point}
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
  padding: 25px 15px;
  margin: 10px;
  border-radius: 10px;
  elevation: 10;
`;
