import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, View, StatusBar, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const weatherOptions = {
    Haze: {
        iconName: "weather-hazy",
        gradient: ["#23074d", "#cc5333"],
        title: "Haze",
        subtitle: "Just don't go outside.",
    },
    Mist: {
        iconName: "weather-fog",
        gradient: ["#667db6", "#fdeff9"],
        title: "Fog",
        subtitle: "Just don't go outside.",
    },
    Dust: {
        iconName: "weather-hail",
        gradient: ["#3C3B3F", "#605C3C"],
        title: "Dust",
        subtitle: "Just don't go outside.",
    },
    Thunderstorm: {
        iconName: "weather-tornado",
        gradient: ["#ADA996", "#fdeff9"],
        title: "Thunderstorm",
        subtitle: "Just don't go outside.",
    },
    Drizzle: {
        iconName: "weather-rainy",
        gradient: ["#396afc", "#2948ff"],
        title: "Drizzle",
        subtitle: "Just don't go outside.",
    },
    Rain: {
        iconName: "weather-pouring",
        gradient: ["#36D1DC", "#5B86E5"],
        title: "Rain",
        subtitle: "Just don't go outside.",
    },
    Snow: {
        iconName: "weather-snowy",
        gradient: ["#2C3E50", "#4CA1AF"],
        title: "Snow",
        subtitle: "Play outside.",
    },
    Clear: {
        iconName: "weather-sunny",
        gradient: ["#fd746c", "#ff9068"],
        title: "Sunny",
        subtitle: "Play outside. Play outside ",
    },
    Clouds: {
        iconName: "weather-cloudy",
        gradient: ["#000000", "#434343"],
        title: "Clouds",
        subtitle: "Play outside.",
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
                source={require("../img/weather/sun.png")}
            />
            <Text style={{ lineHeight: 23, marginLeft: 3, fontSize: 17 }}>
                {temp}°C
            </Text>
        </View>
    );
}

Weather.propTypes = {
    temp: PropTypes.number.isRequired,
    condition: PropTypes.oneOf([
        "Haze",
        "Mist",
        "Dust",
        "Thunderstorm",
        "Drizzle",
        "Rain",
        "Snow",
        "Atmosphere",
        "Clear",
        "Clouds",
    ]),
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
    },
});
