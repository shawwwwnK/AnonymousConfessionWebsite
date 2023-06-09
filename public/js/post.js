export default class Post {
    constructor(data, postElm) {
        this.time = data.time;
        this.header = data.header;
        this.body = data.body;
        this.likeCount = data.likeCount;
        this.commentCount = data.commentCount;
        this.post = postElm;   // DOM element

        this._onLike = this._onLike.bind(this);
        this._onComment = this._onComment.bind(this);

        this._likeButton = this.post.querySelector(".likeButton");
        this._likeButton.addEventListener("click", this._onLike);
        this._commentButton = this.post.querySelector(".commentButton");
        this._commentButton.addEventListener("click", this._onComment);
    }

    /* handlers */
    async _onLike() {

    }

    async _onComment() {

    }
}