import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import patth from "path";
import { fileURLToPath } from "url";
import path from "path";
// register endpoint
import authRoutes from "./routes/auth.js";
import { register } from "./controllers/auth.js";

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
