import express from "express";
import { verify } from "jsonwebtoken";
import {
	getUser,
	getUserFriends,
	addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/*READ
---------
get user data profile
get user friends list
*/
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

/*UPDATE
-----------
add a friend to current users friends list
*/
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;
