import apiRequest from "./apirequest.js";

export default class Post {
    constructor(data, postElm, viewUser) {
        this.id = data.id;
        this.time = data.time;
        this.header = data.header;
        this.body = data.body;
        this.likeCount = data.likeCount;
        this.commentCount = data.commentCount;
        this.post = postElm;   // DOM element
        this.user = viewUser;   // User object

        this.ifLiked = false;

        this._onLike = this._onLike.bind(this);
        this._onComment = this._onComment.bind(this);

        this._likeButton = this.post.querySelector(".likeButton");
        this._likeButton.addEventListener("click", this._onLike);
        this._commentButton = this.post.querySelector(".commentButton");
        this._commentButton.addEventListener("click", this._onComment);
    }

    updateUser(user){
        this.user = user;
    }

    async updateLike(){
        if (this.user !== null){
            let likeData = await apiRequest("GET",  
                "/like/" + this.user.id + "/" + this.id.toString()
            );
            this.ifLiked = likeData.ifLiked;
        }

        if (this.ifLiked){
            this.post.querySelector("#emptyHeart").classList.add("hidden");
            this.post.querySelector("#fullHeart").classList.remove("hidden");
        }
    }

    /* handlers */
    async _onLike() {
        if (this.user === null){
            alert("Please log in to like a post.");
            return;
        }

        if (!this.ifLiked){
            await apiRequest("POST", "/like" ,{
                userId: this.user.id,
                postId: this.id
            });
            this.post.querySelector("#emptyHeart").classList.add("hidden");
            this.post.querySelector("#fullHeart").classList.remove("hidden");
            this.likeCount += 1;
            this.post.querySelector("#likeCount").textContent = this.likeCount;
            this.ifLiked = true;
        }


    }

    async _onComment() {

    }
}