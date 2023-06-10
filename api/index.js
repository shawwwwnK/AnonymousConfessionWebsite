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
        let likeCount = await likes.countDocuments({postId: post._id.toString()});
        let commentCount = await comments.countDocuments({postId: post._id.toString()});
        resFeed.push({
            id: post._id,
            time: post.time,
            header: post.header,
            body: post.body,
            likeCount: likeCount,
            commentCount: commentCount
        });
    }
    res.status(200).json({posts: resFeed});
});


api.post("/users", async (req, res) => {
    let id = req.body.id;
  
    // Handling errors
    if (id === undefined || id === ""){
        res.status(400).json({error: "Missing id"});
        return;
    }

    // User has logged in before
    let oldUser = await users.findOne({id: id});
    if (oldUser !== null){
        res.status(200).json(oldUser);
    }

    // Create user
    else{
        let newUser = { id: id };
        res.status(200).json(newUser);
        await users.insertOne(newUser);
    }
});

api.get("/like/:userId/:postId", async (req, res) => {
    let userId = req.params.userId;
    let postId = req.params.postId;
  
    // Handling errors
    if (userId === undefined || userId === ""){
        res.status(400).json({error: "Missing user id"});
        return;
    }

    if (postId === undefined || postId === ""){
        res.status(400).json({error: "Missing post id"});
        return;
    }

    let oldLike = await likes.findOne({userId: userId, postId: postId});
    if (oldLike !== null){
        res.status(200).json({ifLiked: true});
    }
    else{
        res.status(200).json({ifLiked: false});
    }
});

api.post("/like", async (req, res) => {
    let userId = req.body.userId;
    let postId = req.body.postId;
  
    // Handling errors
    if (userId === undefined || userId === ""){
        res.status(400).json({error: "Missing user id"});
        return;
    }

    if (postId === undefined || postId === ""){
        res.status(400).json({error: "Missing post id"});
        return;
    }

    // User has liked the post before
    let oldLike = await likes.findOne({userId: userId, postId: postId});
    if (oldLike !== null){
        res.status(200).json({ifLiked: true});
    }

    // Like
    else{
        let newLike = {
            userId: userId,
            postId: postId,
            time: new Date()
        };
        res.status(200).json({ifLiked: false});
        await likes.insertOne(newLike);
    }
});


api.all("/*", (req, res) => {
        res.status(404).json({ error: `Endpoint not found: ${req.method} ${req.url}` });
    });
export default initApi;