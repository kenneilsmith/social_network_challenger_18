const router = require('express').Router()
const Thought = require('../models/Thought')
const User = require('../models/User')

// GET all thoughts
router.get('/thoughts', async (req, res) => {
    try {
        const thoughts = await Thought.find().populate('reactions')
        if (!thoughts) {
            res.status(404).json({ message: 'No thoughts found!' })
            return
        }
        res.status(200).json(thoughts)
    } catch (err) {
        res.status(400).json(err)
    }
}
)

// GET a single thought by its _id
router.get('/thoughts/:id', async (req, res) => {
    try {
        const thought = await Thought.findOne({ _id: req.params.id })
        if (!thought) {
            res.status(404).json({ message: 'No thought found with this id!' })
            return
        }
        res.status(200).json(thought)
    } catch (err) {
        res.status(400).json(err)
    }
}
)

// POST to create a new thought and push the created thought's _id to the associated user's thoughts array field)
router.post('/thoughts', async (req, res) => {
    try {
        console.log(req.body)
        const user = await User.findOne({ username: req.body.username })
        if (!user) {
            res.status(404).json({ message: 'No user found with this username!' })
            return
        }
        const thought = await Thought.create(req.body)
        user.thoughts.push(thought._id)
        await user.save()
        res.status(200).json(thought)

    } catch (err) {
        res.status(400).json(err)
    }
}
)

// add a reaction to a thought and push the created reaction's _id to the associated thought's reactions array field
router.post('/thoughts/:id/reactions', async (req, res) => {
    try {
        const reaction = await Thought.findOneAndUpdate(
            { _id: req.params.id },
            { $push: { reactions: req.body } },
            { new: true }
        )
        res.status(200).json(reaction)
    } catch (err) {
        res.status(400).json(err)
    }
}
)


//delete a thought by its _id
router.delete('/thoughts/:id', async (req, res) => {
    try {
        const thought = await Thought.findOneAndDelete({ _id: req.params.id })
        if (!thought) {
            res.status(404).json({ message: 'No thought found with this id!' })
            return
        }
        res.status(200).json({ message: 'Thought deleted!' })
    } catch (err) {
        res.status(400).json(err)
    }
})


// remove a reaction from a thought and pull the reaction's _id from the associated thought's reactions array field

router.delete('/thoughts/:id/reactions/:reactionId', async (req, res) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.id },
            // { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true }
        )
        thought.reactions.pull({ _id: req.params.reactionId })
        await thought.save()


        res.status(200).json({ message: 'Reaction deleted!' })
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
}
)



module.exports = router
