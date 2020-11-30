import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, View, StatusBar, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const images = {
    Clear: {
        uri: require("../img/weather/Clear.png"),
    },
    Clouds: {
        uri: require("../img/weather/Clouds.png"),
    },
    Dust: {
        uri: require("../img/weather/Dust.png"),
    },
    Fog: {
        uri: require("../img/weather/Fog.png"),
    },
    Mist: {
        uri: require("../img/weather/Mist.png"),
    },
    Rain: {
        uri: require("../img/weather/Rain.png"),
    },
    Smoke: {
        uri: require("../img/weather/Smoke.png"),
    },
    Sun: {
        uri: require("../img/weather/Sun.png"),
    },
    Thunderstorm: {
        uri: require("../img/weather/Thunderstorm.png"),
    },
};

export default function Weather({ temp, condition }) {
    return (
        <View style={styles.container}>
            {/* <MaterialCommunityIcons
                color="black"
                name={weatherOptions[condition]?.iconName}
                size={30}
            /> */}
            <Image
                style={{ width: 30, height: 30 }}
                source={images[condition]?.uri}
                // source={require("../img/weather/Clear.png")}
            />
            <Text style={{ lineHeight: 23, marginLeft: 3, fontSize: 17 }}>
                {temp}°C
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
    },
});
