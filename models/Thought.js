const { Schema, Types, model } = require("mongoose");
const dayjs = require("dayjs");

//schema for reaction
const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxLength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // use a getter method to format the timestamp on query
      get: (date) => dayjs(date).format("MM/DD/YYYY"),
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

//schema for thoughts
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // create getter method to format timestamp
      get: (date) => dayjs(date).format("MM/DD/YYYY"),
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// define the reactionCount getter on the thoughtSchema
thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thought = model("Thought", thoughtSchema);

module.exports = Thought;
