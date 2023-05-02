const router = require('express').Router()
const User = require('../models/User')
const Thought = require('../models/Thought')


// GET all users
router.get('/users', async (req, res) => {
    try {
        console.log('before the find')
        const users = await User.find().populate('thoughts').populate('friends')
        console.log(`users: ${users.length}`)
        if (!users) {
            res.status(404).json({ message: 'No users found!' })
            return
        }
        returnedUsers = await users.map(user => {
            const returnedUser = user.toObject()

            if (returnedUser.friends.length === 0) {
                returnedUser.friends = ['no friends yet']
            }
            if (returnedUser.thoughts.length === 0) {
                returnedUser.thoughts = ['no thoughts yet']
            }
            return returnedUser
        })

        res.status(200).json(returnedUsers)

    } catch (err) {
        res.status(400).json(err)
    }
})

// GET a single user by its _id and populated thought and friend data
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).populate('thoughts').populate('friends')
        if (!user) {
            res.status(404).json({ message: 'No user found with this id!' })
            return
        }
        res.status(200).json(user)
    } catch (err) {
        res.status(400).json(err)
    }
})


// POST a new user:
router.post('/users', async (req, res) => {
    try {
        const user = await User.create(req.body)
        res.status(200).json(user)
    } catch (err) {
        res.status(400).json(err)
    }
})


// PUT to update a user by its _id
router.put('/users/:id', async (req, res) => {
    try {
        const user_data = req.body
        console.log(user_data)
        const user = await User.findOneAndUpdate(
            {
                _id: req.params.id
            },
            {
                email: user_data.email,
                username: user_data.username,
            },
            { new: true }

        )
        console.log(user)
        res.status(200).json(user)
    } catch (err) {
        res.status(400).json(err)
    }
})

// DELETE to remove user by its _id and associated thoughts
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findOneAndDelete({
            _id: req.params.id
        })
        await Thought.deleteMany({ username: user.username })
        if (!user) {
            res.status(404).json({ message: 'No user found with this id!' })
            return
        }
        res.status(200).json(user)
    } catch (err) {
        res.status(400).json(err)

    }

})

// add a friend to a user's friend list
router.post('/users/:userId/friends/:friendId', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $push: { friends: req.params.friendId } },
            { new: true }
        )
        res.status(200).json(user)
    } catch (err) {
        res.status(400).json(err)
    }
})


//delete a friend from a user's friend list
router.delete('/users/:userId/friends/:friendId', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { new: true }
        )
        res.status(200).json(user)
    } catch (err) {
        res.status(400).json(err)
    }
})










module.exports = router
