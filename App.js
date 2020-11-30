import { NavigationContainer } from "@react-navigation/native";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import React, { useState } from "react";
import { Image, StatusBar } from "react-native";
import Stack from "./navigation/Stack";
import { Provider } from "mobx-react";
import UserStore from "./Store/UserStore";

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
            require("./assets/splash.png"),
            require("./assets/adaptive-icon.png"),
            require("./assets/icon.png"),
            require("./assets/splash.png"),
            require("./img/bottom_tap/activity.png"),
            require("./img/bottom_tap/diet.png"),
            require("./img/bottom_tap/spend.png"),
            require("./img/bottom_tap/timeline.png"),
            require("./img/timeline_tap/activity.png"),
            require("./img/timeline_tap/diet.png"),
            require("./img/timeline_tap/spend.png"),
            require("./img/timeline_tap/walk.png"),
            require("./img/logo.png"),
            require("./img/weather/Sun.png"),
            require("./img/weather/Clear.png"),
            require("./img/weather/Clouds.png"),
            require("./img/weather/Dust.png"),
            require("./img/weather/Fog.png"),
            require("./img/weather/Mist.png"),
            require("./img/weather/Rain.png"),
            require("./img/weather/Smoke.png"),
            require("./img/weather/Snow.png"),
            require("./img/weather/Thunderstorm.png"),
        ]);
    };

    return (
        <>
            <NavigationContainer>
                <Provider UserStore={UserStore}>
                    <Stack />
                </Provider>
            </NavigationContainer>
            <StatusBar barStyle="ligth-content" />
        </>
    );
}
