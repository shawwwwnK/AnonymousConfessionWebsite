import Filter from "./filter";

export default class App {
    constructor() {
        this._user = null;
        this._filter = new Filter();

        this._onGuestLogin = this._onGuestLogin.bind(this);
        this._guestLoginButton = document.querySelector("#guestLogin");
        this._onGoogleLogin = this._onGoogleLogin.bind(this);
        this._googleLoginButton = document.querySelector("#googleLogin");
    }


    async _onGuestLogin() {

    }

    async _onGoogleLogin() {

    }

}