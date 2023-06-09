
export default class Post {
    constructor(data) {
        this.time = data.time;
        this.header = data.header;
        this.body = data.body;
        this.likeCount = data.likeCount;
        this.commentCount = data.commentCount;
    }
}