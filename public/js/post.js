import apiRequest from "./apirequest.js";

/* A data model that represents a post. Also handles likes and comments */
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

        this.ifLiked = false;   // If the post is liked by the user

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
        // API call to find out if the user has liked the post
        if (this.user !== null){
            let likeData = await apiRequest("GET",  
                "/like/" + this.user.id + "/" + this.id.toString()
            );
            this.ifLiked = likeData.ifLiked;
        }

        // Update DOM to show liked heart
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

        // API call to submit like and update DOM
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
        if (this.user === null){
            alert("Please log in to see comments.");
            return;
        }

        // Reveal comment form
        document.querySelector("#commentPrompt").classList.add("hidden");
        document.querySelector("#commentForm").classList.remove("hidden");

        // Add a copy of post on comment panel
        let postCopy = this.post.cloneNode(true);
        postCopy.id = this.id.toString();
        postCopy.removeChild(postCopy.querySelector("#reactButtons"));
        document.querySelector("#postCopy").textContent = "";
        document.querySelector("#postCopy").appendChild(postCopy);

        Post.updateComments(this.id);
    }

    /* Call to update the comments on teh comment panel */
    static async updateComments(postId){
        document.querySelector("#comments").textContent = "";
        
        // API call to get comments and display 
        let data = await apiRequest("GET", "/comment/" + postId.toString());
        let comments = data.comments;
        for (let commentData of comments){
            let elem = document.querySelector("#templateComment").cloneNode(true);
            elem.classList.remove("hidden");
            elem.id = "";

            elem.querySelector(".commentBody").textContent = commentData.text;
            elem.querySelector(".time").textContent = commentData.time.toLocaleString();

            document.querySelector("#comments").append(elem);
        }
    }


}