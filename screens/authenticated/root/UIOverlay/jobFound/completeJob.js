import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute } from "@react-navigation/native";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, Image, Text, View } from "react-native";
import styled from "styled-components/native";
import { GlobalContext } from "../../../../../components/context";
// Components
import Container from "../../../../../components/headerAndContainerGrow";
import { completeJob } from "../../../../../controllers/JobsControllers";
import { JobCamera } from "../../../listings/listingItem";
import GigChaserJobWord from "../../../../../assets/gig-logo";


export default function CompleteJob({ navigation }) {
  const { authState } = useContext(GlobalContext)

  const [loading, setLoading] = useState(false)
  const [capture, setCapturing] = useState(false)
  const [image, setImage] = useState(null)

  const { job_data } = useRoute().params

  useEffect(() => {
    if (job_data.status !== 'in progress' && job_data.scanQR) {
      Alert.alert("QR Code Scan Required", "QR Code must be scanned at least once before job can be completed", [{ style: 'default', onPress: () => navigation.goBack() }])
    }
  }, [])

  const onCapture = useCallback((res) => {
    if (!res) {
      return setCapturing(false);
    }
    try {
      if (!res.cancelled) {
        setImage({ uri: res.uri, type: "image/png", height: res.height, width: res.width });
      }
    } catch (e) {
      console.log(e);
      Alert.alert(e.message || "Failed to add photo");
    } finally {
      setCapturing(false);
    }
  }, [capture])

  return (
    <Container
      flexible={false}
      navigation={navigation}
      title={() => (
        <>
          <Text style={{ color: "white", fontWeight: "300", fontSize: 23 }}>Complete</Text>
          <GigChaserJobWord color="white" width="60px" height="25px" style={{ marginHorizontal: 10 }} />
        </>
      )}
      containerBackground="white"
      headerBackground="#17a525"
      nextProvider="Entypo"
    >
      <View style={{ justifyContent: 'space-between', flexGrow: 1 }}>
        <View style={{ justifyContent: 'center', flex: 1 }}>
          <SectionTitle>Confirm the gig completion by taking a picture of the finished work</SectionTitle>
        </View>

        <View style={{ flex: 3, paddingHorizontal: 12, paddingVertical: 20 }}>
          {(!!image || capture) &&
            <View style={{ flex: 1, justifyContent: 'flex-start' }}>
              <CaptureScreen image={image} capture={capture} onCapture={onCapture} />
              <RetakeButton disabled={loading} onPress={() => setCapturing(true)} activeOpacity={0.8}><Text style={{ color: '#888', fontSize: 16, fontWeight: 'bold' }}>Retake Picture</Text></RetakeButton>
            </View>
          }
          {!image &&
            <View style={{ flex: 1, justifyContent: 'flex-start', paddingHorizontal: 12, paddingVertical: 20 }}>
              <CompleteButton disabled={loading} onPress={() => setCapturing(true)} activeOpacity={0.8}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Take Photo</Text>
              </CompleteButton>
            </View>
          }
        </View>

        {!!image &&
          <View style={{ flex: 1, paddingVertical: 16, justifyContent: 'center' }}>
            <CompleteButton disabled={loading} onPress={async () => {
              try {
                setLoading(true)
                await completeJob(job_data._id, authState, image)
                Alert.alert('Completed Gig Successfully!', 'Thank you for using Gigchasers', [{ style: 'default', onPress: () => navigation.navigate('Root', { screen: 'dashboard', data: 'completedJob' }), text: 'Continue' }])
              } catch (e) {
                Alert.alert('Failed To Complete Gig', e.message || 'There was an error while completing gig')
              } finally {
                setLoading(false)
              }
            }} activeOpacity={0.8}>
              {loading ?
                <ActivityIndicator size='small' color='white' />
                :
                <>
                  <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>Complete</Text>
                  <GigChaserJobWord color="white" width="60px" height="18" style={{ marginHorizontal: 0 }} />
                </>
              }
            </CompleteButton>
          </View>
        }
      </View>
    </Container>
  );
}


const CaptureScreen = ({ capture, onCapture, image }) => {
  const cameraRef = useRef();

  useEffect(() => {
    return () => {
      if (capture && cameraRef.current && Constants.isDevice) {
        cameraRef.current.pausePreview();
      }
    };
  }, [capture]);

  return (
    <>
      <JobCamera
        showCamera={capture}
        onSuccess={onCapture}
      />

      {image ?
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'stretch' }}>
          <Image source={{ uri: image.uri }} style={{ backgroundColor: "transparent", flex: 1 }} />
        </View>
        :
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'stretch' }}>
          <MaterialCommunityIcons name="image-filter-center-focus" size={250} style={{ flex: 1, color: '#888', textAlign: 'center', aspectRatio: 1 }} color="black" />
        </View>}
    </>
  )
}

// Payments Section
const SectionTitle = styled.Text`
  text-align: center;
  padding:  10%;
  font-size: 16px;
  color: #888;
  font-weight: bold;
`;

const CompleteButton = styled.TouchableOpacity`
  align-self: center;
  padding: 4% 12%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #17a525;
  border-radius: 24px;
`;

const RetakeButton = styled.TouchableOpacity`
  align-self: center;
  margin-top: 12px; 
  border-radius: 24px;
  padding: 4% 12%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  background-color: transparent;
  border: solid 0.4px #888;
`;