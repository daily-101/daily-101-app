import React, { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import Weather from "../../components/weather";
import * as Location from "expo-location";
import axios from "axios";
import { Alert } from "react-native";
import { BarChart } from "react-native-chart-kit";

const API_KEY = "f32d3ba57242e98dad9a1c4348095ab2";

const { height: HEIGHT } = Dimensions.get("window");

const data = {
    labels: ["00", "06", "09", "12", "15", "18", "21", "24"],
    datasets: [
        {
            data: [48, 99, 229, 131, 66, 30, 14, 0],
        },
    ],
};

export default () => {
    const [isLoading, setIsLoading] = useState(true);
    const [condition, setCondition] = useState("");
    const [temp, setTemp] = useState("");
    const [date, setDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setDate(date);
        hideDatePicker();
    };

    const getWeather = async (latitude, longitude) => {
        const {
            data: {
                main: { temp },
                weather,
            },
        } = await axios.get(
            `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );
        setIsLoading(false);
        setCondition(weather[0].main);
        setTemp(temp);
    };

    const getLocation = async () => {
        try {
            await Location.requestPermissionsAsync();
            const {
                coords: { latitude, longitude },
            } = await Location.getCurrentPositionAsync();

            getWeather(latitude, longitude);
        } catch (error) {
            Alert.alert("Can't find", "So sad");
        }
    };

    useEffect(() => {
        getLocation();
    }, []);

    return (
        <>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                date={date}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
            <View style={styles.topContainer}>
                <Image
                    style={styles.logo}
                    source={require("../../img/logo.png")}
                />
                <Image
                    style={styles.userIcon}
                    source={{
                        uri:
                            "https://cdnb.pikicast.com/200/2017/03/31/200_364017_1490932388.jpeg",
                    }}
                />
                <TouchableOpacity
                    style={styles.dateContainer}
                    onPress={showDatePicker}
                >
                    <Text style={styles.date}>
                        {moment(date).format("MMMM D, YYYY")}
                    </Text>
                    <AntDesign
                        style={styles.underArrow}
                        name="down"
                        size={20}
                        color="black"
                    />
                </TouchableOpacity>
                {isLoading ? null : (
                    <View style={styles.weather}>
                        <Weather
                            temp={Math.round(temp)}
                            // condition={condition}
                        />
                    </View>
                )}
            </View>
            <View style={styles.activityContainer}>
                <View style={styles.totalContainer}>
                    <View style={styles.totalItem}>
                        <Text style={styles.totalData}>617 kcal</Text>
                        <Text style={styles.totalDataTitle}>소비 칼로리</Text>
                    </View>
                    <View style={styles.totalItem}>
                        <Text style={styles.totalData}>2:07:13</Text>
                        <Text style={styles.totalDataTitle}>활동 시간</Text>
                    </View>
                    <View style={styles.totalItem}>
                        <Text style={styles.totalData}>11.34</Text>
                        <Text style={styles.totalDataTitle}>Km</Text>
                    </View>
                </View>
                <View style={styles.barGraph}>
                    <BarChart
                        style={{
                            paddingVertical: 10,
                        }}
                        data={data}
                        width={Dimensions.get("window").width}
                        height={180}
                        chartConfig={{
                            backgroundColor: "white",
                            backgroundGradientFrom: "white",
                            backgroundGradientTo: "white",
                            color: () => "grey",
                            labelColor: () => "black",
                            barPercentage: 1,
                            decimalPlaces: 0,
                        }}
                        withInnerLines={false}
                        fromZero={true}
                        showBarTops={false}
                    />
                </View>
                <ScrollView style={styles.historyContainer}>
                    <Text>AM</Text>
                    <View style={styles.amContainer}>
                        <View style={styles.amItem}>
                            <Text style={styles.historyText}>00</Text>
                            <Text style={styles.historyText}>48 kcal</Text>
                            <Text style={styles.historyText}>0.95 km</Text>
                        </View>
                        <View style={styles.amItem}>
                            <Text style={styles.historyText}>06</Text>
                            <Text style={styles.historyText}>99 kcal</Text>
                            <Text style={styles.historyText}>1.58 km</Text>
                        </View>
                        <View style={styles.amItem}>
                            <Text style={styles.historyText}>09</Text>
                            <Text style={styles.historyText}>229 kcal</Text>
                            <Text style={styles.historyText}>4.41 km</Text>
                        </View>
                    </View>
                    <Text>PM</Text>
                    <View style={styles.amContainer}>
                        <View style={styles.amItem}>
                            <Text style={styles.historyText}>12</Text>
                            <Text style={styles.historyText}>131 kcal</Text>
                            <Text style={styles.historyText}>2.55 km</Text>
                        </View>
                        <View style={styles.amItem}>
                            <Text style={styles.historyText}>15</Text>
                            <Text style={styles.historyText}>66 kcal</Text>
                            <Text style={styles.historyText}>1.1 km</Text>
                        </View>
                        <View style={styles.amItem}>
                            <Text style={styles.historyText}>18</Text>
                            <Text style={styles.historyText}>30 kcal</Text>
                            <Text style={styles.historyText}>0.5 km</Text>
                        </View>
                        <View style={styles.amItem}>
                            <Text style={styles.historyText}>21</Text>
                            <Text style={styles.historyText}>14 kcal</Text>
                            <Text style={styles.historyText}>0.25 km</Text>
                        </View>
                        <View style={styles.amItem}>
                            <Text style={styles.historyText}>24</Text>
                            <Text style={styles.historyText}>0 kcal</Text>
                            <Text style={styles.historyText}>0 km</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    historyText: {
        color: "grey",
    },
    amItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 40,
        paddingVertical: 10,
        borderColor: "grey",
        borderBottomWidth: 0.5,
    },
    amContainer: {
        marginLeft: 10,
    },
    historyContainer: {
        // paddingVertical: 30,
        marginLeft: 70,
        marginVertical: 20,
    },
    barGraph: {
        backgroundColor: "white",
    },
    totalDataTitle: {
        color: "grey",
        fontSize: 13,
    },
    totalData: {
        fontWeight: "bold",
        fontSize: 17,
    },
    totalItem: {
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    totalContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 25,
        marginHorizontal: 40,
    },
    activityContainer: {
        height: "100%",
        backgroundColor: "white",
        flex: 1,
    },
    logo: {
        width: 90,
        height: 25,
        position: "absolute",
        top: 20,
        left: 160,
    },
    userIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        position: "absolute",
        right: 30,
        top: 18,
    },
    dateContainer: {
        width: "100%",
        height: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        top: 30,
    },
    underArrow: {
        top: 3,
        left: 3,
    },
    weather: {
        position: "absolute",
        top: 20,
        left: 20,
    },
    date: {
        // position: "absolute",
        // top: 80,
        // left: 25,
        fontSize: 18,
        fontWeight: "bold",
    },
    topContainer: {
        height: HEIGHT / 4,
        width: "100%",
    },
});
