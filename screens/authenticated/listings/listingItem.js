import { useActionSheet } from "@expo/react-native-action-sheet";
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRoute } from "@react-navigation/core";
import { TextField } from "@ubaids/react-native-material-textfield";
import { Camera, requestPermissionsAsync } from "expo-camera";
import Constants from "expo-constants";
import { launchImageLibraryAsync, MediaTypeOptions, requestMediaLibraryPermissionsAsync } from "expo-image-picker";
import moment from "moment";
import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import
{
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  KeyboardAvoidingView, Modal,
  Platform,
  SafeAreaView, TextInput, TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import GigChaserJobWord from "../../../assets/gig-logo";
import { GlobalContext } from "../../../components/context";
import Header from "../../../components/headerAndContainer";
import Text from "../../../components/text";
import { LISTING_CONTEXT } from "../../../contexts/ListingContext";
import GoogleServicesController from "../../../controllers/GoogleServicesController";
import JobsController from "../../../controllers/JobsControllers";
import PermissionsControllers from "../../../controllers/PermissionsControllers";
import env from "../../../env";
import JobSuggestions from "../../../models/fetchedSuggestedItems";
import PhotoItem from "./listItemImage";
import TaskModal from "./taskModal";

const width = Dimensions.get("window").width;
export const getPriorityColor = (priority) =>
{
  switch (priority)
  {
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

export default function ListingItem({ navigation })
{
  // - - Constructor - -
  const { authState } = useContext(GlobalContext);
  const { setListing } = useContext(LISTING_CONTEXT);

  const route = useRoute();
  const { params } = route;
  const payments = useSelector((state) => state.payment);

  // - - State - -
  const [job_type, setJobType] = useState(""); // Input Field
  const [selected_job_type, setSelectedJobType] = useState(""); // Input Field
  const [job_title, setJobTitle] = useState(""); // Input Field
  const [location, setLocation] = useState(""); // Input Field
  const [salary, setSalary] = useState(""); // Input Field
  const [tasks, setTasks] = useState([]); // Input Field (With Modal)

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [suggestionsEditing, setSuggestionsEditing] = useState(false);
  const [googleSuggestions, setGoogleSuggestions] = useState([]);

  // Setup datetime picker
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState(Platform.OS === "ios" ? "datetime" : "date");
  const [showDate, setShowDate] = useState(false);
  const [priority, setPriority] = useState("");

  // Setup job photo selection
  const [photos, setPhotos] = useState([]);
  const [loadingMedia, setloadingMedia] = useState(false);
  const { showActionSheetWithOptions } = useActionSheet();
  const [showCamera, setShowCamera] = useState(false);


  const [searchBarFocus, setSearchBarFocus] = useState(false);

  // - - Refs - -
  const scroll = useRef(null);
  const location_address_ref = useRef(null);
  const searchBarRef = useRef(null);

  let suggestedItems = JobSuggestions.filter((item) =>
  {
    if (item === "Random (No Skill Required)")
    {
      return true;
    }
    const title = item.toLowerCase();
    const input = job_type.toLowerCase().trim();
    return title.indexOf(input) !== -1;
  });

  let placeHolderForEditedAddress = "Original GPS Location";

  useState(() =>
  {
    if (params.edit)
    {
      setSelectedJobType(params.data.job_type);
      setJobTitle(params.data.job_title);
      setLocation(params.data.location);
      setSalary(params.data.salary);
      setTasks(params.data.tasks);
      setShowDate(params.data.showDate);
      setPriority(params.data.priority);
      setLocation(params.data.location);

      if (params.data.start_at)
      {
        setDate(new Date(params.data.start_at));
        // setShowDate(true);
      }
    }
  });

  useLayoutEffect(() =>
  {
    if (!payments.defaultMethod)
    {
      Alert.alert("No default payment method", "You must set your default payment method before creating a job", [
        {
          onPress: () =>
          {
            // Todo add a modal for this
            navigation.navigate('Payments');
          },
          style: 'default',
          text: 'Manage Payments',
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => navigation.goBack(),
        },
      ]);
      return;
    }
    if (params.edit)
    {
      if (params.data.location.coords && params.data.location.address == undefined)
      {
        location_address_ref.current.setValue(placeHolderForEditedAddress);
      }

      if (params.data.photo_files != null)
      {
        const formattedPhotos = params.data.photo_files.map((item) =>
        {
          return { type: "image/png", uri: `${env.API_URL}/job/${params.data.id}/${item}` };
        });
        setPhotos(formattedPhotos);
      }
    }
  }, []);

  const updateDate = async (e, dateParam) =>
  {
    if (dateParam)
    {
      // Set the date picker mode based on platform
      switch (mode)
      {
        case "datetime":
          if (Platform.OS === "ios")
          {
            setDate(dateParam);
          }
          // This is called for only iOS, so set debouncer to delay removing the time modal.
          // TODO: Test how to add a button instead of this
          break;
        case "date":
          setShowDate(() =>
          {
            // After collecting date data, get the time
            if (Platform.OS !== "ios")
            {
              setMode("time");
              setDate(dateParam);
            }
            return true;
          });
          break;
        case "time":
          // Todo: test on Android
          setShowDate(() =>
          {
            setDate(dateParam);
            return false;
          });
          break;
      }
    } else
    {
      setShowDate(false);
    }
  };

  const onShowDate = useCallback(() =>
  {
    setShowDate(() =>
    {
      // Set the date picker mode based on platform
      if (Platform.OS === "ios")
      {
        setMode("datetime");
      } else
      {
        setMode("date");
      }
      return true;
    });
  }, [showDate]);

  const getPhoto = useCallback(async () =>
  {
    try
    {
      showActionSheetWithOptions(
        {
          options: ["Capture Photo", "Select From Library", "Cancel"],
          title: "Select Photo",
          message: "You can select a photo from your library or capture a new photo",
          cancelButtonIndex: 2,
          useModal: true,
        },
        async (i) =>
        {
          switch (i)
          {
            case 0:
              getPhotoFromCamera();
              break;
            case 1:
              getPhotoFromLibrary();
              break;
          }
        },
      );
    } catch (e)
    {
      console.log(e);
      Alert.alert("Failed To Select Photo", e.message);
    }
  }, [photos]);

  const getPhotoFromLibrary = useCallback(async () =>
  {
    try
    {
      setloadingMedia(true);
      if (Platform.OS === "ios")
      {
        let perms = await requestMediaLibraryPermissionsAsync();
        if (!perms.granted)
        {
          Alert.alert("Access to media library denied", "You need to grant access to image library to continue");
          setloadingMedia(false);
          return;
        }
      }
      let res = await launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        mediaTypes: MediaTypeOptions.Images,
      });

      if (!res.cancelled && !photos.find((v) => v.uri === res.uri))
      {
        setPhotos([{ uri: res.uri, type: "image/png", height: res.height, width: res.width }, ...photos]);
      }
    } catch (e)
    {
      console.log(e);
      Alert.alert(e.message);
    } finally
    {
      setloadingMedia(false);
    }
  }, [photos]);

  const getPhotoFromCamera = useCallback(async () =>
  {
    try
    {
      setloadingMedia(true);

      let hasPermission = false;
      await (async () =>
      {
        const { status } = await requestPermissionsAsync();
        hasPermission = status === "granted";
      })();

      if (hasPermission !== true)
      {
        Alert.alert("Camera Access Required", "The application requires permission to use your camera");
        return;
      }

      setShowCamera(true);
    } catch (e)
    {
      console.log(e);
      Alert.alert("Failed To Capture Photo", e.message);
    } finally
    {
      setloadingMedia(false);
    }
  }, [photos]);

  const onSetPriority = useCallback(async () =>
  {
    showActionSheetWithOptions(
      {
        options: ["High (15 mins)", "Medium (15 mins)", "Low (15 mins)", "None", "Cancel"],
        cancelButtonIndex: 4,
        destructiveButtonIndex: 3,
        title: "Set Priority",
        message: "Specify how long after accepting a job the deployee is allowed to cancel",
      },
      (i) =>
      {
        switch (i)
        {
          case 0:
            setPriority("high0");
            break;
          case 1:
            setPriority("medium0");
            break;
          case 2:
            setPriority("low0");
            break;
          case 3:
            setPriority("");
        }
      },
    );
  }, [priority]);

  // - - Extra Setup - -
  const form = { job_type: selected_job_type, job_title, tasks, location, salary, wage: 'deployment', date, priority };

  // - - Life Cycles - -
  // Create session for google suggestions (This will reduce billing expenses)
  useEffect(() =>
  {
    GoogleServicesController.createSession();
    return () =>
    {
      GoogleServicesController.clean();
      setShowModal(false);
    };
  }, []);

  // Fetch suggestions
  useEffect(() =>
  {
    (async () =>
    {
      if (location?.address != undefined)
      {
        setGoogleSuggestions(await GoogleServicesController.getPlacesSuggestions(location.address));
      } else
      {
        setGoogleSuggestions([]);
      }
    })();
  }, [location]);

  useEffect(() =>
  {

    return () =>
    {
      setJobType('');
      setSearchBarFocus(false);
    };
  }, []);

  // Get location
  // useEffect(() => {
  //   PermissionsControllers.getLocation().then((position) => setLocation(position));
  // }, []);

  // - - Functions (Handler, Events, more) - -
  function commonInputProps(elementValue, setElementValue)
  {
    return {
      onChangeText: (text) =>
      {
        setElementValue(text);
      },
      contentInset: { top: -10 },
      value: elementValue,
    };
  }

  function handleSuggestionEditing(item)
  {
    if (item == "Current Location")
    {
      PermissionsControllers.getLocation().then((position) => setLocation({ ...position, address: null, id: null, place_id: null }));
      location_address_ref.current.setValue(item);
    } else
    {
      setLocation({ ...item, coords: null, timestamp: null });

      location_address_ref.current.setValue(item.address);
    }
    location_address_ref.current.blur();
    setSuggestionsEditing(false);
  }

  function handleSaveTasks(tasks)
  {
    setShowModal(false);
    setTasks(tasks);
  }

  async function formatForm(data)
  {
    const form = { ...data };
    form.date = null;

    if (params.edit == true)
    {
      form.id = params.data.id;
    } else
    {
      form.start_at = form.date?.getTime() || Date.now();
    }

    if (form.location.coords == undefined)
    {
      // Formats form when job location was pulled from Google Location API
      const place_data = await GoogleServicesController.getCoordinatesFromPlaceID(form.location.place_id);
      form.coordinates = [place_data.geometry.location.lat, place_data.geometry.location.lng];
    } else
    {
      // Formats form when job location was pulled from client GPS
      form.coordinates = [form.location.coords.latitude, form.location.coords.longitude];
    }

    return form;
  }

  async function handleSubmit(form)
  {
    try
    {
      setLoading(true);
      let success;

      const formattedForm = await formatForm(form);

      // Sends the job details and associated photos for upload and job creation
      if (params.edit === false)
      {
        success = (await JobsController.postUserJob(authState.userID, formattedForm, authState.userToken, photos)).success;
      } else
      {
        success = (await JobsController.updateUserJob(authState.userID, formattedForm, authState.userToken, photos)).success;
      }

      if (success) {return navigation.goBack();}
      else {setLoading(false);}
    } catch (e)
    {
      console.log(e);
      Alert.alert("Failed to create job", e.code === 418 ? e.message : undefined);
      setLoading(false);
    }
  }

  // - - Render - -
  if (loading)
    {return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );}

  return (
    <KeyboardAvoidingView enabled behavior="padding" style={{ flex: 1 }}>
      <Container
        bounces={false}
        showsVerticalScrollIndicator={false}
        ref={scroll}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always">
        <TaskModal
          showModal={showModal}
          onHandleModalClose={(tasks) =>
          {
            if (tasks == undefined)
            {
              setShowModal(false);
              return;
            }
            handleSaveTasks(tasks);
          }}
          items={tasks}
        />

        <Header
          disableContainer={true}
          navigation={navigation}
          backTitle="Cancel"
          backColor="black"
          title={() => (
            <>
              <Text style={{ color: "black", fontWeight: "300", fontSize: 23 }}>Add</Text>
              <GigChaserJobWord color="black" width="60px" height="30px" style={{ marginHorizontal: 10 }} />
            </>
          )}
          backAction={() =>
          {
            setJobType('');
            navigation.goBack();
          }}
        />

        <Fields>
          <Item>
            <InputTitle
              style={{ marginBottom: 12 }}>
              <GigChaserJobWord color="#444" width="60px" height="20px" />
              <Text small bold color="#444">
                TYPE
              </Text>
            </InputTitle>
            <SuggestionContainer>
              <SearchBar activeOpacity={0.8} onPress={() =>
              {
                searchBarRef.current?.focus();
                setSearchBarFocus(true);
              }}>
                <Ionicons name="ios-search" size={16} />
                <TextInput underlineColorAndroid="transparent"
                  placeholder="Search Job types"
                  placeholderTextColor="#777"
                  style={{ fontSize: 16, marginLeft: 4 }}
                  value={job_type}
                  onChangeText={(text) => setJobType(text)}
                  ref={searchBarRef}
                  onFocus={() =>
                  {
                    setSearchBarFocus(true);
                  }}
                  onSubmitEditing={() =>
                  {
                    setSearchBarFocus(false);
                    searchBarRef.current?.blur();
                    // handleSubmit(nativeEvent.text);
                  }}
                />
              </SearchBar>

              {!!selected_job_type &&
                <Text style={{ paddingVertical: 18, marginHorizontal: 8 }}>
                  Selected:{" "}
                  <Text bold color="#548ff7">
                    {selected_job_type}
                  </Text>
                </Text>
              }
              {searchBarFocus &&
                <SuggestionScrollView
                  // style={{ma}}
                  keyboardShouldPersistTaps="always"
                  data={suggestedItems}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) =>
                  {
                    return (
                      <SearchSuggestedItem
                        activeOpacity={0.9}
                        onPress={() =>
                        {
                          setSelectedJobType(item);
                          setSearchBarFocus(false);
                          searchBarRef.current?.blur();
                          searchBarRef.current?.clear();
                          setJobType('');
                        }}
                      >
                        <Text>{item}</Text>
                      </SearchSuggestedItem>
                    );
                  }} />
              }
            </SuggestionContainer>
            {/* <SearchTitleSuggestionsField>
                <SearchTitleSuggestionsFieldInput
                  selectedValue={selected_job_type}
                  onValueChange={(value) => setSelectedJobType(value)}
                  itemStyle={{ fontSize: 19 }}
                >
                  <SearchTitleSuggestionsFieldInput.Item label={"Select a type"} value={""} key={0} />
                  {suggestedItems.map((JobSuggestion, index) => (
                    <SearchTitleSuggestionsFieldInput.Item label={JobSuggestion} value={JobSuggestion} key={index + 1} />
                  ))}
                </SearchTitleSuggestionsFieldInput>
              </SearchTitleSuggestionsField> */}
          </Item>

          <Item>
            <InputTitle>
              <GigChaserJobWord color="#444" width="60px" height="20px" />
              <Text small bold color="#444">
                TITLE
              </Text>
            </InputTitle>
            <TextField
              // label="JOB TITLE"
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
                  ListEmptyComponent={() => <Text style={{ textAlign: "center", color: "#888" }}>Tap on this section to add tasks</Text>}
                />
              </Tasks>
            </TouchableWithoutFeedback>
          </Item>

          <Item>
            <Text small bold color="#444">
              LOCATION ADDRESS
            </Text>
            <TextField
              {...commonInputProps(location.address, setLocation)}
              textContentType="addressCityAndState"
              onChangeText={(text) =>
              {
                if (text.length == 0) {setTimeout(() => scroll && scroll.current.scrollTo({ y: 350, animated: true, duration: 500 }), 200);}
                setLocation({ address: text });
              }}
              onFocus={() =>
              {
                setSuggestionsEditing(true);
                setTimeout(() => scroll && scroll.current.scrollTo({ y: 350, animated: true, duration: 500 }), 200);
              }}
              onBlur={() => setSuggestionsEditing(false)}
              labelOffset={{ x0: 0, y0: 0, x1: -40, y1: -6 }}
              // contentInset={{ top: 16, left: 0, right: 0, label: 4, input: 8 }}
              // label="LOCATION ADDRESS"
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
            />

            {/* {googleSuggestions.length != 0 && location?.address != undefined && suggestionsEditing === true && ( */}
            {suggestionsEditing === true && (
              <Suggestions>
                <TouchableWithoutFeedback onPress={() => handleSuggestionEditing("Current Location")}>
                  <SuggestedItem>
                    <MaterialIcons name="gps-fixed" size={15} />
                    <Text style={{ marginLeft: 10 }}>Pick Your Location</Text>
                  </SuggestedItem>
                </TouchableWithoutFeedback>
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
            )}
          </Item>

          <Item style={{ marginVertical: 20 }}>
            <WageInput>
              <SalaryField style={{ alignSelf: "stretch" }}>
                <Text small bold color="#444">
                  PAY
                </Text>
                <TextField
                  {...commonInputProps(salary, setSalary)}
                  prefix="$"
                  suffix={`/deployment`}
                  // label="PAY"
                  labelFontSize={14}
                  placeholder="0.00"
                  labelTextStyle={{ color: "grey", fontWeight: "700" }}
                  keyboardType="numeric"
                />
              </SalaryField>
            </WageInput>
          </Item>

          <Item style={{ marginVertical: 4 }}>
            <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
              <Text style={{ fontWeight: "bold", color: "grey", alignItems: "center" }}>PRIORITY</Text>
              {!!priority && <FontAwesome name="circle" color={getPriorityColor(priority)} style={{ marginStart: 12, fontSize: 16 }} />}
            </View>
            <TouchableOpacity style={{ alignSelf: "stretch", flex: 1 }} onPress={onSetPriority}>
              <ScheduleButton
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 2,
                  backgroundColor: "#fafafa",
                }}
              >
                <Text light={!priority} textTransform="uppercase">
                  {priorityMap?.[priority] || "none"}
                </Text>
              </ScheduleButton>
            </TouchableOpacity>
          </Item>

          <Item style={{ marginVertical: 4 }}>
            <InputTitle style={{ justifyContent: "center" }}>
              <Text small bold color="#444">
                ADD
              </Text>
              <GigChaserJobWord color="#444" width="60px" height="20px" />
              <Text small bold color="#444">
                PHOTOS (OPTIONAL)
              </Text>
            </InputTitle>

            <FlatList
              data={photos}
              keyExtractor={(v) => v.uri}
              centerContent
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 40, justifyContent: "center", paddingTop: 12, flexGrow: 1 }}
              ListHeaderComponent={() => (
                <TouchableOpacity
                  disabled={loadingMedia}
                  style={{
                    alignSelf: "center",
                    justifyContent: "center",
                    backgroundColor: "#fff",
                    height: 150,
                    marginHorizontal: 4,
                    width: 150,
                    borderRadius: 4,
                  }}
                  onPress={getPhoto}
                >
                  <ScheduleButton style={{ justifyContent: "center", flex: 1, backgroundColor: "transparent", alignItems: "center" }}>
                    {loadingMedia ? (
                      <ActivityIndicator color="black" size="small" />
                    ) : (
                      <Ionicons name="ios-add" style={{ fontSize: 40 }} />
                    )}
                  </ScheduleButton>
                </TouchableOpacity>
              )}
              renderItem={({ item }) => <PhotoItem item={item} onRemove={() => setPhotos(photos.filter((v) => v.uri !== item.uri))} />}
            />
            <JobCamera
              showCamera={showCamera}
              onSuccess={async (res) =>
              {
                if (!res)
                {
                  return setShowCamera(false);
                }
                try
                {
                  if (!res.cancelled && !photos.find((v) => v.uri === res.uri))
                  {
                    setPhotos([{ uri: res.uri, type: "image/png", height: res.height, width: res.width }, ...photos]);
                  }
                } catch (e)
                {
                  console.log(e);
                  Alert.alert(e.message || "Failed to add photo");
                } finally
                {
                  setShowCamera(false);
                }
              }}
            />
          </Item>

          <Item>
            <InputTitle style={{ justifyContent: "center" }}>
              <Text style={{ color: "#444", textAlign: "center", marginTop: 8, textTransform: "uppercase" }}>
                <GigChaserJobWord color="#444" width="60px" height="20px" /> will be started{" "}
                {date.getTime() <= Date.now() + 5000 ? "immediately" : moment(date).calendar()}
              </Text>
            </InputTitle>
            <Text light small style={{ textAlign: "center", marginTop: 4, fontSize: 10, textTransform: "uppercase" }}>
              (You can only schedule up to 6 days from now)
            </Text>
          </Item>
          <TouchableOpacity
            style={{ alignSelf: "center", width: width * 0.7, marginBottom: 12 }}
            onPress={() =>
            {
              if (showDate && Platform.OS === "ios")
              {
                setShowDate(false);
              } else
              {
                onShowDate();
              }
            }}
          >
            <ScheduleButton
              style={{
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: showDate && Platform.OS === "ios" ? "red" : "#fff",
              }}
            >
              <Text bold color={showDate && Platform.OS === "ios" ? "white" : "black"}>
                {showDate && Platform.OS === "ios" ? "Close Date Picker" : "Schedule"}
              </Text>
            </ScheduleButton>
          </TouchableOpacity>
          {showDate ? (
            <DateTimePicker
              display={Platform.OS === "ios" ? "spinner" : undefined}
              style={{ marginBottom: 20 }}
              minimumDate={new Date()}
              mode={mode}
              maximumDate={moment().add(6, "days").toDate()}
              onChange={updateDate}
              value={date}
            />
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
    </KeyboardAvoidingView >
  );
}

export const JobCamera = ({ showCamera, onSuccess }) =>
{
  const [flash, setFlash] = useState({ icon: "flash-auto", mode: "auto" });
  const [useBack, setUseBack] = useState(true);
  const cameraRef = useRef();

  const toggleFlash = useCallback(() =>
  {
    const current = flash.mode;
    switch (current)
    {
      case "off":
        setFlash({ icon: "flash-auto", mode: "auto" });
        break;
      case "on":
        setFlash({ icon: "flash-off", mode: "off" });
        break;
      case "auto":
        setFlash({ icon: "flash-on", mode: "on" });
        break;
    }
  }, [flash]);

  useEffect(() =>
  {
    return () =>
    {
      if (showCamera && cameraRef.current && Constants.isDevice)
      {
        cameraRef.current.pausePreview();
      }
    };
  }, [showCamera]);

  return (
    <Modal visible={showCamera} transparent onRequestClose={() => onSuccess()} onDismiss={() => onSuccess()} style={{ height: "100%", width: "100%" }}>
      <>
        <Camera
          ref={cameraRef}
          type={useBack ? "back" : "front"}
          flashMode={flash.mode} useCamera2Api
          style={{ flex: 1, justifyContent: "space-between", flexDirection: "column", alignItems: "stretch" }}
        >
          <SafeAreaView
            style={{ flex: 1, justifyContent: "space-between", alignItems: "stretch", margin: 12, backgroundColor: "transparent" }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                backgroundColor: "#fff4",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 28,
                height: 56,
                width: 56,
              }}
              onPress={() => onSuccess()}
            >
              <AntDesign name="arrowleft" size={28} color={"#000a"} />
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 8,
                marginBottom: 20,
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#fffc",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 24,
                  height: 48,
                  width: 48,
                }}
                onPress={async () => setUseBack(!useBack)}
              >
                <AntDesign name="swap" size={28} color={"#000a"} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#fffc",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 32,
                  height: 64,
                  width: 64,
                  marginHorizontal: 8,
                }}
                onPress={async () => onSuccess(await cameraRef.current.takePictureAsync())}
              >
                <MaterialCommunityIcons size={30} name="camera" color="#000a" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#fffc",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 24,
                  height: 48,
                  width: 48,
                }}
                onPress={toggleFlash}
              >
                <MaterialIcons size={28} name={flash.icon} color="#000a" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Camera>
      </>
    </Modal>
  );
};

const WageInput = styled.View`
  flex-direction: row;
  /* justify-content: center; */
  /* align-items: center; */
`;

const SalaryField = styled.View`
  flex: 1;
  flex-direction: column;
`;

const Task = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 2px 10px;
  background-color: #efefef;
  border-radius: 3px;
  margin-bottom: 10px;
`;

const SearchBar = styled.TouchableOpacity`
  font-size: 16px;
  border: 2px solid #ededed;
  border-radius: 10px;
  background: white;
  padding: 12px 8px;
  flex-direction: row;
`;

const Fields = styled.View`
  flex: 1;
  margin: 0 20px 20px 20px;
`;

const Item = styled.View`
  margin: 10px 0;
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
  background-color: white;
  min-height: 100px;
  border-radius: 6px;
  border: #548ff7;
  padding: 0 20px;
`;

const PoweredByGoogleImage = styled.Image`
  align-self: flex-end;
`;


const SuggestionContainer = styled.KeyboardAvoidingView`
  background: white;
  width: 100%;
  opacity: 1;
  z-index: 2;
  border-radius: 10px;
`;

const SuggestionScrollView = styled.FlatList`
`;

const SearchSuggestedItem = styled.TouchableOpacity`
  border-top-color: #dadada;
  border-top-width: 1px;
  padding: 10px 30px;
  width: 100%;
`;

const SuggestedItem = styled.View`
  border: 1px solid #cccccc;
  border-radius: 6px;
  margin: 0 0 3px 0;
  padding: 10px 15px;
  flex-direction: row;
  align-items: center;
`;
