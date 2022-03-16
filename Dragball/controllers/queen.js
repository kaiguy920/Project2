// Import Dependencies
const express = require('express')
const mongoose = require('mongoose')
const Team = require('../models/team')
const Queen = require('../models/queen')

// Create router
const router = express.Router()

// Router Middleware
// Authorization middleware
// If you have some resources that should be accessible to everyone regardless of loggedIn status, this middleware can be moved, commented out, or deleted. 
router.use((req, res, next) => {
    // checking the loggedIn boolean of our session
    if (req.session.loggedIn) {
        // if they're logged in, go to the next thing(thats the controller)
        next()
    } else {
        // if they're not logged in, send them to the login page
        res.redirect('/auth/login')
    }
})

// Routes
// index to populate queen data to local database
router.post('/fave', (req, res) => {
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
    Queen.find({ owner: userId })
    Queen.find({})
        .then(queen => {
            console.log("queen", queen);
            res.render('Queens/fave', { queen, username, loggedIn })
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })

    // Queen.create(req.body)
    // .then((queen) => {
    //     console.log('this was returned from create', queen)
    //     res.render('Queens/fave')
    // })
    // .catch((err) => {
    //     console.log(err)
    //     res.json({ err })
    // })
})

// Export the Router
module.exports = router