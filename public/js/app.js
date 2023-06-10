import apiRequest from "./apirequest.js";
import Filter from "./filter.js";
import Post from "./post.js";
import User from "./user.js";

export default class App {
    constructor() {
        this._user = null;
        this._filter = new Filter();
        this._posts = [];

        this._onGuestLogin = this._onGuestLogin.bind(this);
        this._onGoogleLogin = this._onGoogleLogin.bind(this);

        this._guestLoginButton = document.querySelector("#guestLogin");
        this._guestLoginButton.addEventListener("click", this._onGuestLogin);
        this._googleLoginButton = document.querySelector("#googleLogin");
        this._guestLoginButton.addEventListener("click", this._onGoogleLogin);

        this._loadFeed();
    }


    async _loadFeed(){
        document.querySelector("#feed").textContent = "";
        let data = await apiRequest("GET", "/feed");
        this._posts = [];
        for (let postData of data.posts) {
            let elem = document.querySelector("#templatePost").cloneNode(true);
            let post = new Post(postData, elem, this._user);

            elem.classList.remove("hidden");
            elem.id = "";

            elem.querySelector(".postHeader").textContent = postData.header;
            elem.querySelector(".postBody").textContent = postData.body;
            elem.querySelector(".time").textContent = postData.time.toLocaleString();
            elem.querySelector("#likeCount").textContent = postData.likeCount.toString();
            elem.querySelector("#commentCount").textContent = postData.commentCount.toString();

            document.querySelector("#feed").append(elem);
            this._posts.push(post);
        }
    }

    /* handlers */
    async _onGuestLogin() {
        this._user = new User();
        await this._user.logIn();
        document.querySelector("#postForm").classList.remove("hidden");
        for (let post of this._posts){
            post.updateUser(this._user);
            await post.updateLike();
        }
    }

    async _onGoogleLogin() {

    }

}