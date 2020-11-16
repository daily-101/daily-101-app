import React from "react";
import { Component } from "react";
import TimelilnePresenter from "./TimelilnePresenter";
import axios from "axios";
export default class TimelineContainer extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         data: [],
    //     };
    // }

    // componentDidMount() {
    //     this.getWeather();
    // }

    // getWeather = async () => {
    //     const data = await axios.get(
    //         "http://210.107.78.156:9009/api/timeline/"
    //     );
    //     console.log(data.request._response);
    //     this.setState({ data: data });
    // };

    render() {
        return <TimelilnePresenter />;
    }
}
