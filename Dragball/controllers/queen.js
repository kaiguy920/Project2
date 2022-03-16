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


router.get('/fave', (req, res) => {
    // we need to get the id
    const queenId = req.body.id
    console.log("*********body odyyy2*************", req.params.id);
    // find the queen
    Queen.findById(queenId)
        // -->render if there is a fruit
        .then((queen) => {
            console.log('da queen\n', queen)
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            res.render('Queens/fave', { queen, username, loggedIn })
        })

        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})

// Routes
// index to populate queen data to local database
router.post('/fave', (req, res) => {
    // destructure user info from req.session
    console.log("*********body odyyy*************", req.body);
    req.body.owner = req.session.userId
    Queen.create(req.body)
        .then((queen) => {
            // console.log('this was returned from adding to fave\n', queen)
            res.redirect(`dragball/${queenId}`)
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})



// const { username, userId, loggedIn } = req.session
// Queen.find({ owner: userId })
// Queen.find({})
//     .then(queen => {
//         // can only do redirect on post routes
//         console.log("queen", queen);
//         res.redirect('dragball/2', { queen, username, loggedIn })
//     })
//     .catch(error => {
//         res.redirect(`/error?error=${error}`)
//     })

// Queen.create(req.body)
// .then((queen) => {
//     console.log('this was returned from create', queen)
//     res.render('Queens/fave')
// })
// .catch((err) => {
//     console.log(err)
//     res.json({ err })
// })


// 

// Export the Router
module.exports = router