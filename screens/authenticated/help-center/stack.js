import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import HelpScreen from ".";

export const HelpStack = createStackNavigator();


export function HelpStackScreen() {
  return (
    <HelpStack.Navigator>
      <HelpStack.Screen name="Help Center" component={HelpScreen} />
    </HelpStack.Navigator>
  );
}
