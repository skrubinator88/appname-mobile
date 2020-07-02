import React, { Component } from "react";

import {
  Text,
 CheckBox,
  Alert,
  TouchableWithoutFeedback,
  TextInput,
  View,
  Keyboard,
  ScrollView,
  FlatList
  
} from "react-native";

import { Platform } from "react-native";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";

class contractorApp extends Component {
  state = {
    search: '',
    DATA: [
      {
        id: "1",
        title: "First Item",
      },
      {
        id: "2",
        title: "Second Item",
      },
      {
        id: "3",
        title: "Third Item",
      },
      {
        id: "4",
        title: "Third Item",
      },
      {
        id: "5",
        title: "Third Item",
      },
      {
        id: "6",
        title: "Third Item",
      }
    ]
    
  };



  updateSearch = (search) => {
    this.setState({ search });
    console.log(search)
  };
  render() {
    const { search } = this.state;


    function Item({ title }) {
      return (
        <View >
          <TextResult>{title}</TextResult>
        </View>
      );
    }


    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
  
          <Container>
            <ContainerTop>
  {/* aqui va el header */}
            </ContainerTop>
            <Fields>
              <TextStyledContent>
                Begin typing a skill name and select it from the suggestions. if you don't see your skill, select other.
              </TextStyledContent>
<SearchBox>
<TextInput style={{ marginLeft: 10, marginRight: 10, marginTop:5, borderWidth: 1, borderLeftWidth:0, borderRightWidth:0,borderTopWidth:0, borderColor: "#E0E0E0", fontSize:20, paddingBottom:10 }}
        placeholder="Search skills"
        lightTheme
        leftIconContainerStyle
        onChangeText={this.updateSearch}
        value={search}
      >
      </TextInput>

      <FlatList
        data={this.state.DATA}
        renderItem={({ item }) => <Item title={item.title} />}
        keyExtractor={item => item.id}
      />
</SearchBox>
            </Fields>
          </Container>
      
      </TouchableWithoutFeedback>
    );
  }
}

const Fields = styled.View`
  flex: 0.4;
  margin: 20px;
`;

const SearchBox = styled.View`
  margin: 20px;
  border-width:1px;
  padding:10px;
  border-radius:20px;
  border-color: #E0E0E0;
`;

const Container = styled.View`
  flex: 1;
`;

const ContainerTop = styled.View`
  flex: 0.15;
  background: red;
`;

const TextStyledContent = styled.Text`
text-align: center;
  font-size: ${() => (Platform.OS == "ios" ? "25px" : "20px")};
`;

const TextResult = styled.Text`
margin-top:10px;
margin-bottom:10px;
margin-left: 10px;
color: #A5A5A5;
  font-size: ${() => (Platform.OS == "ios" ? "25px" : "17px")};
`;

export default contractorApp;
