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
import DropDownPicker from "react-native-dropdown-picker";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import Weather from "../../components/weather";
import * as Location from "expo-location";
import axios from "axios";
import { Alert } from "react-native";
import { PieChart } from "react-native-chart-kit";

const API_KEY = "f32d3ba57242e98dad9a1c4348095ab2";

const { height: HEIGHT } = Dimensions.get("window");

const dropdownData = [
    { value: "식비" },
    { value: "패션/미용" },
    { value: "교육" },
    { value: "문화생활" },
    { value: "기타" },
];

const data = [
    {
        name: "교육",
        population: 825,
        color: "#bee8e5",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
    },
    {
        name: "패션/미용",
        population: 68,
        color: "#9ee4e7",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
    },
    {
        name: "문화생활",
        population: 61,
        color: "#8dd5f5",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
    },
    {
        name: "식비",
        population: 44,
        color: "#61c7ff",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
    },
];

export default () => {
    const [isLoading, setIsLoading] = useState(true);
    const [condition, setCondition] = useState("");
    const [temp, setTemp] = useState("");
    const [date, setDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedTab, setSelectedTab] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [place, setPlace] = useState("");
    const [price, setPrice] = useState("");
    const [tab, setTab] = useState("");

    const showCart = () => {
        setSelectedTab(false);
    };
    const showHistory = () => {
        setSelectedTab(true);
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
                        <Weather
                            temp={Math.round(temp)}
                            // condition={condition}
                        />
                    </View>
                )}
            </View>
            {selectedTab ? (
                <View style={styles.spendContainer}>
                    <View style={styles.totalContainer}>
                        <Text style={styles.spendText}>총 지출</Text>
                        <Text style={styles.total}>727,100 원</Text>
                    </View>
                    <View style={styles.spendIndex}>
                        <Text style={styles.spendText}>내용</Text>
                        <Text style={styles.spendText}>금액</Text>
                    </View>
                    <ScrollView style={styles.spendScroll}>
                        <View style={styles.spend}>
                            <View style={styles.spendItem}>
                                <Text style={styles.spendText}>스타벅스</Text>
                                <Text
                                    style={[
                                        styles.spendText,
                                        styles.spendCategory,
                                    ]}
                                >
                                    식비
                                </Text>
                            </View>
                            <Text style={[styles.spendText, styles.spendCash]}>
                                6,100원
                            </Text>
                        </View>
                        <View style={styles.spend}>
                            <View style={styles.spendItem}>
                                <Text style={styles.spendText}>
                                    인터넷 쇼핑
                                </Text>
                                <Text
                                    style={[
                                        styles.spendText,
                                        styles.spendCategory,
                                    ]}
                                >
                                    패션/미용
                                </Text>
                            </View>
                            <Text style={[styles.spendText, styles.spendCash]}>
                                50,000원
                            </Text>
                        </View>
                        <View style={styles.spend}>
                            <View style={styles.spendItem}>
                                <Text style={styles.spendText}>멀티캠퍼스</Text>
                                <Text
                                    style={[
                                        styles.spendText,
                                        styles.spendCategory,
                                    ]}
                                >
                                    교육
                                </Text>
                            </View>
                            <Text style={[styles.spendText, styles.spendCash]}>
                                600,000원
                            </Text>
                        </View>
                        <View style={styles.spend}>
                            <View style={styles.spendItem}>
                                <Text style={styles.spendText}>파파존스</Text>
                                <Text
                                    style={[
                                        styles.spendText,
                                        styles.spendCategory,
                                    ]}
                                >
                                    식비
                                </Text>
                            </View>
                            <Text style={[styles.spendText, styles.spendCash]}>
                                26,100원
                            </Text>
                        </View>
                        <View style={styles.spend}>
                            <View style={styles.spendItem}>
                                <Text style={styles.spendText}>예술의전당</Text>
                                <Text
                                    style={[
                                        styles.spendText,
                                        styles.spendCategory,
                                    ]}
                                >
                                    문화생활
                                </Text>
                            </View>
                            <Text style={[styles.spendText, styles.spendCash]}>
                                46,000원
                            </Text>
                        </View>
                    </ScrollView>
                </View>
            ) : (
                <View style={styles.spendContainer}>
                    <PieChart
                        style={{ paddingTop: 5 }}
                        data={data}
                        width={Dimensions.get("window").width}
                        height={220}
                        chartConfig={{
                            backgroundColor: "#e26a00",
                            backgroundGradientFrom: "#fb8c00",
                            backgroundGradientTo: "#ffa726",
                            decimalPlaces: 2, // optional, defaults to 2dp
                            color: (opacity = 1) =>
                                `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) =>
                                `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                        }}
                        accessor="population"
                        backgroundColor="transparent"
                        absolute
                        paddingLeft={100}
                        hasLegend={false}
                    />
                    <View style={styles.allContainer}>
                        <View style={styles.allIndex}>
                            <Text>통계</Text>
                            <Text>내용</Text>
                            <Text>금액</Text>
                        </View>
                        <ScrollView>
                            <View style={styles.allItem}>
                                <Text style={styles.allText}>82.5%</Text>
                                <Text style={styles.allText}>교육</Text>
                                <Text style={styles.allText}>600,000원</Text>
                            </View>
                            <View style={styles.allItem}>
                                <Text style={styles.allText}>6.8%</Text>
                                <Text style={styles.allText}>패션/미용</Text>
                                <Text style={styles.allText}>50,000원</Text>
                            </View>
                            <View style={styles.allItem}>
                                <Text style={styles.allText}>6.1%</Text>
                                <Text style={styles.allText}>문화생활</Text>
                                <Text style={styles.allText}>45,000원</Text>
                            </View>
                            <View style={styles.allItem}>
                                <Text style={styles.allText}>4.4%</Text>
                                <Text style={styles.allText}>식비</Text>
                                <Text style={styles.allText}>32,100원</Text>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            )}

            <View style={styles.spendTab}>
                <TouchableOpacity onPress={showHistory}>
                    <Text
                        style={[
                            styles.spendText,
                            {
                                color: selectedTab ? "black" : "grey",
                                fontWeight: selectedTab ? "bold" : "normal",
                            },
                        ]}
                    >
                        거래내역
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={showCart}>
                    <Text
                        style={[
                            styles.spendText,
                            {
                                color: selectedTab ? "grey" : "black",
                                fontWeight: selectedTab ? "normal" : "bold",
                            },
                        ]}
                    >
                        통계차트
                    </Text>
                </TouchableOpacity>
            </View>
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
                                <DropDownPicker
                                    style={{
                                        marginRight: 10,
                                        borderTopLeftRadius: 10,
                                        borderTopRightRadius: 10,
                                        borderBottomLeftRadius: 10,
                                        borderBottomRightRadius: 10,
                                        backgroundColor: "#fafafa",
                                    }}
                                    dropDownStyle={{
                                        borderBottomLeftRadius: 20,
                                        borderBottomRightRadius: 20,
                                        backgroundColor: "#fafafa",
                                        elevation: 3,
                                    }}
                                    items={[
                                        { label: "식비", value: "식비" },
                                        {
                                            label: "패션/미용",
                                            value: "패션/미용",
                                        },
                                        { label: "교육", value: "교육" },
                                        {
                                            label: "문화생활",
                                            value: "문화생활",
                                        },
                                        { label: "기타", value: "기타" },
                                    ]}
                                    defaultValue="식비"
                                    containerStyle={{ height: 40, width: 100 }}
                                    onChangeItem={(item) => setTab(item.value)}
                                />
                                <TextInput
                                    style={styles.inputPlace}
                                    placeholder="장소"
                                    onChangeText={(text) => setPlace(text)}
                                    value={place}
                                />
                                <TextInput
                                    style={styles.inputPrice}
                                    placeholder="가격"
                                    onChangeText={(text) => setPrice(text)}
                                    value={price}
                                />
                            </View>
                            <TouchableOpacity
                                style={{
                                    ...styles.openButton,
                                    backgroundColor: "#2196F3",
                                }}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                    console.log(tab, place, price);
                                }}
                            >
                                <Text style={styles.textStyle}>등록하기!</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </>
    );
};
const styles = StyleSheet.create({
    inputPrice: {
        width: 100,
        paddingLeft: 10,
        borderWidth: 0.5,
        borderRadius: 15,
        marginLeft: 15,
    },
    inputPlace: {
        width: 100,
        paddingLeft: 10,
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
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    submitContainer: {
        paddingBottom: 20,
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
    allText: {
        fontSize: 12,
    },
    allItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 15,
        marginHorizontal: 40,
        paddingHorizontal: 15,
        borderBottomWidth: 0.2,
        borderColor: "grey",
    },
    allIndex: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 15,
        marginHorizontal: 40,
        paddingHorizontal: 15,
        borderBottomWidth: 1.2,
        borderColor: "grey",
    },
    allContainer: {
        // paddingTop: 20,
    },
    spendTab: {
        flexDirection: "row",
        backgroundColor: "white",
        paddingHorizontal: 130,
        paddingVertical: 28,
        justifyContent: "space-between",
    },
    spendCategory: {
        fontSize: 11,
    },
    spendCash: {
        lineHeight: 30,
    },
    spend: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 15,
        marginHorizontal: 40,
        paddingHorizontal: 15,
        borderBottomWidth: 0.2,
        borderColor: "grey",
    },
    spendIndex: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 30,
        paddingBottom: 10,
        borderBottomWidth: 1.2,
        borderColor: "grey",
        marginHorizontal: 40,
        paddingHorizontal: 15,
    },
    spendText: {
        fontSize: 13,
        color: "grey",
    },
    total: {
        marginLeft: 20,
        fontSize: 18,
        fontWeight: "bold",
    },
    totalContainer: {
        paddingTop: 30,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    spendContainer: {
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
