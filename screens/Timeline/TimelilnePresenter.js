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
import { GoogleAuthData } from "expo-google-sign-in";

const API_KEY = "f32d3ba57242e98dad9a1c4348095ab2";

const { height: HEIGHT } = Dimensions.get("window");

export default (props) => {
    const { date, setDate, data, setData, uid, weather } = props;
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
                address: addr,
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
            // userId: uid,
            address: selected.description,
            placeName: place,
            latitude: selected.latitude,
            longitude: selected.longitude,
            distance: 0.0,
        };
        axios
            .put("http://210.107.78.156:9001/api/timeline/", modifyData)
            .then(function (response) {
                console.log("put 성공");
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

    {
        /**timeline text contents */
    }
    const renderDetail = (rowData, sectionID, rowID) => {
        let title = <Text style={styles.title}>{rowData.title}</Text>;
        var desc = null;
        if (rowData.description) {
            desc = (
                <View style={styles.descriptionContainer}>
                    <Text style={styles.textDescription}>
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
            {/**main header section start */}
            <View style={styles.mainLogo}>
                {/**header logo */}
                <Image
                    style={styles.logo}
                    source={require("../../img/logo.png")}
                />
                {/**header weather */}
                {isLoading ? null : (
                    <View style={styles.weather}>
                        <Weather temp={Math.round(temp)} condition="Clear" />
                    </View>
                )}
                {/**header userIcon */}
                <Image
                    style={styles.userIcon}
                    source={{
                        uri:
                            "https://cdnb.pikicast.com/200/2017/03/31/200_364017_1490932388.jpeg",
                    }}
                />
            </View>

            <View style={styles.topContainer}>
                {/**DatePicker */}
                <Text style={styles.dateText}>
                    {moment(date).format("MMMM D, YYYY")}
                </Text>
                {/**datePicker underArrow */}
                <TouchableOpacity onPress={showDatePicker}>
                    <AntDesign
                        style={styles.underArrow}
                        name="down"
                        size={20}
                        color="black"
                    />
                </TouchableOpacity>
            </View>
            {/**main header section end */}

            {/* <View style={styles.cardContainer}>
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
            </View> */}
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
            <View style={styles.mainContents}>
                <View style={styles.container}>
                    {renderSelected()}
                    <Timeline
                        style={styles.list}
                        circleSize={10}
                        circleColor="#c1e2f1"
                        lineColor="rgb(201,201,201)"
                        lineWidth={1}
                        separator={true}
                        titleStyle={{ marginTop: -14 }}
                        timeContainerStyle={{ minWidth: 50, marginTop: -10 }}
                        timeStyle={{
                            textAlign: "center",
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
                </View>
                <View style={styles.submitBtnSection}>
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={submitLocation}
                    >
                        <Text style={styles.submitText}>현재위치등록</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};
const styles = StyleSheet.create({
    //장소입력 버튼 text
    inputText: {
        color: "black",
        textAlign: "center",
    },
    //장소입력 버튼
    inputButton: {
        width: 80,
        height: 25,
        right: 20,
        lineHeight: 25,
        borderRadius: 20,
        backgroundColor: "rgb(245,245,245)",
        justifyContent: "center",
    },
    //장소입력 창
    inputPlace: {
        borderRadius: 3,
        borderWidth: 0.1,
        height: 30,
        width: 200,
        left: 20,
        paddingLeft: 20,
    },
    //장소입력 section
    inputContainer: {
        // backgroundColor:"red",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 60,
    },

    //현재위치등록버튼section
    submitBtnSection: {
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        // top:9,
        height: 57,
        // bottom:5,
    },
    //현재위치등록등록 버튼 text
    submitText: {
        color: "black",
        textAlign: "center",
    },
    //현재위치등록 버튼
    submitButton: {
        width: 100,
        height: 25,
        lineHeight: 25,
        borderRadius: 20,
        backgroundColor: "rgb(245,245,245)",
        justifyContent: "center",
    },

    //main Header Style start
    //Header1
    mainLogo: {
        height: 50,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // left:20,
        backgroundColor: "#f5f5f5",
        // top:10,
    },
    //Logo
    logo: {
        width: 60,
        height: 18,
        left: 20,
    },
    //header1-weather
    weather: {
        left: 70,
    },
    //User Login Icon
    userIcon: {
        width: 25,
        height: 25,
        borderRadius: 15,
        right: 20,
    },

    //header2
    topContainer: {
        height: 90,
        // width: 230,
        flexDirection: "row",
        // justifyContent:'space-between',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        textAlign: "center",
    },

    //header2-datePicker
    //dateAllConcept
    dateStyle: {
        backgroundColor: "blue",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        // top: 12,
    },
    //date Text
    dateText: {
        fontSize: 20,
        color: "black",
        fontFamily: "NanumSquare_acEB",
        // left:20,
        // right:5,
    },
    //date Arrow
    underArrow: {
        // top: 0,
        left: 2,
        color: "black",
    },
    //main Header Style end

    //mainContents Section
    mainContents: {
        // flexDirection:"row",
        // justifyContent:'center',
        // alignContent: 'space-between',
        // backgroundColor:'red',
    },
    //timeline Section
    container: {
        fontFamily: "NanumSquare_acL",
        // flex: 1,
        height: 370,
        backgroundColor: "white",
        width: "100%",
        // flexDirection: "row",
        // justifyContent: "center",
        // alignItems: "center",
    },
    //timeline scroll
    list: {
        // flex: 1,
        height: 400,
        marginLeft: 20,
        marginRight: 20,
        // marginTop: 5,
        backgroundColor: "white",
        // left:20,
        // right:20,
        // width:"100%",
    },
    //timeline spot
    title: {
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: "NanumSquare_acL",
        color: "red",
    },
    //
    descriptionContainer: {
        flexDirection: "row",
        // paddingRight: 50,
        color: "gold",
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    //timeline text address
    textDescription: {
        marginLeft: 10,
    },
    //main icon box
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
    //main icon Group
    cardContainer: {
        flexDirection: "row", //row로 정렬
        // position: "absolute",
        elevation: 3,
        // top: 160,
        backgroundColor: "gray",
        // left: 30,
    },
});
