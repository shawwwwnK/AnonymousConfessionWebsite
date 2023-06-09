import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { MongoClient } from "mongodb";

let DATABASE_NAME = "anonymous_confession_website";

let api = express.Router();
let db;
let users;
let posts;
let likes;
let comments;

const initApi = async (app) => {
    app.set("json spaces", 2);
    app.use("/api", api);
  
    let conn = await MongoClient.connect("mongodb://127.0.0.1");
    db = conn.db(DATABASE_NAME);
    users = db.collection("users");
    posts = db.collection("posts");
    likes = db.collection("likes");
    comments = db.collection("comments");
};

api.use(bodyParser.json());
api.use(cors());

api.get("/", (req, res) => {
    res.json({ message: "API is running" });
});

api.get("/feed", async (req, res) => {
    let feed = await posts.find().toArray();
    let resFeed = [];
    for (let post of feed){
        let likeCount = await likes.countDocuments({postId: post._id});
        let commentCount = await comments.countDocuments({postId: post._id});
        resFeed.push({
            time: post.time,
            header: post.header,
            body: post.body,
            likeCount: likeCount,
            commentCount: commentCount
        });
    }
    res.status(200).json({posts: resFeed});
});



api.all("/*", (req, res) => {
        res.status(404).json({ error: `Endpoint not found: ${req.method} ${req.url}` });
    });
export default initApi;