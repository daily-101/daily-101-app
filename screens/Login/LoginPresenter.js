import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default ({ navigation }) => {
    return (
        <View style={styles.loginContainer}>
            <Text style={styles.loginTitle}>생활밀착형 통합 관리 서비스</Text>
            <Image
                style={styles.loginLogo}
                source={require("../../img/login_logo.png")}
            />
            <TouchableOpacity
                style={styles.loginButton}
                onPress={() => navigation.navigate("Tabs")}
            >
                <Image
                    style={{ width: 23, height: 23 }}
                    source={require("../../img/google_logo.png")}
                />
                <Text style={styles.buttonText}>google로 로그인하기</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonText: {
        marginLeft: 20,
        color: "#666666",
    },
    loginButton: {
        flexDirection: "row",
        marginTop: 120,
        paddingHorizontal: 100,
        paddingVertical: 15,
        borderWidth: 0.2,
        borderRadius: 30,
        borderColor: "#666666",
    },
    loginLogo: { width: 300, height: 80 },
    loginTitle: {
        fontSize: 15,
        color: "#666666",
        paddingBottom: 30,
    },
    loginContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
