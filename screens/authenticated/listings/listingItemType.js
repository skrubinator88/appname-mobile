import { Ionicons } from "@expo/vector-icons";
import React, { useLayoutEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native";
import {
  TextInput
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import styled from "styled-components/native";
import GigChaserJobWord from "../../../assets/gig-logo";
import Text from "../../../components/text";
import JobSuggestions from "../../../models/fetchedSuggestedItems";

export function ListingItemType({ visible, onCancel, onSelect }) {
  const [job_type, setJobType] = useState(""); // Input Field
  const searchBarRef = useRef(null);

  let suggestedItems = JobSuggestions.filter((item) => {
    if (item === "Random (No Skill Required)") {
      return true;
    }
    const title = item.toLowerCase();
    const input = job_type.toLowerCase().trim();
    return title.indexOf(input) !== -1;
  });

  useLayoutEffect(() => {
    searchBarRef.current?.focus();
    return () => {
      searchBarRef.current?.clear();
      setJobType('');
    };
  }, [visible]);

  return (
    <Modal
      isVisible={visible}
      avoidKeyboard
      onBackButtonPress={onCancel}
      onBackdropPress={onCancel}
      hasBackdrop
    >
      <SafeAreaView>
        <Item style={{ backgroundColor: 'white', height: '80%', borderRadius: 8, paddingVertical: 16 }}>
          <InputTitle style={{ marginBottom: 12, marginHorizontal: 12 }}>
            <GigChaserJobWord color="#444" width="60px" height="20px" />
            <Text style={{ flex: 1, justifyContent: 'flex-start' }} small bold color="#444">TYPE</Text>
            <TouchableOpacity onPress={onCancel}>
              <Text small color='#007AFF'>CANCEL</Text>
            </TouchableOpacity>
          </InputTitle>
          <SuggestionContainer>
            <SearchBar activeOpacity={0.8} onPress={() => {
              searchBarRef.current?.focus()
            }}>
              <Ionicons name="ios-search" size={16} />
              <TextInput underlineColorAndroid="transparent"
                placeholder="Search Job types"
                placeholderTextColor="#777"
                style={{ fontSize: 16, marginLeft: 4 }}
                value={job_type}
                onChangeText={(text) => setJobType(text)}
                ref={searchBarRef}
                onSubmitEditing={() => {
                  searchBarRef.current?.blur();
                }}
              />
            </SearchBar>
            <SuggestionScrollView
              keyboardShouldPersistTaps="always"
              data={suggestedItems}
              bounces={false}
              keyExtractor={(_, index) => `${index}`}
              renderItem={({ item }) => {
                return (
                  <SearchSuggestedItem
                    activeOpacity={0.9}
                    onPress={() => {
                      onSelect(item);
                    }}
                  >
                    <Text>{item}</Text>
                  </SearchSuggestedItem>
                );
              }} />
          </SuggestionContainer>
        </Item>
      </SafeAreaView>
    </Modal>
  )
}

const SearchBar = styled.TouchableOpacity`
      font-size: 16px;
      border: 2px solid #ededed;
      border-radius: 10px;
      background: white;
      padding: 12px 8px;
      flex-direction: row;
      margin: 10px 12px;
      `;

const Item = styled.View`
      margin: 10px 0;
      `;

const InputTitle = styled.View`
      flex-direction: row;
      align-items: center;
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
      padding: 16px 30px;
      width: 100%;
      `;


