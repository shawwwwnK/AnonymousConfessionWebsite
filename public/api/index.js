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