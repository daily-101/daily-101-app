import { NavigationContainer } from "@react-navigation/native";
import React, { useState } from "react";
import { StatusBar } from "react-native";
import Stack from "./navigation/Stack";

export default function App() {
    const [isReady, setIsReady] = useState(false);
    return (
        <>
            <NavigationContainer>
                <Stack />
            </NavigationContainer>
            <StatusBar barStyle="ligth-content" />
        </>
    );
}
