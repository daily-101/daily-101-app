import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default ({ navigation }) => {
    // const [user, setUser] = useState({});
    // const [isLogin, setLogin] = useState("로그인 안됨...");
    // const [cur, setCur] = useState({});

    // const current = async () => {
    //     const user = await GoogleSignIn.getCurrentUser();
    //     setCur(user);
    // };
    // const initAsync = async () => {
    //     await GoogleSignIn.initAsync({
    //         clientId:
    //             "626752650215-9614q5uedogo96okooink83ibifa4i2k.apps.googleusercontent.com",
    //     });
    //     _syncUserWithStateAsync();
    // };
    // const _syncUserWithStateAsync = async () => {
    //     const user = await GoogleSignIn.signInSilentlyAsync();
    //     setUser(user);
    // onSetUser(user.toJSON())

    // setUser(user);
    // };

    // const signOutAsync = async () => {
    //     await GoogleSignIn.signOutAsync();
    //     setUser(null);
    // };

    // const signInAsync = async () => {
    //     try {
    //         await GoogleSignIn.askForPlayServicesAsync();
    //         const { type, user } = await GoogleSignIn.signInAsync();
    //         if (type === "success") {
    //             _syncUserWithStateAsync();
    //             navigation.navigate("Tabs");
    //         }
    //     } catch ({ message }) {
    //         alert("login: Error : " + message);
    //     }
    // };

    const onPress = useCallback(() => {
        navigation.navigate('Tabs');
        // console.log("유저 데이터 ", userData);
        // if (user) {
        //     signOutAsync();
        //     // current();
        //     //     setLogin("로그아웃");
        // } else {
        //     signInAsync();

        //     // current();
        //     //     setLogin("로그인");
        // }
    });

    useEffect(() => {}, []);

    return (
        <View style={styles.loginContainer}>
            <Text style={styles.loginTitle}>생활밀착형 통합 관리 서비스</Text>
            <Image style={styles.loginLogo} source={require('../../img/login_logo.png')} />
            <TouchableOpacity
                style={styles.loginButton}
                // onPress={() => navigation.navigate("Tabs")}
                onPress={onPress}
            >
                <Image style={{ width: 23, height: 23 }} source={require('../../img/google_logo.png')} />
                <Text style={styles.buttonText}>google로 로그인하기</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonText: {
        marginLeft: 20,
        color: '#666666',
    },
    loginButton: {
        flexDirection: 'row',
        marginTop: 120,
        paddingHorizontal: 100,
        paddingVertical: 15,
        borderWidth: 0.2,
        borderRadius: 30,
        borderColor: '#666666',
    },
    loginLogo: { width: 300, height: 80 },
    loginTitle: {
        fontSize: 15,
        color: '#666666',
        paddingBottom: 30,
    },
    loginContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
