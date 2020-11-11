import { NavigationContainer } from "@react-navigation/native";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import React, { useState } from "react";
import { Image, StatusBar } from "react-native";
import Stack from "./navigation/Stack";

const cacheImages = (images) =>
    images.map((image) => {
        if (typeof image === "string") {
            return Image.prefetch(image);
        } else {
            return Asset.fromModule(image).downloadAsync();
        }
    });

const cacheFonts = (fonts) => fonts.map((font) => Font.loadAsync(font));

export default function App() {
    const [isReady, setIsReady] = useState(false);
    const loadAssets = () => {
        const images = cacheImages([
            require("./img/bottom_tap/activity.png"),
            require("./img/bottom_tap/diet.png"),
            require("./img/bottom_tap/spend.png"),
            require("./img/bottom_tap/timeline.png"),
            require("./img/timeline_tap/activity.png"),
            require("./img/timeline_tap/diet.png"),
            require("./img/timeline_tap/spend.png"),
            require("./img/timeline_tap/walk.png"),
            require("./img/logo.png"),
            require("./img/weather/sun.png"),
        ]);
    };

    return (
        <>
            <NavigationContainer>
                <Stack />
            </NavigationContainer>
            <StatusBar barStyle="ligth-content" />
        </>
    );
}
