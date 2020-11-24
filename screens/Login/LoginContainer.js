import LoginPresenter from "./LoginPresenter";
import React from "react";
import { Component } from "react";
import { inject, observer } from "mobx-react";
import UserStore from "../../Store/UserStore";

@inject("UserStore")
@observer
class LoginContainer extends Component {
    onSetUser = (user) => {
        this.props.UserStore.setUser(user);
    };
    render() {
        const { navigation } = this.props;
        const uid = this.props.UserStore.getUid;
        return (
            <LoginPresenter
                navigation={navigation}
                onSetUser={this.onSetUser}
                // userData={uid}
            />
        );
    }
}
export default LoginContainer;
// export default ({ navigation }) => {
//     return <LoginPresenter navigation={navigation} />;
// };
