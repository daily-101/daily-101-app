import React, { useEffect, useState } from "react";
import SpendPresenter from "./SpendPresenter";
import * as GoogleSignIn from "expo-google-sign-in";
import axios from "axios";

export default () => {
    const [date, setDate] = useState(new Date());
    const [spendData, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [allCost, setAllCost] = useState([]);

    const current = async () => {
        const user = await GoogleSignIn.getCurrentUser();
        setCur(user);
        setLoading(true);
    };

    const getSpendList = async () => {
        const data = await axios
            .get(
                `http://210.107.78.156:9003/api/spending/${date}/100970667093919960712`
            )
            .then(function (response) {
                setData(response.data);
                convertData(response.data);
            });
    };
    useEffect(() => {
        getSpendList();
    }, [date]);

    const convertData = (data) => {
        let tmpList = [0, 0, 0, 0, 0];
        data.map((tmp) => {
            if (tmp.category === "식비") {
                tmpList[0] += tmp.cost;
            } else if (tmp.category === "패션/미용") {
                tmpList[1] += tmp.cost;
            } else if (tmp.category === "교육") {
                tmpList[2] += tmp.cost;
            } else if (tmp.category === "문화생활") {
                tmpList[3] += tmp.cost;
            } else {
                tmpList[4] += tmp.cost;
            }
        });
        setAllCost(tmpList);
    };

    return (
        <SpendPresenter
            allCost={allCost}
            spendData={spendData}
            setData={setData}
            date={date}
            setDate={setDate}
            getSpendList={getSpendList}
        />
    );
};
