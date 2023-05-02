const express = require('express')
PORT = process.env.PORT || 3000
const db = require('./config/connection')
const user_routes = require('./controllers/user_routes')
const thought_routes = require('./controllers/thought_routes')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', user_routes, thought_routes)

db.once('open', () => {
    app.listen(PORT, () => console.log(`Now listening on localhost:${PORT}`))
}
)
