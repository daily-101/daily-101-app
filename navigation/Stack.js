import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Tabs from "./Tabs";
import Login from "../screens/Login";
const Stack = createStackNavigator();

export default () => (
    <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
            headerShown: false,
        }}
    >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Tabs" component={Tabs} />
    </Stack.Navigator>
);
