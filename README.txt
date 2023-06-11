CS193X Final Project
====================

Project Title: An Anonymous Confession Website
Your Name: Shawn Kang
Your SUNetID: kangzx

Overview
--------
This project is an anonymous confession website. Users can post their confessions anonymously, view all confessions that are posted, and like and comment on the posts.

Running
-------
Run `mongosh init_db.mongodb`, `npm install` and `npm start`.

Features
--------
- The user should be able to see all the posts ordered from latest to earliest (they may select that the posts ordered by popularity which is `likeCount + commentCount`).
- The user should be able to log in. When they log in, the website will get the users IP address and generate a hash to submit to the database. 
- After logging in, the user may make a post, like, or comment on a post.
- A user (identified by the hashed IP address) can only like a post once. Once the user has liked the post, the heart icon will become full. Next time when the user logs in, the heart icon will still be full.
- The like and comment count will be reflected immediately after the user comments or likes a post.

Collaboration and libraries
---------------------------
- I used ChatGPT to generate the posts for my `init_db.mongodb` script. 
- I used [ipify](https://www.ipify.org/)'s API to request the user's IP address.
- I consulted the internet to implement hashing for the IP address.

Anything else?
-------------
Amazing class! Fun projects!
