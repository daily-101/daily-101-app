import React, { useEffect, useState } from "react";
import DietPresenter from "./DietPresenter";
import DietEx from "./DietEx";
import axios from "axios";
import * as GoogleSignIn from "expo-google-sign-in";
import * as firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyBUCG7MYr2MAKnCGSFry2TbcQPRZXnrfuQ",
    authDomain: "daily101-d017b.firebaseapp.com",
    databaseURL: "https://daily101-d017b.firebaseio.com",
    projectId: "daily101-d017b",
    storageBucket: "daily101-d017b.appspot.com",
    // messagingSenderId: "1062216976082",
    // appId: "1:1062216976082:web:25c28e910ddbe3ce934f0b",
    // measurementId: "G-65TXRPFDB6",
};
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
export default () => {
    const [data, setData] = useState([]);
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [isData, setIsData] = useState(false);
    const [cur, setCur] = useState({});

    const current = async () => {
        const user = await GoogleSignIn.getCurrentUser();
        setCur(user);
        setLoading(true);
    };

    const getDiet = async () => {
        await axios
            .get(
                `http://210.107.78.156:9004/api/food/${date}/105191400324450530000`
            )
            .then(function (response) {
                setData(response.data);
            });
        getImages();
        setIsData(true);
        // .then(

        // )
        // .then(setIsData(true));
    };

    const getImages = () => {
        data.map((temp, idx) => {
            firebase
                .storage()
                .ref()
                .child(temp.filename)
                .getDownloadURL()
                .then(function (url) {
                    setUri(url, idx);
                })
                .catch(function (error) {
                    switch (error.code) {
                        case "storage/object-not-found":
                            console.log(error.code);
                        case "storage/unauthorized":
                            console.log(error.code);
                        case "storage/unknown":
                            console.log(error.code);
                    }
                });
        });
    };

    const setUri = (value, id) => {
        const newData = data.map((temp, idx) => {
            return id === idx ? { ...temp, imgUrl: value } : temp;
        });
        setData(newData);
    };

    useEffect(() => {
        setIsData(false);
        getDiet();
    }, [date]);
    useEffect(() => {
        getDiet();
    }, []);
    return (
        <DietPresenter
            data={isData ? data : []}
            setData={setData}
            date={date}
            setDate={setDate}
        />
    );
};
