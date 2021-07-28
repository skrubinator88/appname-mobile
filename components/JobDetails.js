import { FontAwesome } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FlatList, Switch, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import Text from "../components/text";
import GigChaserJobWord from "../assets/gig-logo";
import Header from "../components/headerAndContainer";
import env from "../env";
import PhotoItem from "../screens/authenticated/listings/listItemImage";
import { CurrencyFormatter } from "../screens/authenticated/payment/components";
import { StatusBar } from "react-native";

export const getPriorityColor = (priority) => {
  switch (priority) {
    case "high0":
      return "firebrick";
    case "medium0":
      return "darkorange";
    case "low0":
      return "mediumblue";
    default:
      return "#222";
  }
};
export const priorityMap = {
  high0: "High (15 mins)",
  medium0: "Medium (1 hour)",
  low0: "Low (1 hour 30 mins)",
};

export function JobDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { params } = route;

  // - - State - -
  const [selected_job_type, setSelectedJobType] = useState(""); // Input Field
  const [job_title, setJobTitle] = useState(""); // Input Field
  const [location, setLocation] = useState(""); // Input Field
  const [salary, setSalary] = useState(""); // Input Field
  const [tasks, setTasks] = useState([]); // Input Field (With Modal)

  // Setup datetime picker
  const [date, setDate] = useState(new Date());
  const [priority, setPriority] = useState("");

  // Setup job photo selection
  const [photos, setPhotos] = useState([]);
  const [inAppPayment, setInAppPayment] = useState(true);
  const [scanQRCodeRequired, setScanQRCodeRequired] = useState(true);

  useEffect(() => {
    setSelectedJobType(params.data.job_type);
    setJobTitle(params.data.job_title);
    setLocation(params.data.location);
    setSalary(params.data.offer_received?.approved ? params.data.offer_received.offer : params.data.salary);
    setTasks(params.data.tasks);
    setPriority(params.data.priority);
    setLocation(params.data.location);
    setScanQRCodeRequired(params.data.scanQR);
    setInAppPayment(params.data.inAppPayment);

    if (params.data.start_at) {
      setDate(moment.unix(parseInt(params.data.start_at) / 1000).toDate());
    }
    if (params.data.photo_files != null) {
      const formattedPhotos = params.data.photo_files.map((item) => {
        return { type: "image/png", uri: `${env.API_URL}/job/${params.data.id}/${item}` };
      });
      setPhotos(formattedPhotos);
    }
  }, [params?.data]);

  if (!params.data) return <></>

  return (
    <>
      <StatusBar barStyle='dark-content' />
      <Container
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <Header
          disableContainer={true}
          navigation={navigation}
          backColor="black"
          title={() => (
            <>
              <GigChaserJobWord color="black" width="60px" height="30px" style={{ marginHorizontal: 10 }} />
              <Text style={{ color: "black", fontWeight: "300", fontSize: 23 }}>Details</Text>
            </>
          )}
          backAction={() => {
            navigation.goBack();
          }}
        />
        <Fields>
          <Item>
            <InputTitle style={{ marginBottom: 12 }}>
              <GigChaserJobWord color="#444" width="60px" height="20px" />
              <Text small bold color="#444">TYPE</Text>
            </InputTitle>
            <Text small>{selected_job_type}</Text>
          </Item>

          <Item>
            <InputTitle>
              <GigChaserJobWord color="#444" width="60px" height="20px" />
              <Text small bold color="#444">TITLE</Text>
            </InputTitle>
            <Text small>{job_title}</Text>
          </Item>

          <Item>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome color='grey' name='money' size={20} />
              <Text style={{ fontWeight: "bold", color: "#444", marginStart: 8 }} small bold>SALARY</Text>
            </View>
            <Text>{CurrencyFormatter.format(salary ?? 0)}/deployment</Text>
          </Item>

          {(!!tasks && tasks.length > 0) && (
            <Item>
              <Text style={{ fontWeight: "bold", color: "#444" }} small>TASKS</Text>
              <Tasks>
                <FlatList
                  style={{ marginVertical: 10, paddingVertical: 10 }}
                  data={tasks}
                  bounces={false}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => <Text small>- {item.text}</Text>}
                />
              </Tasks>
            </Item>
          )}

          {!!location.address &&
            <Item style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome color='grey' name='map-marker' size={20} />
              <Text style={{ marginStart: 8 }} small bold>{location?.address}</Text>
            </Item>
          }

          {
            !!priority && (
              <Item style={{ marginVertical: 12 }}>
                <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                  <Text style={{ fontWeight: "bold", color: "grey", alignItems: "center" }}>PRIORITY</Text>
                  <FontAwesome name="circle" color={getPriorityColor(priority)} style={{ marginStart: 12, fontSize: 16 }} />
                  <Text small textTransform="uppercase">
                    {priorityMap?.[priority] || "none"}
                  </Text>
                </View>
              </Item>
            )
          }

          <View style={{ justifyContent: 'space-between', marginVertical: 4, marginVertical: 4, alignItems: 'center', flexDirection: 'row' }}>
            <Text textTransform='uppercase' style={{ marginBottom: 4, fontWeight: "bold", color: "grey" }}>QR Code Scan Required</Text>
            <Switch value={scanQRCodeRequired} trackColor={{ true: '#4a89f2' }} disabled />
          </View>
          <View style={{ justifyContent: 'space-between', marginVertical: 4, alignItems: 'center', flexDirection: 'row' }}>
            <Text textTransform='uppercase' style={{ marginBottom: 4, fontWeight: "bold", color: "grey" }}>in-app payment</Text>
            <Switch value={inAppPayment} trackColor={{ true: '#4a89f2' }} disabled />
          </View>

          {
            (!!photos && photos.length > 0) && (
              <Item style={{ marginVertical: 4 }}>
                <InputTitle style={{ justifyContent: "center" }}>
                  <GigChaserJobWord color="#444" width="60px" height="20px" />
                  <Text small bold color="#444">
                    PHOTOS
                  </Text>
                </InputTitle>

                <FlatList
                  data={photos}
                  keyExtractor={(v) => v.uri}
                  centerContent
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingVertical: 40, justifyContent: "center", paddingTop: 12, flexGrow: 1 }}
                  renderItem={({ item }) => <PhotoItem item={item} />}
                />
              </Item>
            )
          }

          <Item>
            <InputTitle style={{ justifyContent: "center" }}>
              <Text style={{ color: "#444", textAlign: "center", marginTop: 8, textTransform: "uppercase" }}>
                <GigChaserJobWord color="#444" width="60px" height="20px" /> will be started{" "}
                {date.getTime() <= Date.now() + 5000 ? "immediately" : moment(date).calendar()}
              </Text>
            </InputTitle>
          </Item>
        </Fields >
      </Container>
    </>
  );
}



const Task = styled.View`
      flex-direction: row;
      justify-content: space-between;
      padding: 2px 10px;
      border-radius: 3px;
      margin-bottom: 10px;
      `;


const Fields = styled.View`
      flex: 1;
      margin: 0 20px 20px 20px;
      `;

const Item = styled.View`
      margin: 16px 0;
      `;

const InputTitle = styled.View`
      flex-direction: row;
      align-items: center;
      `;

const ScheduleButton = styled.View`
      padding: 10px;
      background: #fff;
      border-radius: 6px;
      `;

const Tasks = styled.View`
      min-height: 40px;
      padding: 0 20px;
      `;

const Container = styled.ScrollView`
      flex: 1;
      `;