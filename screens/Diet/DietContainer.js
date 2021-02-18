import React, { useEffect, useState } from 'react';
import DietPresenter from './DietPresenter';
import axios from 'axios';

export default () => {
    const [data, setData] = useState([]);
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [isData, setIsData] = useState(false);
    const [cur, setCur] = useState({});

    // const getDiet = async () => {
    //     await axios
    //         .get(`http://52.79.107.5:9004/api/food/${date}/${cur.uid}`)
    //         // .get(
    //         //     `http://52.79.107.5:9004/api/food/${date}/105191400324450530000`
    //         // )
    //         .then(function (response) {
    //             setData(response.data);
    //         });
    //     getImages();
    //     setIsData(true);
    //     // .then(

    //     // )
    //     // .then(setIsData(true));
    // };

    // const getImages = () => {
    //     data.map((temp, idx) => {
    //         firebase
    //             .storage()
    //             .ref()
    //             .child(temp.filename)
    //             .getDownloadURL()
    //             .then(function (url) {
    //                 setUri(url, idx);
    //             })
    //             .catch(function (error) {
    //                 switch (error.code) {
    //                     case "storage/object-not-found":
    //                         console.log(error.code);
    //                     case "storage/unauthorized":
    //                         console.log(error.code);
    //                     case "storage/unknown":
    //                         console.log(error.code);
    //                 }
    //             });
    //     });
    // };

    const setUri = (value, id) => {
        const newData = data.map((temp, idx) => {
            return id === idx ? { ...temp, imgUrl: value } : temp;
        });
        setData(newData);
    };

    useEffect(() => {
        setIsData(false);
    }, [date]);
    useEffect(() => {
        if (loading) {
        }
    }, []);
    return <DietPresenter data={isData ? data : []} setData={setData} date={date} setDate={setDate} uid={cur ? cur.uid : ''} />;
};
