import React, { useLayoutEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import Activity from "../screens/Activity";
import Diet from "../screens/Diet";
import Spend from "../screens/Spend";
import Timeline from "../screens/Timeline";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { View, Text, Alert, Image } from "react-native";

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
            style={{position:'absolute', hight:100}}
            screenOptions={({ route }) => {
                return {
                    tabBarIcon : ({focused}) => {
                        let imgPath;
                        let focusImagePath;
                        if (route.name === "타임라인"){
                            imgPath = require("../img/bottom_tap/timeline_icon_gray.png");
                            focusImagePath = require("../img/bottom_tap/timeline.png")
                        }
                        else if (route.name === "활동량"){
                            imgPath = require("../img/bottom_tap/activity_icon_gray.png");
                            focusImagePath = require("../img/bottom_tap/activity.png")
                        }
                        else if (route.name === "소비"){
                            imgPath = require("../img/bottom_tap/spend_icon_gray.png");
                            focusImagePath = require("../img/bottom_tap/spend.png")
                        }
                        else if (route.name === "식단"){
                            imgPath = require("../img/bottom_tap/diet_icon_gray.png");
                            focusImagePath = require("../img/bottom_tap/diet.png")
                        }
                        return (
                            
                            <Image
                                style={{ width: 25, height: 25, Bottom:20 }}
                                source = {focused ? focusImagePath : imgPath}
                            />
                           
                            // <MaterialIcons
                            //     name={iconName}
                            //     color={focused ? "blue" : "grey"}
                            //     size={26}
                            // />
                        );
                    },
                };
            }}
        >
            <Tabs.Screen name="타임라인" in component={Timeline} />
            <Tabs.Screen name="활동량" component={Activity} />
            <Tabs.Screen name="소비" component={Spend} />
            <Tabs.Screen name="식단" component={Diet} />
        </Tabs.Navigator>
    );
};
