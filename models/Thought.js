const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
    reactionId: { type: mongoose.Schema.Types.ObjectId, default: () => new Types.ObjectId() },
    reactionBody: { type: String, required: true, maxLength: 280 },
    username: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
    // create getter method to format timestamp
});


const thoughtSchema = new mongoose.Schema({

    thoughtText: { type: String, required: true, minLength: 1, maxLength: 280 },
    createdAt: { type: Date, default: Date.now },
    // create getter method to format timestamp

    username: { type: String, required: true },
    reactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reaction' }]
});

thoughtSchema
    .virtual('reactionCount')
    .get(function () {
        return this.reactions.length;
    });

const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;