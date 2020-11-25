import React, { useEffect, useState } from "react";
import { Component } from "react";
import TimelilnePresenter from "./TimelilnePresenter";
import axios from "axios";
import moment from "moment";
import * as GoogleSignIn from "expo-google-sign-in";

export default () => {
    const [data, setData] = useState([]);
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(false);

    const [cur, setCur] = useState({});

    const current = async () => {
        const user = await GoogleSignIn.getCurrentUser();
        setCur(user);
        setLoading(true);
    };

    // useEffect(() => {
    //     current();
    //     if (loading) {
    //         getTimeline();
    //     }
    // }, []);

    useEffect(() => {
        getTimeline();
    }, [date]);

    const getTimeline = async () => {
        const data = await axios
            .get(
                `http://210.107.78.156:9009/api/timeline/${date}/105191400324450530000`
            )
            // .get(`http://210.107.78.156:9009/api/timeline/${date}/${cur.uid}`)
            .then(function (response) {
                const convertData = response.data?.map((s) => ({
                    id: s.id,
                    time: moment(s.date).format("kk:mm"),
                    title: s.title,
                    description: s.placeName,
                    latitude: s.latitude,
                    longitude: s.longitude,
                }));
                setData(convertData);
                // console.log(response.data);
            });
    };
    console.log("container", data);
    return (
        <TimelilnePresenter
            data={data}
            date={date}
            setDate={setDate}
            setData={setData}
            // uid={cur.uid ? cur.uid : ""}
        />
    );
};
