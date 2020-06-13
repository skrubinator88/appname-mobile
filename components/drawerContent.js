import React, { useContext } from "react";
import { View, Text } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

import { AuthContext } from "./context";

export function DrawerContent(props) {
  const { signOut } = useContext(AuthContext);

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View>
          <Text>Main Content</Text>
        </View>
      </DrawerContentScrollView>
      <DrawerItem
        label="Sign Out"
        onPress={() => signOut()}
        icon={() => (
          <MaterialIcons name="exit-to-app" size={24} color="black" />
        )}
      />
    </View>
  );
}
