import React, { useLayoutEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import Activity from "../screens/Activity";
import Diet from "../screens/Diet";
import Spend from "../screens/Spend";
import Timeline from "../screens/Timeline";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Tabs = createBottomTabNavigator();

export default ({ navigation, route }) => {
    useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? "Timeline";
        navigation.setOptions({
            title: routeName,
        });
    }, [route]);

    return (
        <Tabs.Navigator
            screenOptions={({ route }) => {
                return {
                    tabBarIcon: ({ focused }) => {
                        let iconName = "";
                        if (route.name === "Timeline") iconName = "timeline";
                        else if (route.name === "Activity")
                            iconName = "directions-run";
                        else if (route.name === "Spend")
                            iconName = "monetization-on";
                        else if (route.name === "Diet") iconName = "restaurant";

                        return (
                            <MaterialIcons
                                name={iconName}
                                color={focused ? "blue" : "grey"}
                                size={26}
                            />
                        );
                    },
                };
            }}
        >
            <Tabs.Screen name="Timeline" component={Timeline} />
            <Tabs.Screen name="Activity" component={Activity} />
            <Tabs.Screen name="Spend" component={Spend} />
            <Tabs.Screen name="Diet" component={Diet} />
        </Tabs.Navigator>
    );
};
