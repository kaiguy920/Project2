// Import Dependencies
const express = require('express')
const mongoose = require('mongoose')
const Team = require('../models/team')
const Queen = require('../models/queen')

// Create router
const router = express.Router()

// Router Middleware
// Authorization middleware
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



// =====================================================================
//                              ROUTES
// =====================================================================
// create -> POST route that actually calls the db and makes a new document of Queen to render to the fave's
router.post('/fave', (req, res) => {
    // destructure user info from req.session
    req.body.owner = req.session.userId
    Queen.create(req.body)
        .then((queen) => {
            console.log('this was returned from adding to fave\n', queen)
            res.redirect('/queen/fave/mine')
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})

// JSON route to get direct look at all the objects in Queen
// router.get("/json", (req, res) => {
//     Queen.find({})
//         .then(queen => {
//             res.send({ queen })
//         })
//         .catch(error => {
//             res.redirect(`/error?error=${error}`)
//         })
// })

//  SHOW route to display the queens selected as favorites
router.get('/fave/mine', (req, res) => {
    const { username, userId, loggedIn } = req.session
    Queen.find({ owner: userId })
        .then(queen => {
            res.render('Queens/fave', { queen, username, loggedIn })
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })

})

// DELETE route
router.delete('/fave/mine/:id', (req, res) => {
    // get the queen id
    const queenId = req.params.id
    // delete the queen
    Queen.findByIdAndRemove(queenId)
        .then((queen) => {
            console.log('this is the response from FBID', queen)
            res.redirect('/queen/fave/mine')
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})

// Export the Router
module.exports = router