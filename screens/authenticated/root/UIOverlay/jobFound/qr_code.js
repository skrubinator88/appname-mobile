import { AntDesign } from "@expo/vector-icons";
import React, { useContext, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { Alert, Dimensions, View } from "react-native";
import styled from "styled-components/native";
import QRCode from "../../../../../components/qr-code-generator/";
// Components
import Text from "../../../../../components/text";
import { JOB_CONTEXT } from "../../../../../contexts/JobContext";




const width = Dimensions.get("screen").width;


export default function QRCodeScreen({ navigation, route }) {
	const { current } = useContext(JOB_CONTEXT);

	useEffect(() => {
		if (current?.status === 'in progress') {
			Alert.alert("QR Scan Complete", "QR scan has been confirmed by deployer", [{ style: 'default', onPress: navigation.goBack, text: 'Go Back' }])
		}
	}, [current?.status])

	return (
		<Container>
			{!route.params?.job_data?._id && (
				<View style={{ flex: 1, justifyContent: 'center' }}>
					<ActivityIndicator style={{ margin: 8, marginTop: 12 }} size='large' />
				</View>
			)}
			{route.params?.job_data?._id && (
				<>
					<View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%', position: 'relative' }}>
						<ButtonStyled onPress={(e) => navigation.goBack()}>
							<AntDesign name='close' color='black' size={30} />
						</ButtonStyled>
						<Text style={{ fontSize: 30 }}>QR Code</Text>
					</View>
					<QRCode value={`${route.params?.job_data?._id}`} />
					<Text medium>Show the QR code to the client to register your presence at the work site</Text>
				</>
			)}
		</Container>
	);
}

const Container = styled.View`
	background: white;
	flex: 1;
	padding: 7%;
	align-items: center;
	justify-content: space-evenly;
`;

const ButtonStyled = styled.TouchableOpacity`
	position: absolute;
	left: 0;
`;
