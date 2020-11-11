import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Dimensions, Image } from "react-native";
import Timeline from "react-native-timeline-flatlist";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Location from "expo-location";
import axios from "axios";
import { Alert } from "react-native";
import Weather from "../../components/weather";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";

const API_KEY = "f32d3ba57242e98dad9a1c4348095ab2";

const { height: HEIGHT } = Dimensions.get("window");

export default () => {
    const tmpData = [
        {
            time: "09:00",
            title: "집",
            description: " ",
            // lineColor: "#009688",
            // icon: require("../img/archery.png"),
            imageUrl:
                "https://cloud.githubusercontent.com/assets/21040043/24240340/c0f96b3a-0fe3-11e7-8964-fe66e4d9be7a.jpg",
        },
        {
            time: "10:45",
            title: "스타벅스 정자역점",
            description: "경기 성남시 분당구 성남대로 343번길 12-2",
            // icon: require("../img/badminton.png"),
            imageUrl:
                "https://cloud.githubusercontent.com/assets/21040043/24240405/0ba41234-0fe4-11e7-919b-c3f88ced349c.jpg",
        },
        {
            time: "12:00",
            title: "직장",
            // icon: require("../img/lunch.png"),
        },
        {
            time: "14:00",
            title: "족발의장인족장 분당정자점",
            description: "경기 성남시 분당구 정자일로 156번길 6 뉴본타워",
            // lineColor: "#009688",
            // icon: require("../img/soccer.png"),
            imageUrl:
                "https://cloud.githubusercontent.com/assets/21040043/24240419/1f553dee-0fe4-11e7-8638-6025682232b1.jpg",
        },
        {
            time: "16:30",
            title: "집",
            description: " ",
            // icon: require("../img/dumbbell.png"),
            imageUrl:
                "https://cloud.githubusercontent.com/assets/21040043/24240422/20d84f6c-0fe4-11e7-8f1d-9dbc594d0cfa.jpg",
        },
    ];

    const [selected, setSelected] = useState(null);
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
            console.log(latitude, longitude);
            getWeather(latitude, longitude);
        } catch (error) {
            Alert.alert("Can't find", "So sad");
        }
    };

    useEffect(() => {
        getLocation();
    }, []);

    const onEventPress = (data) => {
        setSelected(data);
    };

    const renderSelected = () => {
        if (selected) {
            return (
                <Text style={{ marginTop: 10 }}>
                    Selected event: {selected.title} at {selected.time}
                </Text>
            );
        }
    };

    const renderDetail = (rowData, sectionID, rowID) => {
        let title = <Text style={[styles.title]}>{rowData.title}</Text>;
        var desc = null;
        if (rowData.description && rowData.imageUrl) {
            desc = (
                <View style={styles.descriptionContainer}>
                    {/* <Image
                        source={{ uri: rowData.imageUrl }}
                        style={styles.image}
                    /> */}
                    <Text style={[styles.textDescription]}>
                        {rowData.description}
                    </Text>
                </View>
            );
        }
        return (
            <View style={{ flex: 1 }}>
                {title}
                {desc}
            </View>
        );
    };

    // const setDate = () => {
    //     setIsDate((prev) => {
    //         return !prev;
    //     });
    // };
    return (
        <>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
            <Image
                style={styles.userIcon}
                source={{
                    uri:
                        "https://cdnb.pikicast.com/200/2017/03/31/200_364017_1490932388.jpeg",
                }}
            />
            <View style={styles.topContainer}>
                <Image
                    style={styles.logo}
                    source={require("../../img/logo.png")}
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
                        size={26}
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
            <View style={styles.cardContainer}>
                <View style={styles.card}>
                    <Image
                        style={{ width: 35, height: 35 }}
                        source={require("../../img/timeline_tap/diet.png")}
                    />
                    <Text>1,700kcal</Text>
                </View>
                <View style={styles.card}>
                    <Image
                        style={{ width: 35, height: 35 }}
                        source={require("../../img/timeline_tap/activity.png")}
                    />
                    <Text>580kcal</Text>
                </View>
                <View style={styles.card}>
                    <Image
                        style={{ width: 35, height: 35 }}
                        source={require("../../img/timeline_tap/walk.png")}
                    />
                    <Text>2:07:13</Text>
                </View>
                <View style={styles.card}>
                    <Image
                        style={{ width: 35, height: 35 }}
                        source={require("../../img/timeline_tap/spend.png")}
                    />
                    <Text>72,700원</Text>
                </View>
            </View>
            <View style={styles.container}>
                {renderSelected()}
                <Timeline
                    style={styles.list}
                    circleSize={12}
                    circleColor="gray"
                    lineColor="gray"
                    lineWidth={1}
                    // separator={true}
                    titleStyle={{ marginTop: -10 }}
                    timeContainerStyle={{ minWidth: 52, marginTop: -10 }}
                    timeStyle={{
                        textAlign: "center",
                        // backgroundColor: "#ff9797",
                        color: "gray",
                        padding: 5,
                        borderRadius: 13,
                    }}
                    // showTime={false}
                    descriptionStyle={{ color: "gray" }}
                    options={{
                        style: { paddingTop: 5 },
                    }}
                    // innerCircle={"dot"}
                    data={tmpData}
                    renderEvent={renderDetail}
                    onEventPress={onEventPress}
                />
            </View>
        </>
    );
};
const styles = StyleSheet.create({
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
        // position: "absolute",
        top: 80,
        left: 20,
    },
    underArrow: {
        top: 5,
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
        fontSize: 24,
        fontWeight: "bold",
    },
    topContainer: {
        height: HEIGHT / 4,
        width: "100%",
    },
    card: {
        marginLeft: 23,
        backgroundColor: "white",
        width: 75,
        height: 75,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "black",
    },
    cardContainer: {
        flexDirection: "row",
        position: "absolute",
        elevation: 3,
        top: 160,
        // left: 30,
    },
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 65,
        backgroundColor: "white",
    },
    list: {
        flex: 1,
        marginTop: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
    },
    descriptionContainer: {
        flexDirection: "row",
        paddingRight: 50,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    textDescription: {
        marginLeft: 10,
        color: "gray",
    },
});
