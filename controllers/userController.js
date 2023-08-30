const { User, Thought } = require('../models');

// create the routes for the user controller
module.exports = {
    // get all users
    async getAllUsers(req, res) {
        try {
            const allUsers = await User.find({});
            res.json(allUsers);
        } catch (err) {
            res.status(400).json('Error: ' + "There was an error getting all users");
        }   
    },

    // get one user by its _id and populated thought and friend data
    async getUserById(req, res) {
        try {
            const oneUser = await User.findOne({ _id: req.params.userId })
                .select('-__v')
                .populate({
                    path: 'thoughts',
                    select: 'thoughtText'
                })
                .populate({
                    path: 'friends',
                    select: 'username'
                });

            if (!oneUser) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(oneUser);
        } catch (err) {
            console.log(err);
            res.status(400).json({message: "There was an error getting one user"});
        }
    },

    // post/create a new user
    async createUser(req, res) {
        try {
            const newUser = await User.create(req.body);
            res.json(newUser);
        } catch (err) {
            res.status(400).json('Error: ' + "There was an error creating a new user");
        }
    },

    // update a user by its _id
    async updateUser(req, res) {
        try {
            const userUpdate = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            );
            if (!userUpdate) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json({ message: "User updated!" });
        } catch (err) {
            console.log(err);
            res.status(400).json({message: "There was an error updating user"});
        }   
    },

    // delete a user by its _id
    async deleteUser(req, res) {
        try { 
            const userDelete = await User.findOneAndDelete({ _id: req.params.userId });
            if (!userDelete) {
                return res.status(404).json({ message: 'No user found with this id!' });
            }
            //remove a user's associated thoughts when deleted
            await Thought.deleteMany({ username: userDelete.username });
            res.json({ message: 'User and associated thoughts deleted!' });
        } catch (err) {
            res.status(400).json({message: "There was an error deleting user"});
        }
    },

    // add a friend to a user's friend list
    async addFriend(req, res) {
        try {
            const addFriend = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            );
            if (!addFriend) {
                return res.status(404).json({ message: 'No user found with this id!' });
            }
            res.json(addFriend);
        } catch (err) {
            res.status(400).json({message: "There was an error adding friend"});
        }
    },

    // remove a friend from a user's friend list
    async removeFriend(req, res) {
        try {
            const removeFriend = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            );
            if (!removeFriend) {
                return res.status(404).json({ message: 'No user found with this id!' });
            }
            res.json(removeFriend);
        } catch (err) {
            res.status(400).json({message: "There was an error removing friend"});
        }
    }
};



