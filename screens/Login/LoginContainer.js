import LoginPresenter from "./LoginPresenter";
import React from "react";
import { Component } from "react";

class LoginContainer extends Component {
    render() {
        const { navigation } = this.props;
        return <LoginPresenter navigation={navigation} />;
    }
}
export default LoginContainer;
