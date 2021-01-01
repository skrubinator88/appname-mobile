// Dependencies React
import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
  Platform,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image
} from "react-native";

import Lightbox from "react-native-lightbox";
import { launchImageLibraryAsync, MediaTypeOptions, requestCameraRollPermissionsAsync } from 'expo-image-picker'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'

// Styling Dependencies
import { TextField } from "react-native-material-textfield";
import styled from "styled-components/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// Config

// Components
import Header from "../../../components/header";
import Text from "../../../components/text";
import TaskModal from "./taskModal";

// Controllers
import JobsController from "../../../controllers/JobsControllers";
import GoogleServicesController from "../../../controllers/GoogleServicesController";
import PermissionsControllers from "../../../controllers/PermissionsControllers";

// Context
import { GlobalContext } from "../../../components/context";
import { Alert } from "react-native";
import PhotoItem from "./listItemImage";
import { debounce } from "lodash";

// Miscellaneous
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function workModal({ navigation, route }) {
  // - - Constructor - -
  const { authState } = useContext(GlobalContext);

  // - - State - -
  const [job_type, setJobType] = useState(""); // Input Field
  const [job_title, setJobTitle] = useState(""); // Input Field
  const [location, setLocation] = useState(""); // Input Field
  const [salary, setSalary] = useState(""); // Input Field
  const [wage, setWage] = useState("hr"); // Input Field
  const [tasks, setTasks] = useState(""); // Input Field (With Modal)

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [suggestionsEditing, setSuggestionsEditing] = useState(false);
  const [googleSuggestions, setGoogleSuggestions] = useState([]);

  // Setup datetime picker
  const [date, setDate] = useState(new Date())
  const [mode, setMode] = useState(Platform.OS === 'ios' ? 'datetime' : 'date')
  const [showDate, setShowDate] = useState(false)

  let debouncer

  const updateDate = async (e, dateParam) => {
    if (dateParam) {

      // Set the date picker mode based on platform
      switch (mode) {
        case 'datetime':
          if (debouncer) {
            debouncer.cancel()
          }
          if (Platform.OS === 'ios') {
            setDate(dateParam)
          }
          // This is called for only iOS, so set debouncer to delay removing the time modal.
          // TODO: Test how to add a button instead of this
          debouncer = debounce(() => {
            setShowDate(false)
            debouncer = undefined
          }, 3000)
          break
        case 'date':
          setShowDate(() => {
            // After collecting date data, get the time
            if (Platform.OS !== 'ios') {
              setMode('time')
              setDate(dateParam)
            }
            return true
          })
          break
        case 'time':
          // Todo: test on Android
          setShowDate(() => {
            setDate(dateParam)
            return false
          })
          break
      }
    } else {
      setShowDate(false)
    }
  }

  const onShowDate = useCallback(() => {
    setShowDate(() => {
      // Set the date picker mode based on platform
      if (Platform.OS === 'ios') {
        setMode('datetime')
      } else {
        setMode('date')
      }
      return true
    })
  }, [showDate])

  // Setup job photo selection
  const [photos, setPhotos] = useState([])
  const [loadingMedia, setloadingMedia] = useState(false)

  const getPhoto = useCallback(async () => {
    try {
      setloadingMedia(true)
      if (Platform.OS === 'ios') {
        let perms = await requestCameraRollPermissionsAsync()
        if (!perms.granted) {
          Alert.alert('Access to media library denied', 'You need to grant access to image library to continue')
          setloadingMedia(false)
          return
        }
      }
      let res = await launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        mediaTypes: MediaTypeOptions.Images
      })

      if (!res.cancelled && !photos.find(v => v.uri === res.uri)) {
        setPhotos([{ uri: res.uri, type: 'image/png', height: res.height, width: res.width }, ...photos,])
      }
    } catch (e) {
      console.log(e)
      Alert.alert(e.message)
    } finally {
      setloadingMedia(false)
    }
  }, [photos])

  // - - Refs - -
  let scroll = useRef(null);
  let location_address_ref = useRef(null);

  // - - Extra Setup - -
  const form = { job_type, job_title, tasks, location, salary, wage, date };

  // - - Life Cycles - -
  // Create session for google suggestions (This will reduce billing expenses)
  // useEffect(() => {
  //   GoogleServicesController.createSession();
  //   return () => {
  //     GoogleServicesController.clean();
  //     setShowModal(false);
  //   };
  // }, []);

  // Fetch suggestions
  // useEffect(() => {
  //   (async () => {
  //     if (location?.address != undefined) {
  //       setGoogleSuggestions(await GoogleServicesController.getPlacesSuggestions(location.address));
  //     } else {
  //       setGoogleSuggestions([]);
  //     }
  //   })();
  // }, [location]);

  // Get location
  useEffect(() => {
    PermissionsControllers.getLocation().then((position) => setLocation(position));
  }, []);

  // - - Functions (Handler, Events, more) - -
  function commonInputProps(elementValue, setElementValue) {
    return {
      onChangeText: (text) => {
        setElementValue(text);
      },
      value: elementValue,
    };
  }

  function handleSuggestionEditing(item) {
    setLocation(item);
    location_address_ref.current.setValue(item.address);
    location_address_ref.current.blur();
    setSuggestionsEditing(false);
  }

  function handleSaveTasks(tasks) {
    setShowModal(false);
    setTasks(tasks);
  }

  async function formatForm(data) {
    const form = { ...data };
    const place_data = await GoogleServicesController.getCoordinatesFromPlaceID(form.location.place_id);
    form.coordinates = [place_data.geometry.location["lat"], place_data.geometry.location["lng"]];
    return form;
  }

  function formatFormV2(data) {
    const form = { ...data };
    form.start_at = form.date?.getTime() || Date.now()
    form.date = null
    form.coordinates = [form.location.coords.latitude, form.location.coords.longitude];
    return form;
  }

  async function handleSubmit(form) {
    try {
      setLoading(true);
      // const formattedForm = await formatForm(form);
      const formattedForm = formatFormV2(form);

      // Sends the job details and associated photos for upload and job creation
      const { success } = await JobsController.postUserJob(authState.userID, formattedForm, authState.userToken, photos);

      if (success) return navigation.goBack();
    } catch (e) {
      console.log(e)
      Alert.alert('Failed to create job')
    } finally {
      setLoading(false);
    }
  }

  // - - Render - -
  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );

  return (
    <>
      <KeyboardAvoidingView enabled behavior="height" style={{ flex: 1 }}>
        <Container ref={scroll} keyboardShouldPersistTaps="always">
          <TaskModal showModal={showModal} onHandleModalClose={(tasks) => handleSaveTasks(tasks)} items={tasks} />

          <Header
            navigation={navigation}
            backAction={() => onHandleCancel()}
            backTitle="Cancel"
            title="Add Work"
            nextColor="#548ff7"
            backAction={() => navigation.goBack()}
          />

          <Fields>
            <Item>
              <TextField
                {...commonInputProps(job_type, setJobType)}
                labelOffset={{ x0: 0, y0: 0, x1: -40, y1: -6 }}
                contentInset={{ top: 16, left: 0, right: 0, label: 4, input: 8 }}
                label="JOB TYPE"
                labelFontSize={14}
                labelTextStyle={{ color: "black", fontWeight: "700" }}
                placeholder="Search Job Types"
                renderLeftAccessory={() => (
                  <View style={{ width: 30 }}>
                    <Ionicons name="ios-search" size={24} />
                  </View>
                )}
              />
            </Item>

            <Item>
              <TextField
                label="JOB TITLE"
                placeholder="Job Title"
                labelFontSize={14}
                labelTextStyle={{ color: "grey", fontWeight: "700" }}
                {...commonInputProps(job_title, setJobTitle)}
              />
            </Item>

            <Item>
              <Text style={{ fontWeight: "bold", color: "grey" }}>TASKS</Text>
              <TouchableWithoutFeedback onPress={() => setShowModal(true)}>
                <Tasks>
                  <FlatList
                    style={{ marginVertical: 10, paddingVertical: 10 }}
                    data={tasks}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <Task>
                        <Text style={{ flex: 2, padding: 5 }} color="#636363" small>
                          {item.text}
                        </Text>
                      </Task>
                    )}
                  />
                </Tasks>
              </TouchableWithoutFeedback>
            </Item>

            <Item>
              {/* <TextField
                {...commonInputProps(location.address, setLocation)}
                textContentType="addressCityAndState"
                onChangeText={(text) => {
                  if (text.length == 0) setTimeout(() => scroll && scroll.current.scrollTo({ y: 350, animated: true, duration: 500 }), 200);
                  setLocation({ address: text });
                }}
                onFocus={() => {
                  setSuggestionsEditing(true);
                  setTimeout(() => scroll && scroll.current.scrollTo({ y: 350, animated: true, duration: 500 }), 200);
                }}
                onBlur={() => setSuggestionsEditing(false)}
                labelOffset={{ x0: 0, y0: 0, x1: -40, y1: -6 }}
                contentInset={{ top: 16, left: 0, right: 0, label: 4, input: 8 }}
                label="LOCATION ADDRESS"
                placeholder="Type the first line of the address"
                value={location.address}
                ref={location_address_ref}
                labelFontSize={14}
                labelTextStyle={{ color: "grey", fontWeight: "700" }}
                renderRightAccessory={() => (
                  <TouchableWithoutFeedback onPress={() => location_address_ref.current.clear()}>
                    <View style={{ width: 40, marginHorizontal: 10 }}>
                      <Text color="#4a89f2" bold>
                        Clear
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}
                renderLeftAccessory={() => (
                  <View style={{ width: 30 }}>
                    <Ionicons name="ios-search" size={24} />
                  </View>
                )}
              /> */}

              {/* {googleSuggestions.length != 0 && location?.address != undefined && suggestionsEditing === true && (
                <Suggestions>
                  <SuggestedItem>
                    <MaterialIcons name="gps-fixed" size={15} />
                    <Text style={{ marginLeft: 10 }}>Pick Your Location</Text>
                  </SuggestedItem>
                  <FlatList
                    keyboardShouldPersistTaps="always"
                    data={googleSuggestions}
                    renderItem={({ item }) => (
                      <TouchableWithoutFeedback onPress={() => handleSuggestionEditing(item)}>
                        <SuggestedItem>
                          <Text>{item.address}</Text>
                        </SuggestedItem>
                      </TouchableWithoutFeedback>
                    )}
                  />
                  <PoweredByGoogleImage
                    source={require("../../../assets/powered_by_google_on_white.png")}
                    style={{
                      width: 432 * 0.3,
                      height: 54 * 0.3,
                    }}
                  />
                </Suggestions>
              )} */}
            </Item>

            <Item style={{ marginTop: 20, marginBottom: 20 }}>
              <WageTitles></WageTitles>
              <WageInput>
                <SalaryField>
                  <TextField
                    prefix='$'
                    suffix="/hr"
                    label="PAY"
                    labelFontSize={14}
                    placeholder="0.00"
                    labelTextStyle={{ color: "grey", fontWeight: "700" }}
                    keyboardType="numeric"
                    {...commonInputProps(salary, setSalary)}
                  />
                </SalaryField>
                {/* <WageTimeField>
                  <WageTimeFieldInput selectedValue={wage} mode="dropdown" onValueChange={(value) => setWage(value)}>
                    <WageTimeFieldInput.Item label="Year" value="yr" />
                    <WageTimeFieldInput.Item label="Hour" value="hr" />
                  </WageTimeFieldInput>
                </WageTimeField> */}
              </WageInput>
            </Item>

            <Item style={{ marginVertical: 4 }}>
              <Text style={{ color: '#444', textAlign: 'center', marginTop: 8, marginBottom: 4, textTransform: 'uppercase' }}>ADD JOB PHOTOS (OPTIONAL)</Text>
              <FlatList data={photos}
                keyExtractor={v => v.uri}
                centerContent
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 40 }}
                ListHeaderComponent={() => (
                  <TouchableOpacity disabled={loadingMedia} style={{ alignSelf: "center", justifyContent: 'center', backgroundColor: '#fff', height: 150, marginHorizontal: 4, width: 150, borderRadius: 4 }} onPress={getPhoto}>
                    <ScheduleButton style={{ justifyContent: "center", flex: 1, backgroundColor: 'transparent', alignItems: "center" }}>
                      <Ionicons name='ios-add' style={{ fontSize: 40 }} />
                    </ScheduleButton>
                  </TouchableOpacity>
                )}
                horizontal
                renderItem={({ item }) => (
                  <PhotoItem item={item} onRemove={() => { setPhotos(photos.filter(v => v.uri !== item.uri)) }} />
                )} />
            </Item>

            <Item>
              <Text style={{ color: '#444', textAlign: 'center', marginTop: 8, textTransform: 'uppercase' }}>Job will be available {date.getTime() <= Date.now() + 5000 ? 'immediately' : moment(date).calendar()}</Text>
            </Item>
            <TouchableOpacity style={{ alignSelf: "center", width: width * 0.7, marginBottom: 12 }} onPress={onShowDate}>
              <ScheduleButton style={{ justifyContent: "center", alignItems: "center" }}>
                <Text bold color="black">
                  Schedule Job
                </Text>
              </ScheduleButton>
            </TouchableOpacity>
            {showDate ? (
              <DateTimePicker style={{ marginBottom: 20 }} minimumDate={new Date()} mode={mode} onChange={updateDate} value={date} />
            ) : null}

            <TouchableOpacity style={{ alignSelf: "center", width: width * 0.7, marginBottom: 100 }} onPress={() => handleSubmit(form)}>
              <SaveButton style={{ justifyContent: "center", alignItems: "center" }}>
                <Text bold color="white">
                  Save
                </Text>
              </SaveButton>
            </TouchableOpacity>
          </Fields>
        </Container>
      </KeyboardAvoidingView>
    </>
  );
}

const ModalBackground = styled.View`
  background: white;
  flex: 1;
`;

const WageInput = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const SalaryField = styled.View`
  flex: 3;
  flex-direction: column;
  padding-right: 50px;
`;

const Task = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 2px 10px;
`;

const WageTimeField = styled.View`
  flex: 2;
  flex-direction: column;
  overflow: hidden;
`;

const WageTimeFieldInput = styled.Picker`
  margin: ${Platform.OS == "ios" ? "-60px 0" : "0px"};
`;

const Fields = styled.View`
  flex: 1;
  margin: 0 20px 20px 20px;
`;

const Item = styled.View`
  margin: 10px 0;
`;

const ScheduleButton = styled.View`
  padding: 10px;
  background: #fff;
  border-radius: 6px;
`;

const SaveButton = styled.View`
  padding: 10px;
  background: #255cf0;
  border-radius: 6px;
`;

const Container = styled.ScrollView`
  flex: 1;
`;

const Suggestions = styled.View``;

const Tasks = styled.View`
  min-height: 100px;
  border: 1px solid grey;
  border-radius: 6px;
`;

const SuggestedItem = styled.View`
  border: 1px solid #cccccc;
  border-radius: 6px;
  margin: 0 0 3px 0;
  padding: 10px 15px;

  flex-direction: row;
  align-items: center;
`;

const PoweredByGoogleImage = styled.Image`
  align-self: flex-end;
`;

const WageTitles = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;
