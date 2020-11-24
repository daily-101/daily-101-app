import { inject, Observer, observer } from "mobx-react";
import React from "react";
import { Component } from "react";
import { Alert } from "react-native";
import DietPresenter from "./DietPresenter";

@inject("UserStore")
@observer
class DietContainer extends Component {
    render() {
        const uid = this.props.UserStore.getUid;
        return <DietPresenter uid={uid} />;
    }
}
export default DietContainer;
