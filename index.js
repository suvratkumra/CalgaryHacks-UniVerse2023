import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import http from 'http';
import { Server } from 'socket.io';
import morgan from "morgan";
import { fileURLToPath } from "url";
import path from "path";
// register endpoint
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
//import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import Message from "./models/Message.js";
//import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import { create } from "domain";

/*CONFIGURATIONS
-----------------
*/


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
//file sharing cors
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/*FILE STORAGE
---------------
use multer to store files onto server in this case local server disk storage 
this is because those files nned to access by front end public folder 
store some info about files in database 

in production maybe keep public assets in aws s3 bucket storage 

see multer github for package instructions and use cases
any time file uploaded to server it will be saved to public/assets folder
*/

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/assets");
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});
const upload = multer({ storage });

/*ROUTES WITH FILES
--------------------
routes occure in order of code 
auth route = upload picture directly into assests folder (middleware)
			 will happedn after route and before login code (register endpoint)

DO NOT MOVE AUTH ROUTE INTO ROUTE FILE NEED UPLOAD VARIABLE 
*/
app.post("/auth/register", upload.single("picture"), register);
//app.post("/posts", verifyToken, upload.single("picture"), createPost);

/*ROUTER
------------- 
setup routes for authorization routes endpoints
*/
app.use("/auth", authRoutes);


/**
 *  Chat Feature backend
 */
app.get('/api', (req, res) => {
	res.json({
		message: 'Bhenchod World',
	});
});


app.get("/get/chat/msg/:user1Id/:user2Id", async (req, res) => {
	try {
		const from = req.params.user1Id;
		const to = req.params.user2Id;
		const newmessage = await Message.find({
			Chatusers: {
				$all: [from, to],

			}
		}).sort({ updatedAt: -1 });

		const allmessage = newmessage.map((msg) => {
			return {
				myself: msg.sender.toString() === from,
				message: msg.message
			}
		})

		return res.status(200).json(allmessage);
	}
	catch (error) {
		return res.status(500).json("Internal Server Error");
	}
});

app.post("/msg", async (req, res) => {
	try {
		const { from, to, message } = req.body;
		const newmessage = await Message.create({
			message: message,
			Chatusers: [from, to],
			sender: from
		})

		return res.status(200).json(newmessage);
	}
	catch (error) {
		return res.status(500).json("Internal Server Error");
	}
});


app.use("/users", userRoutes);

import ChatMessage from './models/Rooms.js'


// Save chat message to MongoDB
app.post('/api/chatMessages', async (req, res) => {
  try {
    const { content, user, room } = req.body;
    const chatMessage = new ChatMessage({ content, user, room });
    await chatMessage.save();
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Fetch chat messages from MongoDB
app.get('/api/chatMessages', async (req, res) => {
  try {
    const chatMessages = await ChatMessage.find().sort({ _id: -1 }).limit(100);
    res.send(chatMessages.reverse());
  } catch (error) {
    res.status(500).send(error);
  }
});

io.on('connection', (socket) => {
  console.log('User connected to socket', socket.id);

  socket.on('message', async (message) => {
    // Save message to MongoDB
    const chatMessage = new ChatMessage({
      content: message.content,
      user: message.user,
      room: message.room,
    });
    await chatMessage.save();

    // Broadcast message to all connected users
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected from socket', socket.id);
  });
});


/*
MONGOOSE SETUP 
---------------
setup database for app
connection running on port 6001 (default) or PORT env var 
*/
const PORT = process.env.PORT || 6001;
mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
	})
	.catch((error) => console.log(`${error} did connect`));
