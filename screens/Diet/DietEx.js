import React from "react";
import * as firebase from "firebase";
import { Alert, Button, View } from "react-native";
import * as ImagePicker from "expo-image-picker";

const firebaseConfig = {
    apiKey: "AIzaSyBUCG7MYr2MAKnCGSFry2TbcQPRZXnrfuQ",
    authDomain: "daily101-d017b.firebaseapp.com",
    databaseURL: "https://daily101-d017b.firebaseio.com",
    projectId: "daily101-d017b",
    storageBucket: "daily101-d017b.appspot.com",
    messagingSenderId: "1062216976082",
    appId: "1:1062216976082:web:25c28e910ddbe3ce934f0b",
    measurementId: "G-65TXRPFDB6",
};

// firebase.initializeApp(firebaseConfig);

export default () => {
    const onChooseImage = async () => {
        // let result = await ImagePicker.launchCameraAsync();
        const result = await ImagePicker.launchImageLibraryAsync();
        // console.log(result);
        if (!result.cancelled) {
            uploadImage(result.uri, "test-image")
                .then(() => {
                    console.log("success");
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const uploadImage = async (uri, imageName) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        var ref = firebase
            .storage()
            .ref()
            .child(imageName + ".jpg");
        return ref.put(blob);
    };
    return (
        <View>
            <Button title="버튼" onPress={onChooseImage} />
        </View>
    );
};
