import React, { useState, useEffect } from "react";

import { Image, Button, Alert, TextInput, View } from "react-native";

import { Platform, Dimensions } from "react-native";
import styled from "styled-components/native";
import { FontAwesome, Ionicons, Octicons } from "@expo/vector-icons";

// Components
import Container from "../../../components/headerAndContainer";
import Text from "../../../components/text";
import NewListingModal from "./listingItem";

// Store

export default function PaymentScreen({ navigation }) {
  const [jobs, setJobs] = useState({});

  return (
    <>
      <Container
        navigation={navigation}
        nextTitle="Save"
        color="white"
        title="Job Listings"
        titleWeight="300"
        headerBackground="#3869f3"
        nextProvider="Entypo"
        nextIcon="dots-three-horizontal"
        nextSize={25}
        nextAction={() => {}}
      >
        {/* Modal */}

        {/* Payments Section */}
        <Item>
          <JobItemLink onPress={() => navigation.navigate("Listing Item", jobs)}>
            <JobItemRow>
              <Row>
                <Text small weight="700" color="#1b5cce">
                  NEW JOB POSTING
                </Text>
              </Row>
            </JobItemRow>
          </JobItemLink>
        </Item>

        <JobSection>
          <SectionTitle>
            <View style={{ margin: 10 }}>
              <Text small bold color="#474747">
                UNASSIGNED
              </Text>
            </View>
          </SectionTitle>

          <Item>
            <JobItemLink>
              <JobItemRow>
                <Column>
                  <Row>
                    <Text small weight="700" color="#1b5cce">
                      Job Title
                    </Text>
                    <Text small>Active</Text>
                  </Row>
                  <Row>
                    <Text small>$00/hr</Text>
                  </Row>
                  <Row>
                    <Text small>
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptas omnis possimus praesentium aliquam vel doloremque
                      quam, consequuntur sit libero perferendis delectus non. Nihil enim expedita odit saepe sapiente rerum nam.
                    </Text>
                  </Row>
                </Column>
              </JobItemRow>
            </JobItemLink>
          </Item>

          <SectionTitle>
            <View style={{ margin: 10 }}>
              <Text small bold color="#474747">
                IN PROGRESS
              </Text>
            </View>
          </SectionTitle>
          <Item>
            <JobItemLink>
              <JobItemRow>
                <Column>
                  <Row>
                    <Text small weight="700" color="#1b5cce">
                      Job Title
                    </Text>
                    {/* <Text small>Active</Text> */}
                  </Row>
                  <Row>
                    <Text small>$00/hr</Text>
                  </Row>
                  <Row>
                    <Text small>
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptas omnis possimus praesentium aliquam vel doloremque
                      quam, consequuntur sit libero perferendis delectus non. Nihil enim expedita odit saepe sapiente rerum nam.
                    </Text>
                  </Row>
                </Column>
              </JobItemRow>
            </JobItemLink>
          </Item>
        </JobSection>
      </Container>
    </>
  );
}

// Payments Section
const Item = styled.View`
  flex: 1;
  background: white;
  margin: 10px 0 0 0;
`;

const SectionTitle = styled.View`
  width: 100%;
  padding: 0 5%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const JobSection = styled.View`
  justify-content: center;
  align-items: center;
  margin: 20px 0 0 0;
`;

const JobItemRow = styled.View`
  background: white;
  padding: 10px;
  flex-direction: row;
  width: 100%;
  border: 1px solid #f5f5f5;
`;

const JobItemLink = (props) => (
  <Setup {...props} activeOpacity={0.6}>
    {props.children}
  </Setup>
);
const Setup = styled.TouchableOpacity`
  flex-direction: row;
`;

const Column = styled.View`
  flex: 1;
  flex-direction: column;
`;

const Row = styled.View`
  flex: 1;
  padding: 0px 5%;
  flex-direction: row;
  justify-content: space-between;
`;
