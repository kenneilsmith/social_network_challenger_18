const { Schema, model } = require('mongoose')

// Create the ReactionSchema
const ReactionsSchema = new Schema({
    // Set custom id to avoid confusion with parent comment's _id field
    reactionId: {
        type: Schema.Types.ObjectId,

    },
    reactionBody: {
        type: String,
        required: 'Reaction is required',
        maxlength: 280,
        trim: true
    },
    username: {
        type: String,
        required: 'Username is required',
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // Use a getter method to format the timestamp on query
        get: createdAtVal => dateFormat(createdAtVal)
    }
})

const thoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: 'Thought is required',
        minlength: 1,
        maxlength: 280,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // Use a getter method to format the timestamp on query
        get: createdAtVal => dateFormat(createdAtVal)
    },
    username: {
        type: String,
        required: 'Username is required',
        trim: true

    },
    // Use ReactionsSchema to validate data for a reply
    reactions: [ReactionsSchema]

})



// Create the Thought model using the thoughtSchema
const Thought = model('Thought', thoughtSchema)

module.exports = Thought