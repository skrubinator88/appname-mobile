import React, { useState } from 'react';
import CheckBox from '@react-native-community/checkbox'
import ReactNativeModal from 'react-native-modal';
import { TouchableOpacity } from 'react-native';
import Text from '../../../components/text';
import { FlatList } from 'react-native';
import JobSuggestions from "../../../models/fetchedSuggestedItems";
import { Alert } from 'react-native';


const CheckBoxItem = ({ onPress, item, pressed }) =>
{

	return (
		<TouchableOpacity onPress={() => onPress(item)}>
			<CheckBox disabled value={pressed} />
			<Text small bold>{item}</Text>
		</TouchableOpacity >
	)
}

export default function ()
{
	const [selected, setSelected] = useState([])
	return (
		<ReactNativeModal>
			<FlatList
				data={JobSuggestions}
				renderItem={({ item }) => (
					<CheckBoxItem item={item} onPress={(item) =>
					{
						if (selected.length >= 3)
						{
							Alert.alert("Maximum Selection Reached", "You can only pick 3 preferred job types")
							return
						} else
						{
							setSelected({ ...selected, item })
						}
					}}
						pressed={!!selected.find(item)}
					/>
				)}
			/>
		</ReactNativeModal>
	)
}