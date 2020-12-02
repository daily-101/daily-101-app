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

export default (props) => {
    const { date, setDate, spendData, setData, allCost, getSpendList } = props;
    let totalCost = 0;
    spendData.map((data) => (totalCost += Number(data.cost)));

    const data = [
        {
            name: "식비",
            population: allCost[0],
            color: "#bee8e5",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
        },
        {
            name: "패션/미용",
            population: allCost[1],
            color: "#9ee4e7",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
        },
        {
            name: "교육",
            population: allCost[2],
            color: "#8dd5f5",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
        },
        {
            name: "문화생활",
            population: allCost[3],
            color: "#61c7ff",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
        },
        {
            name: "기타",
            population: allCost[4],
            color: "#61ccff",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
        },
    ];

    const [isLoading, setIsLoading] = useState(true);
    const [condition, setCondition] = useState("");
    const [temp, setTemp] = useState("");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedTab, setSelectedTab] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [place, setPlace] = useState("");
    const [price, setPrice] = useState("");
    const [tab, setTab] = useState("기타");

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

    const submitSpend = () => {
        const postData = {
            userId: 100970667093919960712,
            // userId: 100970667093919960000,
            // userId: uid,
            category: tab,
            spendName: place,
            cost: price,
        };
        axios
            .post("http://210.107.78.156:9003/api/spending/", postData)
            .then(setData([...spendData, postData]))
            .then(function (response) {
                Alert.alert("소비내역이 등록되었습니다.");
            })
            .then(getSpendList())
            .then(setModalVisible(!modalVisible));
        // .then(setData([...data, newData]))
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
                    <TouchableOpacity
                        onPress={showDatePicker}
                    >
                        <AntDesign
                            style={styles.underArrow}
                            name="down"
                            size={20}
                            color="black"
                        />
                    </TouchableOpacity>                                 
            </View>
            {/**main header section end */}
            {selectedTab ? (
                <View style={styles.spendContainer}>
                    <View style={styles.totalContainer}>
                        <Text style={styles.spendText}>총 지출</Text>
                        <Text style={styles.total}>
                            {totalCost
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            원
                        </Text>
                    </View>
                    <View style={styles.spendIndex}>
                        <Text style={styles.spendText}>내용</Text>
                        <Text style={styles.spendText}>금액</Text>
                    </View>
                    <ScrollView style={styles.spendScroll}>
                        {spendData?.map((data) => (
                            <View key={data.id} style={styles.spend}>
                                <View style={styles.spendItem}>
                                    <Text style={styles.spendText}>
                                        {data.spendName}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.spendText,
                                            styles.spendCategory,
                                        ]}
                                    >
                                        {data.category}
                                    </Text>
                                </View>
                                <Text
                                    style={[styles.spendText, styles.spendCash]}
                                >
                                    {data?.cost
                                        ?.toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    원
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            ) : (
                <View style={styles.spendContainer}>
                    <View style={styles.indexContainer}>
                        <View style={styles.indexItem}>
                            <View
                                style={[
                                    styles.indexCircle,
                                    { backgroundColor: "#61c7ff" },
                                ]}
                            />
                            <Text>식비</Text>
                        </View>
                        <View style={styles.indexItem}>
                            <View
                                style={[
                                    styles.indexCircle,
                                    {
                                        backgroundColor: "#9ee4e7",
                                        borderRadius: 10,
                                    },
                                ]}
                            />
                            <Text>패션/미용</Text>
                        </View>
                        <View style={styles.indexItem}>
                            <View
                                style={[
                                    styles.indexCircle,
                                    { backgroundColor: "#bee8e5" },
                                ]}
                            />
                            <Text>교육</Text>
                        </View>
                        <View style={styles.indexItem}>
                            <View
                                style={[
                                    styles.indexCircle,
                                    { backgroundColor: "#8dd5f5" },
                                ]}
                            />
                            <Text>문화생활</Text>
                        </View>
                        <View style={styles.indexItem}>
                            <View
                                style={[
                                    styles.indexCircle,
                                    { backgroundColor: "#61ccff" },
                                ]}
                            />
                            <Text>기타</Text>
                        </View>
                    </View>
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
                        paddingLeft={150}
                        hasLegend={false}
                    />
                    <View style={styles.allContainer}>
                        <View style={styles.allIndex}>
                            <Text>통계</Text>
                            <Text>내용</Text>
                            <Text>금액</Text>
                        </View>
                        <ScrollView style={{ height: 150 }}>
                            <View style={styles.allItem}>
                                <Text style={styles.allText}>
                                    {((allCost[0] / totalCost) * 100).toFixed(
                                        1
                                    )}
                                    %
                                </Text>
                                <Text style={styles.allText}>식비</Text>
                                <Text style={styles.allText}>
                                    {allCost[0]
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    원
                                </Text>
                            </View>
                            <View style={styles.allItem}>
                                <Text style={styles.allText}>
                                    {((allCost[1] / totalCost) * 100).toFixed(
                                        1
                                    )}
                                    %
                                </Text>
                                <Text style={styles.allText}>패션/미용</Text>
                                <Text style={styles.allText}>
                                    {allCost[1]
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    원
                                </Text>
                            </View>
                            <View style={styles.allItem}>
                                <Text style={styles.allText}>
                                    {((allCost[2] / totalCost) * 100).toFixed(
                                        1
                                    )}
                                    %
                                </Text>
                                <Text style={styles.allText}>교육</Text>
                                <Text style={styles.allText}>
                                    {allCost[2]
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    원
                                </Text>
                            </View>
                            <View style={styles.allItem}>
                                <Text style={styles.allText}>
                                    {((allCost[3] / totalCost) * 100).toFixed(
                                        1
                                    )}
                                    %
                                </Text>
                                <Text style={styles.allText}>문화생활</Text>
                                <Text style={styles.allText}>
                                    {allCost[3]
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    원
                                </Text>
                            </View>
                            <View style={styles.allItem}>
                                <Text style={styles.allText}>
                                    {((allCost[4] / totalCost) * 100).toFixed(
                                        1
                                    )}
                                    %
                                </Text>
                                <Text style={styles.allText}>기타</Text>
                                <Text style={styles.allText}>
                                    {allCost[4]
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    원
                                </Text>
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
                                        // marginRight: 10,
                                        borderTopLeftRadius: 10,
                                        borderTopRightRadius: 10,
                                        borderBottomLeftRadius: 10,
                                        borderBottomRightRadius: 10,
                                        backgroundColor: "#fafafa",
                                    }}
                                    dropDownStyle={{
                                        height: 200,
                                        borderBottomLeftRadius: 20,
                                        borderBottomRightRadius: 20,
                                        backgroundColor: "#fafafa",
                                        elevation: 5,
                                        paddingBottom: 10,
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
                                    defaultValue="기타"
                                    containerStyle={{ height: 30, width: 100 }}
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
                                style={
                                    styles.submitButton
                                }
                                onPress={submitSpend}
                            >
                                <Text style={styles.submitText}>등록하기!</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </>
    );
};
const styles = StyleSheet.create({
    indexContainer: {
        position: "absolute",
        top: 60,
        left: 50,
    },
    indexCircle: {
        width: 10,
        height: 10,
        borderRadius: 10,
        marginTop: 4,
        marginRight: 10,
    },
    indexItem: {
        flexDirection: "row",
        marginBottom: 3,
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
        backgroundColor:'white',
        flexDirection:"row",
        justifyContent:'center',
        alignItems: 'center',
        // top:9,
        height:57,
    },
    submitText: {
        color: "black",
        textAlign: "center",
    },
    submitButton: {
        width: 100,
        height: 25,
        lineHeight: 25,
        borderRadius: 20,
        backgroundColor: "rgb(245,245,245)",
        justifyContent:'center',
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
 //main Header Style start
    //Header1
    mainLogo:{
        height:50,
        width:"100%",
        flexDirection:"row",
        justifyContent:'space-between',
        alignItems: 'center',
        // left:20,
        backgroundColor:'#f5f5f5',
        // top:10,
    },
    //Logo
    logo: {
        width: 60,
        height: 18,
        left: 20,
        // top:10,
        // borderWidth:1,
        // borderColor:'blue'
        // position: "absolute",
        // top: 20,
        // flex:1,
        // justifyContent:'center',
        // alignItems:'center',
    },
    //header1-weather
    weather: {
        // position: "absolute",
        // backgroundColor:"gold",
        // top: 11,
        left:70,
        // right:20,
    },
    //User Login Icon
    userIcon: {
        width: 25,
        height: 25,
        borderRadius: 15,
        // position: "absolute",
        right: 20,
        // top: 10,
    }, 
    
    //header2
    topContainer: {
        height:90,
        // width: 230,
        flexDirection:"row",
        // justifyContent:'space-between',  
        justifyContent:'center',  
        alignItems: 'center',
        backgroundColor:'white',
        textAlign:'center',
    },

    //header2-datePicker
    //dateAllConcept
    dateStyle: {
        backgroundColor:"blue",
        // width:200,
        // width: "100%",
        // justifyContent:'space-around',
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        // top: 12,
    },
    //date Text
    dateText:{        
        fontSize: 20,
        // fontWeight: "bold",
        color:"black",
        fontFamily: "NanumSquare_acEB",
        // left:20,
        // right:5,
    },
    //date Arrow
    underArrow: {
        // top: 0,
        left: 2,
        color:'black',
    },
    //main Header Style end
});
