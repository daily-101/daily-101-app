import React, { useEffect, useState } from "react";
import {
    Dimensions,
    Image,
    Modal,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import Weather from "../../components/weather";
import * as Location from "expo-location";
import axios from "axios";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as firebase from "firebase";
const API_KEY = "f32d3ba57242e98dad9a1c4348095ab2";

const { height: HEIGHT } = Dimensions.get("window");

export default (props) => {
    const { date, setDate, data, setData } = props;
    let totalCal = 0;
    console.log(data);
    data.map((d) => (totalCal += Number(d.calories)));

    const [isLoading, setIsLoading] = useState(true);
    const [condition, setCondition] = useState("");
    const [temp, setTemp] = useState("");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [filename, setFilename] = useState("");
    const [foodName, setFoodName] = useState("");
    const [calories, setCalories] = useState("");
    const [result, setResult] = useState({});

    const submitDiet = () => {
        const postData = {
            userId: 105191400324450530000,
            filename: filename + ".jpg",
            calories: calories,
            foodName: foodName,
        };
        const newData = {
            filename: filename + ".jpg",
            calories: calories,
            foodName: foodName,
            imgUrl: result.uri,
        };
        axios
            .post("http://210.107.78.156:9004/api/food/", postData)
            .then(console.log("food success"))
            .then(uploadImage(result.uri))
            .then(console.log("upload success"))
            .then(setData([...data, newData]))
            .then(setModalVisible(false));
    };

    const onChooseImage = async () => {
        // let result = await ImagePicker.launchCameraAsync();
        const result = await ImagePicker.launchImageLibraryAsync();

        setResult(result);
    };

    const uploadImage = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        var ref = firebase
            .storage()
            .ref()
            .child(filename + ".jpg");
        return ref.put(blob);
    };

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
                        <Weather temp={Math.round(temp)} condition="Clear" />
                    </View>
                )}
            </View>
            <View style={styles.dietContainer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalCaloriesData}>
                        {totalCal} kcal
                    </Text>
                    <Text style={styles.totalCaloriesTitle}>
                        총 섭취 칼로리
                    </Text>
                </View>
                <ScrollView style={styles.dietHistoryContainer}>
                    {data
                        ? data.map((temp) => (
                              <View style={styles.dietHistoryItem}>
                                  <Image
                                      style={styles.dietImage}
                                      source={{
                                          uri: temp.imgUrl,
                                      }}
                                  />
                                  <View style={styles.dietDesc}>
                                      <Text style={styles.dietMenu}>
                                          {temp.foodName}
                                      </Text>

                                      <Text style={styles.dietCalories}>
                                          {temp.calories} kcal
                                      </Text>
                                  </View>
                              </View>
                          ))
                        : null}
                </ScrollView>
                <View style={styles.submitContainer}>
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        style={styles.submitButton}
                    >
                        <Text style={styles.submitText}>등록</Text>
                    </TouchableOpacity>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => {
                            setModalVisible(false);
                        }}
                        visible={modalVisible}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <View style={styles.modelInput}>
                                    <TextInput
                                        style={styles.inputPlace}
                                        placeholder="파일이름"
                                        onChangeText={(text) =>
                                            setFilename(text)
                                        }
                                        value={filename}
                                    />
                                    <TextInput
                                        style={styles.inputPrice}
                                        placeholder="음식이름"
                                        onChangeText={(text) =>
                                            setFoodName(text)
                                        }
                                        value={foodName}
                                    />
                                    <TextInput
                                        style={styles.inputPrice}
                                        placeholder="칼로리"
                                        onChangeText={(text) =>
                                            setCalories(text)
                                        }
                                        value={calories}
                                    />
                                </View>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        style={{
                                            ...styles.openButton,
                                            backgroundColor: "#2196F3",
                                        }}
                                        onPress={onChooseImage}
                                    >
                                        <Text style={styles.textStyle}>
                                            사진선택!
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{
                                            ...styles.openButton,
                                            backgroundColor: "#2196F3",
                                        }}
                                        onPress={submitDiet}
                                    >
                                        <Text style={styles.textStyle}>
                                            등록하기!
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        elevation: 2,
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 5,
        marginLeft: 10,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    inputPrice: {
        width: 100,
        paddingLeft: 10,
        borderWidth: 0.5,
        borderRadius: 15,
        marginLeft: 10,
    },
    inputPlace: {
        width: 100,
        paddingLeft: 10,
        marginLeft: 10,
        borderWidth: 0.5,
        borderRadius: 15,
    },
    modelInput: {
        flexDirection: "row",
        marginBottom: 20,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        width: 350,
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    submitContainer: {
        paddingBottom: 10,
        paddingTop: 10,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
    },
    submitText: {
        color: "white",
        textAlign: "center",
    },
    submitButton: {
        width: 100,
        height: 25,
        lineHeight: 25,
        borderRadius: 20,
        backgroundColor: "rgb(202,216,228)",
    },
    dietCalories: {
        width: 100,
        fontWeight: "bold",
        fontSize: 18,
        color: "grey",
        position: "absolute",
        right: -80,
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
