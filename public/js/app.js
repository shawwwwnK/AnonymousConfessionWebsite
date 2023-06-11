import apiRequest from "./apirequest.js";
import Filter, {Order} from "./filter.js";
import Post from "./post.js";
import User from "./user.js";

export default class App {
    constructor() {
        this._user = null;
        this._filter = new Filter(this);
        this._posts = [];

        this._onGuestLogin = this._onGuestLogin.bind(this);
        this._onPost = this._onPost.bind(this);
        this._onPostComment = this._onPostComment.bind(this);

        this._guestLoginButton = document.querySelector("#guestLogin");
        this._guestLoginButton.addEventListener("click", this._onGuestLogin);
        this._postForm = document.querySelector("#postForm");
        this._postForm.addEventListener("submit", this._onPost);
        this._postCommentForm = document.querySelector("#commentForm");
        this._postCommentForm.addEventListener("submit", this._onPostComment);

        this._loadFeed();
    }

    /* Load the posts */
    async _loadFeed(){
        document.querySelector("#feed").textContent = "";

        // API call
        let data = await apiRequest("GET", "/feed");
        let posts = data.posts;

        // Order the posts based on filter
        if (this._filter.order === Order.LATEST){
            posts.sort((a, b) => b.time - a.time);
            posts.reverse();
        }
        else if (this._filter.order === Order.POPULAR){
            posts.sort((a, b) => ((b.likeCount + b.commentCount) - (a.likeCount + a.commentCount)));
        }
        
        // Display posts
        this._posts = [];
        for (let postData of posts) {
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

            // Update the like icon
            post.updateLike();
        }
    }

    /* handlers */
    async _onGuestLogin() {
        this._user = new User();
        await this._user.logIn();
        document.querySelector("#postForm").classList.remove("hidden");

        // Update posts
        for (let post of this._posts){
            post.updateUser(this._user);
            await post.updateLike();
        }

        // Hide login button
        this._guestLoginButton.classList.add("hidden");
        document.querySelector("#loginPrompt").classList.add("hidden");
    }

    async _onPost(event){
        event.preventDefault();
        let header = this._postForm.querySelector("#postHeaderInput").value;
        let body = this._postForm.querySelector("#postBodyInput").value;
        await apiRequest("POST", "/post/" + this._user.id, {
            header: header,
            body: body
        })
        this._postForm.querySelector("#postHeaderInput").value = "";
        this._postForm.querySelector("#postBodyInput").value = "";
        await this._loadFeed();
    }

    async _onPostComment(event){
        event.preventDefault();
        let text = document.querySelector("#commentInput").value;
        let postId = document.querySelector("#postCopy").firstChild.id;
        await apiRequest("POST", "/comment/" + this._user.id + "/" + postId, {
            text: text
        })
        Post.updateComments(postId);
        document.querySelector("#commentInput").value = "";
        await this._loadFeed();
    }

}