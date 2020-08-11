// IMPORT
import React, { useState, useEffect, useContext } from "react";
import { View, Platform, Dimensions, SafeAreaView } from "react-native";
import styled from "styled-components/native";
import config from "../../../../env";
import StarRating from "react-native-star-rating";

// Expo
import { FontAwesome } from "@expo/vector-icons";

// import Card from "../../../../components/card";
import Text from "../../../../components/text";

const deviceHeight = Dimensions.get("window").height;

import { UIOverlayContext } from "../../../../components/context";

const fetchProjectManagerInfo = async (id) => {};

// BODY
export default function JobFound({ navigation, data }) {
  const [jobData] = data;
  const { changeRoute } = useContext(UIOverlayContext);
  const [name, setName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [starRate, setStarRate] = useState(0);
  const [tasks, setTasks] = useState("");
  const [description, setDescription] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await fetch(`${config.API_URL}/users/${jobData.posted_by}`, { method: "GET" });
      const project_manager = await response.json();
      setName(`${project_manager.first_name} ${project_manager.last_name}`);
      setOccupation(project_manager.occupation);
      setStarRate(Number(project_manager.star_rate));

      console.log(data);
      setDescription(jobData.tasks);
    })();
  }, []);

  return (
    <Card>
      <View>
        <ProfilePicture
          source={{
            uri: "https://i.insider.com/5899ffcf6e09a897008b5c04?width=1200",
          }}
        ></ProfilePicture>

        <Row first>
          <Column>
            <Text title bold marginBottom="5px">
              {name}
            </Text>
            <Text small light marginBottom="5px">
              {occupation}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text bold marginBottom="5px">
                <FontAwesome name="map-marker" size={24} color="black" />
              </Text>
              <Text style={{ marginLeft: 10 }} bold>
                13 min
              </Text>
            </View>
          </Column>
          <Column>
            {/* Iterate from array of data pulled from server and render as stars */}
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
              <StarRating disabled={true} maxStars={5} rating={starRate} starSize={25} />
            </View>
            <Text style={{ textAlign: "center" }} bold>
              {starRate}
            </Text>
          </Column>
        </Row>
        <Row>
          <JobDescriptionRow>
            <JobDescription>
              <Text small light marginBottom="5px">
                Job Description
              </Text>
              <Text small marginBottom="5px">
                $34/hr
              </Text>
            </JobDescription>

            {description.map((item, index) => {
              return <Text key={index}>{item}</Text>;
            })}
          </JobDescriptionRow>
        </Row>

        <CardOptionItem row>
          <Text small>Reviews</Text>
        </CardOptionItem>

        <Row last>
          <Column>
            <Button decline onPress={() => changeRoute("dashboard")}>
              <Text style={{ color: "red" }} medium>
                Decline
              </Text>
            </Button>
          </Column>
          <Column>
            <Button accept onPress={() => changeRoute("acceptedJob")}>
              <Text style={{ color: "white" }} medium>
                Accept
              </Text>
            </Button>
          </Column>
        </Row>
      </View>
    </Card>
  );
}

// STYLES

const Card = styled.SafeAreaView`
  position: absolute;
  left: 0;
  bottom: 0;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  box-shadow: -10px 0px 20px #999;
  background: white;
  width: 100%;
`;

const ProfilePicture = styled.Image`
  margin: -35px auto;
  height: 70px;
  width: 70px;
  border-radius: 50px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: ${({ first, last }) => {
    switch (true) {
      case first:
        return "space-between";
      case last:
        return "space-around";
      default:
        return "flex-start";
    }
  }};
  ${({ first }) => {
    switch (true) {
      case first:
        return `
        margin: 4% 0 0 0;
        `;
    }
  }}
  padding: 3% 30px;
  border-bottom-color: #eaeaea;
  border-bottom-width: ${(props) => (props.last ? "0px" : "1px")};
`;

const Column = styled.View`
  flex-direction: column;
`;

const JobDescriptionRow = styled.View`
  flex: 1;
  flex-direction: column;
`;

const CardOptionItem = styled.TouchableOpacity`
  padding: 10px 30px;
  width: 100%;
  border-bottom-color: #eaeaea;
  border-bottom-width: 1px;
`;

const Button = styled.TouchableOpacity`
  ${({ decline, accept, row }) => {
    switch (true) {
      case accept:
        return `
        background: #00a0e5; 
        padding: 10px 40px; 
        border-radius: 8px;
        `;

      case decline:
        return `
        border: 1px solid red; 
        background: white; 
        padding: 10px 40px; 
        border-radius: 8px;
        `;
    }
  }};
`;

const JobDescription = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
