import { action, computed, observable } from "mobx";

class UserStore {
    @observable uid = "";

    @computed
    get getUid() {
        return this.uid;
    }

    @action
    setUser = (uid) => {
        this.uid = uid;
    };
}
export default new UserStore();
