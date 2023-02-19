import { format } from "morgan";
import User from "../models/Users.js";
/*READ*/
export const getUser = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);
		res.status(200).json(user);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

export const getUserFriends = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);

		const friends = await Promise.all(
			user.fiends.map((id) => User.findById(id))
		);

		const formattedFriends = friends.map(
			({ _id, firstName, lastName, occupation, location, picturePath }) => {
				return { _id, firstName, lastName, occupation, location, picturePath };
			}
		);
		res.status(200).json(formattedFriends);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

/*UPDATE*/
export const addRemoveFriend = async (req, res) => {
	try {
		const { id, friendId } = req.params;
		const user = await User.findById(id);
		const friend = await User.findById(friendId);

		if (user.fiends.includes(friendId)) {
			user.fiends = user.fiends.filter((id) => id !== friendId);
			friend.fiends = friend.fiends.filter((id) => id !== id);
		} else {
			user.fiends.push(friendId);
			friend.fiends.push(id);
		}
		await user.save();
		await friend.save();

		const friends = await Promise.all(
			user.fiends.map((id) => User.findById(id))
		);

		const formattedFriends = friends.map(
			({ _id, firstName, lastName, occupation, location, picturePath }) => {
				return { _id, firstName, lastName, occupation, location, picturePath };
			}
		);

		res.status(200).json(formattedFriends);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};
