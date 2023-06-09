import apiRequest from "./apirequest.js";
import Filter from "./filter.js";
import Post from "./post.js";

export default class App {
    constructor() {
        this._user = null;
        this._filter = new Filter();

        this._onGuestLogin = this._onGuestLogin.bind(this);
        this._guestLoginButton = document.querySelector("#guestLogin");
        this._onGoogleLogin = this._onGoogleLogin.bind(this);
        this._googleLoginButton = document.querySelector("#googleLogin");

        this._loadFeed();
    }


    async _loadFeed(){
        document.querySelector("#feed").textContent = "";
        let data = await apiRequest("GET", "/feed");
        let posts = data.posts.map((postData) => new Post(postData));
        for (let post of posts) {
            this._displayPost(post);
        }
    }

    _displayPost(post) {
        if (!(post instanceof Post)) throw new Error("displayPost wasn't passed a Post object");

        let elem = document.querySelector("#templatePost").cloneNode(true);
        elem.classList.remove("hidden");
        elem.id = "";

        elem.querySelector(".postHeader").textContent = post.header;
        elem.querySelector(".postBody").textContent = post.body;
        elem.querySelector(".time").textContent = post.time.toLocaleString();
        elem.querySelector("#likeCount").textContent = post.likeCount.toString();
        elem.querySelector("#commentCount").textContent = post.commentCount.toString();

        document.querySelector("#feed").append(elem);
    }

    /* handlers */
    async _onGuestLogin() {

    }

    async _onGoogleLogin() {

    }

}