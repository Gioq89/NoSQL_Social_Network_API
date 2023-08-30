const router = require("express").Router();

// variables for the thought controller
const {
  getAllThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  createReaction,
  deleteReaction,
} = require("../../controllers/thoughtController");

// /api/thoughts
router.route("/")
    .get(getAllThoughts)
    .post(createThought);

// /api/thoughts/:thoughtId
router.route("/:thoughtId")
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);

// /api/thoughts/:thoughtId/reactions
router.route("/:thoughtId/reactions")
    .post(createReaction)   
    .delete(deleteReaction);

module.exports = router;
