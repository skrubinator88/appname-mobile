import React, { useContext, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, View } from 'react-native';
import { CheckBox } from "react-native-elements";
import ReactNativeModal from 'react-native-modal';
import styled from "styled-components/native";
import Text from '../../../components/text';
import { JOB_CONTEXT } from '../../../contexts/JobContext';
import JobSuggestions from "../../../models/fetchedSuggestedItems";


const CheckBoxItem = ({ onPress, disabled, key, item, checked }) => {
	return (
		<CheckBox disabled={disabled} activeOpacity={0.8} title={item} onPress={() => onPress(item)} checked={checked} />
	)
}

export default function ({ visible, onComplete = () => { } }) {
	const { preferredSkills, setPreferredSkills } = useContext(JOB_CONTEXT)
	const [selected, setSelected] = useState(preferredSkills)
	const [saving, setIsSaving] = useState(false)

	return (
		<ReactNativeModal
			isVisible={visible}
			coverScreen
			onBackButtonPress={onComplete}
		>
			<View style={{ backgroundColor: 'white', marginVertical: 32, maxHeight: "92%", borderRadius: 8, paddingVertical: 8 }}>
				<View style={{ padding: 16 }}>
					{selected.length <= 0 && <Text textTransform='uppercase' color="#999" weight="bold" small>No Skill Selected yet</Text>}
					{selected.length > 0 &&
						<View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' }}>
							<SaveButton activeOpacity={0.8} disabled={saving} onPress={async () => {
								try {
									setIsSaving(true)
									if (selected && selected.length <= 10) {
										await setPreferredSkills(selected)
										Alert.alert('Updated Successful', `You have successfully updated your preferred skill list`, [{ style: 'default', onPress: onComplete }])
									} else {
										throw new Error('You can select at most 10 skills')
									}
								} catch (e) {
									Alert.alert(e.message)
								} finally {
									setIsSaving(false)
								}
							}} >
								<Text textTransform="uppercase" color="white">{saving ? <ActivityIndicator color='white' size='small' /> : 'Save'}</Text>
							</SaveButton>
							<Text textTransform='uppercase' color="#999" weight="bold" small>Currently Selected</Text>
						</View>}
					{selected.length > 0 && <Text style={{ marginVertical: 8 }}>{selected.join(", ")}</Text>}
				</View>
				<FlatList
					data={JobSuggestions}
					contentContainerStyle={{ marginHorizontal: 8 }}
					style={{ flexGrow: 1, marginVertical: 8 }}
					renderItem={({ item }) => {
						const isChecked = !!selected.find(i => item === i)
						return <CheckBoxItem disabled={saving} key={item} item={item} onPress={(item) => {
							if (isChecked) {
								setSelected(selected.filter(i => i !== item))
							} else {
								if (selected.length >= 10) {
									Alert.alert("Maximum Selection Reached", "You can only pick 10 preferred job types")
									return
								} else {
									setSelected([...selected, item])
								}
							}
						}}
							checked={isChecked}
						/>
					}}
				/>
				<View>
					<CloseButton activeOpacity={0.8} disabled={saving} onPress={onComplete} >
						<Text textTransform="uppercase" color="black">Close</Text>
					</CloseButton>
				</View>
			</View>
		</ReactNativeModal>
	)
}


const SaveButton = styled.TouchableOpacity`
  align-self: center;
  padding: 10px 12%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #17a525;
  border-radius: 24px;
  margin-left: 8px;
`;

const CloseButton = styled.TouchableOpacity`
  align-self: center;
  padding: 10px 12%;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
  width: 80%;
  background-color: white;
  border: 1px solid #888;
  border-radius: 24px;
  margin-top: 8px;
`;