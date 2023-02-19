import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import { fileURLToPath } from "url";
import path from "path";
// register endpoint
import authRoutes from "./routes/auth.js";
import { register } from "./controllers/auth.js";
import Message from "./models/Message.js";

/*CONFIGURATIONS
-----------------
*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
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

app.get("/get/chat/msg/:user1Id/:user2Id", async (req, res) => {
	try {
		const from = req.params.user1Id;
		const to = req.params.user2Id;
		const newmessage = await Message.find({
			Chatusers: {
				$all:[from, to],

			}
		}).sort({updatedAt:-1});

		const allmessage = newmessage.map((msg)=>{
			return {
				myself:msg.sender.toString() === from,
				message : msg.message
			}
		})

		return res.status(200).json(allmessage);
	}
	catch (error) {
		return res.status(500).json("Internal Server Error");
	}
});

/**
 * Socket IO
 */
// const socketIO = require('socket.io')(http, {
// 	cors: {
// 		origin: "http://localhost:4000"
// 	}
// });

// socketIO.on('connection', (socket) => {
// 	console.log(``)
// })

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
