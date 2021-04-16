import React, { useCallback, useState, useEffect } from "react";
import { getStatusBarHeight } from "react-native-status-bar-height";

import { Platform, SafeAreaView, Dimensions, View, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import styled from "styled-components/native";
import * as VectorIcons from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const isIos = Platform.OS === "ios";
const height = Dimensions.get("window").height;
const SPACER_SIZE = height / 2; //arbitrary size
const statusBarHeight = getStatusBarHeight();

export default function Header({
  // Navigation
  navigation, // @Required

  // General Settings
  flexible = true,
  headerBackground = "transparent",
  bottomBackground = "transparent",
  containerBackground = "#f5f5f5",
  loadingContent = false,
  disableContainer = false,
  children, // @required

  // Bar Properties
  titleWeight = "700",
  titleColor = "white",
  title = "",

  // Back Button Properties
  backProvider = "",
  backIcon = "",
  backTitle = "",
  backSize = 30,
  backColor = "",
  backAction = "",

  // Next Button Properties
  nextProvider = "",
  nextIcon = "",
  nextTitle = "",
  nextSize = 30,
  nextColor = "",
  nextAction = () => { },

  // Refresh Handler
  enableRefreshFeedback = false,
  refreshingProperties = { tintColor: "grey" },
}) {
  // @Required
  if (!navigation) throw Error("navigation: Navigation is Required");
  if (nextTitle && !nextAction) throw Error("nextAction: Action is Required");

  function handleIcons(provider, properties) {
    const Component = VectorIcons[`${provider}`];
    return <Component {...properties} />;
  }

  function handleBackButton() {
    if (backTitle) return backTitle;

    if (backIcon) {
      return handleIcons(backProvider, {
        name: backIcon,
        size: backSize,
        color: backColor || titleColor,
      });
    } else {
      return handleIcons("AntDesign", {
        name: "arrowleft",
        size: backSize,
        color: backColor || titleColor,
      });
    }
  }

  function handleNextButton() {
    if (nextIcon) {
      return handleIcons(nextProvider, {
        name: nextIcon,
        size: nextSize,
        color: nextColor || titleColor,
      });
    } else if (nextTitle) {
      return nextTitle;
    } else {
      return "";
    }
  }

  function handleBackAction() {
    if (backTitle == " ") {
      return "";
    } else {
      return navigation.goBack();
    }
  }

  useEffect(() => {
    return () => { };
  }, []);

  // Structure
  return (
    <>
      <ScrollView
        bounces={flexible}
        scrollEnabled={flexible}
        contentInset={{
          // top: -SPACER_SIZE + statusBarHeight,
          bottom: -SPACER_SIZE + statusBarHeight,
        }}
        // contentOffset={{ y: SPACER_SIZE - statusBarHeight }}
        style={{ backgroundColor: headerBackground, flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={enableRefreshFeedback ? <RefreshControl {...refreshingProperties} /> : null}
      >
        <View
          style={{
            backgroundColor: containerBackground,
            flex: 1,
            // elevation: 10,
            // shadowColor: "black",
            // shadowOpacity: 0.4,
            // shadowRadius: 7,
            // shadowOffset: {
            //   width: 5,
            //   height: 50,
            // },
          }}
        >
          <SafeAreaView style={{ backgroundColor: headerBackground }}>
            <Container>
              <Column back>
                <Text style={{ color: backColor || titleColor }} onPress={backAction != "" ? backAction : () => handleBackAction()}>
                  {handleBackButton()}
                </Text>
              </Column>

              <Column middle>
                {typeof title == "string" ? (
                  <TitleTextBox style={{ color: titleColor, fontWeight: titleWeight }}>{title}</TitleTextBox>
                ) : (
                    <Row>{title()}</Row>
                  )}
              </Column>

              <Column next>
                <Text style={{ color: nextColor || titleColor, fontWeight: "700" }} onPress={nextAction}>
                  {handleNextButton()}
                </Text>
              </Column>
            </Container>
          </SafeAreaView>

          {/* Children */}
          {!disableContainer && children}
        </View>
      </ScrollView>

      {loadingContent && (
        <Loader>
          <ActivityIndicator color="white" size={20} />
        </Loader>
      )}
    </>
  );
}

const Loader = styled.View`
  position: absolute;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

// Styles
const Container = styled.View`
  /* flex: 1; */
  margin-top: ${Platform.OS == "android" ? `${statusBarHeight}px` : "0px"};
  padding: 10px;
  flex-direction: row;
`;

const Column = styled.View`
  ${({ back, middle, next }) => {
    switch (true) {
      case back:
        return "flex: 1";
      case middle:
        return "flex: 2";
      case next:
        return "flex: 1";
    }
  }};
  justify-content: center;
  align-items: center;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const TitleTextBox = styled.Text`
  font-size: 23px;
  font-weight: 700;
`;

const Text = styled.Text`
  font-size: 17px;
  font-weight: 600;
`;
