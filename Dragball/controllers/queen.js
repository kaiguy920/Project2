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
        .then(queen => {
            res.render('Queens/fave', { queen, username, loggedIn })
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})

// new route -> GET route that renders our page with the form
router.get('/new', (req, res) => {
    const { username, userId, loggedIn } = req.session
    res.render('team/new', { username, loggedIn })
})

// create -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {
    req.body.ready = req.body.ready === 'on' ? true : false

    req.body.owner = req.session.userId
    Example.create(req.body)
        .then(example => {
            console.log('this was returned from create', example)
            res.redirect('/team')
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})



// delete route
router.delete('/:id', (req, res) => {
    const exampleId = req.params.id
    Example.findByIdAndRemove(exampleId)
        .then(example => {
            res.redirect('/team')
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})

// Export the Router
module.exports = router