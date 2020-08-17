import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components/native";

import Text from "../../../../components/text";
import Card from "../../../../components/card";

import * as Progress from "react-native-progress";
import { UIOverlayContext } from "../../../../components/context";

// Controllers
import JobsControllers from "../../../../controllers/JobsControllers";

export default function Searching() {
  const { changeRoute } = useContext(UIOverlayContext); // Overlay
  const [progress, setProgress] = useState(0);
  const [loop, setLoop] = useState();
  let isMounted = true;

  useEffect(() => {
    if (isMounted) {
      let value = 0;
      setProgress(value);
      const demo = setInterval(() => {
        value += Math.random() / 10;
        if (value > 1) {
          value = 1;
        }
        setProgress(value);
      }, 200);
      setLoop(demo);
      return;
    }
  }, []);

  useEffect(() => {
    if (progress >= 1) {
      clearInterval(loop);
    }
    if (progress == 1) {
      return changeRoute("jobFound");
    }
  }, [progress]);

  if (isMounted) {
    return (
      <Card>
        <SafeAreaView>
          <Row>
            <Text medium>Searching for nearby jobs</Text>
          </Row>
          <Row>
            <Progress.Bar progress={progress} width={250} />
          </Row>
          <Row>
            <TouchableWithoutFeedback
              onPress={() => {
                clearInterval(loop);
                changeRoute("dashboard");
              }}
            >
              <Text small cancel>
                Cancel
              </Text>
            </TouchableWithoutFeedback>
          </Row>
        </SafeAreaView>
      </Card>
    );
  }
}

const Row = styled.View`
  flex-direction: row;
  justify-content: center;
  padding: 10px 0;
`;
