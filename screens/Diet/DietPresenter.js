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
const API_KEY = "f32d3ba57242e98dad9a1c4348095ab2";

const { height: HEIGHT } = Dimensions.get("window");

export default ({ user }) => {
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
            <View style={styles.dietContainer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalCaloriesData}>1262 kcal</Text>
                    <Text style={styles.totalCaloriesTitle}>
                        총 섭취 칼로리
                    </Text>
                </View>
                <ScrollView style={styles.dietHistoryContainer}>
                    <View style={styles.dietHistoryItem}>
                        <Image
                            style={styles.dietImage}
                            source={require("../../img/diet/coffee.png")}
                        />
                        <View style={styles.dietDesc}>
                            <Text style={styles.dietMenu}>
                                스타벅스 라임모히토티
                            </Text>

                            <Text style={styles.dietCalories}>140 kcal</Text>
                        </View>
                    </View>
                    <View style={styles.dietHistoryItem}>
                        <Image
                            style={styles.dietImage}
                            source={require("../../img/diet/jokbal.png")}
                        />
                        <View style={styles.dietDesc}>
                            <Text style={styles.dietMenu}>
                                족발의 장인 보쌈정식
                            </Text>

                            <Text style={styles.dietCalories}>654 kcal</Text>
                        </View>
                    </View>
                    <View style={styles.dietHistoryItem}>
                        <Image
                            style={styles.dietImage}
                            source={require("../../img/diet/pizza.png")}
                        />
                        <View style={styles.dietDesc}>
                            <Text style={styles.dietMenu}>
                                파파존스 슈퍼파파스
                            </Text>

                            <Text style={styles.dietCalories}>468 kcal</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    dietCalories: {
        fontWeight: "bold",
        fontSize: 18,
        color: "grey",
        position: "absolute",
        right: -50,
        bottom: 0,
    },
    dietMenu: {
        color: "grey",
        fontSize: 14,
        fontWeight: "bold",
    },
    dietDesc: {
        marginLeft: 20,
    },
    dietImage: {
        width: 110,
        height: 110,
    },
    dietHistoryItem: {
        flexDirection: "row",
        paddingVertical: 20,
        borderBottomWidth: 0.5,
        borderColor: "grey",
    },
    dietHistoryContainer: {
        paddingHorizontal: 40,
    },
    totalCaloriesTitle: {
        marginTop: 10,
        color: "grey",
    },
    totalCaloriesData: {
        fontSize: 22,
        fontWeight: "bold",
    },
    totalContainer: {
        paddingVertical: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    dietContainer: {
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
