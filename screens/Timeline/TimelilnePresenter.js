import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Dimensions, Image } from "react-native";
import Timeline from "react-native-timeline-flatlist";
import { AntDesign } from "@expo/vector-icons";
import {
    ScrollView,
    TextInput,
    TouchableOpacity,
} from "react-native-gesture-handler";
import * as Location from "expo-location";
import axios from "axios";
import { Alert } from "react-native";
import Weather from "../../components/weather";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";

const API_KEY = "f32d3ba57242e98dad9a1c4348095ab2";

const { height: HEIGHT } = Dimensions.get("window");

export default (props) => {
    const { date, setDate, data, setData, uid } = props;
    const [addr, setAddr] = useState("");

    // const [cur, setCur] = useState({});

    // const current = async () => {
    //     const user = await GoogleSignIn.getCurrentUser();
    //     setCur(user);
    // };

    const reverseGeo = async (lat, lng) => {
        const addr = await axios
            .get(
                `https://maps.googleapis.com/maps/api/geocode/json?language=ko&latlng=${lat},${lng}&key=AIzaSyAnAqhQJoss5tYolzrzDD7kyQbaMUTtyuM`
            )
            .then(function (response) {
                setAddr(response.data.results[0].formatted_address);
                setIsAddress(true);
            });
        // return await Location.reverseGeocodeAsync({
        //     latitude: Number(lat),
        //     longitude: Number(lng),
        // });
    };

    const convertData = data.map((s) => ({
        id: s.id,
        time: moment(s.date).format("kk:mm"),
        title: s.title,
        description: s.placeName,
        latitude: s.latitude,
        longitude: s.longitude,
    }));

    const [selected, setSelected] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [condition, setCondition] = useState("");
    const [temp, setTemp] = useState("");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [location, setLocation] = useState({});
    const [isLocation, setIsLocation] = useState(false);
    const [isAddress, setIsAddress] = useState(false);

    // useEffect(() => {
    //     (async () => {
    //         let { status } = await Location.requestPermissionsAsync();
    //         if (status !== "granted") {
    //             setErrorMsg("Permission to access location was denied");
    //         }

    //         let location = await Location.getCurrentPositionAsync({});
    //         setLocation(location);
    //     })();
    // }, []);

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
                timestamp,
            } = await Location.getCurrentPositionAsync();
            // console.log(new Date(timestamp).getMinutes());
            setLocation({ latitude, longitude });
            setIsLocation(true);
            reverseGeo(latitude, longitude);
            getWeather(latitude, longitude);
        } catch (error) {
            Alert.alert("Can't find", "So sad");
        }
    };

    // const getTimeline = async () => {
    //     const data = await axios
    //         .get(`http://210.107.78.156:9009/api/timeline/${date}`)
    //         .then(function (response) {
    //             setData(response.data);
    //         });

    //     // console.log(data.request._response);
    // };

    useEffect(() => {
        getLocation();
        // current();
        // if (data.length > 0) printData();
    }, []);

    const onEventPress = (data) => {
        setSelected(data);
        reverseGeo(data.latitude, data.longitude);
    };

    const submitLocation = () => {
        getLocation();
        if (isAddress && isLocation) {
            // console.log("위치", location);
            // console.log("주소", addr);
            const postData = {
                userId: 105191400324450530000,
                // userId: uid,
                placeName: addr,
                latitude: location.latitude,
                longitude: location.longitude,
                distance: 0.0,
            };
            const newData = {
                time: moment(new Date()).format("kk:mm"),
                title: " ",
                description: addr,
                latitude: Location.latitude,
                longitude: Location.longitude,
            };
            axios
                .post("http://210.107.78.156:9001/api/timeline/", postData)

                .then(setData([...data, newData]))
                .then(function (response) {
                    Alert.alert("현재위치가 등록되었습니다.");
                });
        }
    };

    const [place, setPlace] = useState("");

    const changePlace = (selected) => {
        // console.log(selected);
        setData(
            data.map((item) =>
                item.id === selected.id ? { ...item, title: place } : item
            )
        );

        const modifyData = {
            id: selected.id,
            userId: 105191400324450530000,
            address: place,
            placeName: selected.description,
            latitude: selected.latitude,
            longitude: selected.longitude,
            distance: 0.0,
        };
        axios
            .put("http://210.107.78.156:9001/api/timeline/", modifyData)
            .then(function (response) {
                // console.log("성공");
            });

        setSelected(null);
        setPlace("");
    };

    const renderSelected = () => {
        if (selected) {
            return (
                // <Text style={{ marginTop: 10 }}>
                //     선택된 일정 : {selected.title} at {selected.time}
                // </Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputPlace}
                        placeholder="장소를 입력해주세요!"
                        onChangeText={(text) => setPlace(text)}
                        value={place}
                    />
                    <TouchableOpacity
                        onPress={() => changePlace(selected)}
                        style={styles.inputButton}
                    >
                        <Text style={styles.inputText}>장소 입력</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    };

    const renderDetail = (rowData, sectionID, rowID) => {
        let title = <Text style={[styles.title]}>{rowData.title}</Text>;
        var desc = null;
        if (rowData.description) {
            desc = (
                <View style={styles.descriptionContainer}>
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

    return (
        <>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                date={date}
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
            {/* <View style={styles.container}>
                <Text>{data[2].placeName}</Text>
                <ScrollView>
                    {data.map((obj) => {
                        return (
                            <View key={obj.id}>
                                <Text style={{ color: "black" }}>
                                    {obj.placeName}
                                </Text>
                            </View>
                        );
                    })}
                </ScrollView>
            </View> */}
            <View style={styles.container}>
                {renderSelected()}
                <Timeline
                    style={styles.list}
                    circleSize={12}
                    circleColor="gray"
                    lineColor="gray"
                    lineWidth={1}
                    separator={true}
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
                    data={data}
                    renderEvent={renderDetail}
                    onEventPress={onEventPress}
                />
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={submitLocation}
                >
                    <Text style={styles.submitText}>등록!</Text>
                </TouchableOpacity>
            </View>
            {/* <View>
                <Text>{uid}</Text>
            </View> */}
        </>
    );
};
const styles = StyleSheet.create({
    inputText: {
        color: "white",
        textAlign: "center",
    },
    inputButton: {
        elevation: 5,
        paddingTop: 8,
        height: 40,
        backgroundColor: "rgb(202,216,228)",
        width: 80,
        borderRadius: 16,
        // marginLeft: 20,
        // marginTop: 10,
    },
    inputPlace: {
        borderRadius: 16,
        borderWidth: 0.5,
        height: 40,
        paddingLeft: 15,
        width: 280,
    },
    inputContainer: {
        flexDirection: "row",
    },
    submitText: {
        color: "white",
        textAlign: "center",
    },
    submitButton: {
        marginLeft: 280,
        width: 100,
        height: 25,
        lineHeight: 25,
        borderRadius: 20,
        backgroundColor: "rgb(202,216,228)",
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
        top: 12,
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
