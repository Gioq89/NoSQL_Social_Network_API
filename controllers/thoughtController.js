const { User, Thought } = require("../models");

// create the routes for the thought controller
module.exports = {
  // get all thoughts
  async getAllThoughts(req, res) {
    try {
      const allThoughts = await Thought.find({});
      res.json(allThoughts);
    } catch (err) {
      res
        .status(400)
        .json("Error: " + "There was an error getting all thoughts");
    }
  },

  // get one thought by its _id
  async getThoughtById(req, res) {
    try {
      const oneThought = await Thought.findOne({
        _id: req.params.thoughtId,
      }).select("-__v");
      if (!oneThought) {
        res.status(404).json({ message: "No thought found with this id!" });
        return;
      }
      res.json(oneThought);
    } catch (err) {
      res
        .status(400)
        .json({ message: "There was an error getting one thought" });
    }
  },
  // create a new thought and push the created thought's _id to the associated user's thoughts array field
  async createThought(req, res) {
    try {
      const newThought = await Thought.create(req.body);
      const userUpdate = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: newThought._id } },
        { runValidators: true, new: true }
      );
      if (!userUpdate) {
        res.status(404).json({ message: "No user found with this id!" });
        return;
      }
      res.json({ message: "Thought created!" });
    } catch (err) {
      res
        .status(400)
        .json("Error: " + "There was an error creating a new thought");
    }
  },

  // update a thought by its _id
  async updateThought(req, res) {
    try {
      const thoughtUpdate = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!thoughtUpdate) {
        res.status(404).json({ message: "No thought found with this id!" });
        return;
      }
      res.json({ message: "Thought updated!" });
    } catch (err) {
      res.status(400).json({ message: "There was an error updating thought" });
    }
  },

  // delete a thought by its _id and remove the deleted thought's _id from the associated user's thoughts array field
  async deleteThought(req, res) {
    try {
      const thoughtDelete = await Thought.findOneAndDelete({
        _id: req.params.thoughtId,
      });
      if (!thoughtDelete) {
        return res
          .status(404)
          .json({ message: "No thought found with this id!" });
      }

      const thoughtUser = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $pull: { thoughts: req.params.thoughtId } },
        { runValidators: true, new: true }
      );

      res.json(thoughtDelete, thoughtUser);
    } catch (err) {
      res.status(400).json({ message: "There was an error deleting thought" });
    }
  },

  // create a reaction stored in a single thought's reactions array field
  async createReaction(req, res) {
    try {
      const reactionCreate = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $push: { reactions: req.body } },
        { runValidators: true, new: true }
      );
      if (!reactionCreate) {
        res.status(404).json({ message: "No thought found with this id!" });
        return;
      }
      res.json(reactionCreate);
    } catch (err) {
      res.status(400).json({ message: "There was an error creating reaction" });
    }
  },

  // delete a reaction by the reaction's reactionId value
  async deleteReaction(req, res) {
    try {
      const reactionDelete = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: {reactionId: req.body.reactionId } } },
        { runValidators: true, new: true }
      );
      if (!reactionDelete) {
        return res
          .status(404)
          .json({ message: "No thought found with this id!" });
      }
      res.json(reactionDelete);
    } catch (err) {
      res.status(400).json({ message: "There was an error deleting reaction" });
    }
  },
};
