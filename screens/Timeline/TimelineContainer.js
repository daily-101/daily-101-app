import React, { useEffect, useState } from "react";
import { Component } from "react";
import TimelilnePresenter from "./TimelilnePresenter";
import axios from "axios";
import moment from "moment";

export default () => {
    const [data, setData] = useState([]);
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getTimeline();
    }, [date]);

    const getTimeline = async () => {
        const data = await axios
            .get(
                `http://210.107.78.156:9009/api/timeline/${date}/105324339913641718583`
            )
            .then(function (response) {
                setData(response.data);
                console.log(response.data);
                setLoading(true);
            });

        // console.log(data);

        // console.log(data.request._response);
    };
    return (
        <TimelilnePresenter
            loading={loading}
            data={data.length > 0 ? data : []}
            date={date}
            setDate={setDate}
            setData={setData}
        />
    );
};
