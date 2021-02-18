import React, { useEffect, useState } from 'react';
import { Component } from 'react';
import TimelilnePresenter from './TimelilnePresenter';
import axios from 'axios';
import moment from 'moment';

export default () => {
    const [data, setData] = useState([]);
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [weather, setWeather] = useState({});
    const [cur, setCur] = useState({});

    useEffect(() => {
        if (loading) {
            getTimeline();
        }
    }, []);

    useEffect(() => {
        getTimeline();
    }, [date]);

    const getTimeline = async () => {
        const data = await axios
            .get(`http://52.79.107.5:9001/api/timeline/${date}/${cur.uid}`)
            // .get(
            //     `http://52.79.107.5:9001/api/timeline/${date}/105191400324450530000`
            // )
            .then(function (response) {
                const convertData = response.data?.map((s) => ({
                    id: s.id,
                    time: moment(s.date).format('kk:mm'),
                    title: s.placeName,
                    description: s.address,
                    latitude: s.latitude,
                    longitude: s.longitude,
                }));

                setData(convertData);
                setWeather({
                    condition: response.data[response.data.length - 1].cur_weather,
                    temper: (response.data[response.data.length - 1].cur_temper - 273).toFixed(1),
                });

                // console.log(response.data[response.data.length - 1]);
            });
    };
    // console.log(weather);
    return <TimelilnePresenter weather={weather} data={data} date={date} setDate={setDate} setData={setData} uid={cur ? cur.uid : ''} />;
};
